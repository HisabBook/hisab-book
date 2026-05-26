import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSale } from '../../../redux/slices/salesSlice';
import {
  closeCheckout,
  resetPOS,
  selectCartItems,
  selectCustomer,
  selectTradeIn,
  selectTransactionType,
  setLastInvoiceNumber,
} from '../../../redux/slices/posSlice';
import {
  decreaseAccessoryQty,
  markPhoneSold,
} from '../../../redux/slices/inventorySlice';
import {
  addCustomer,
  increaseDebt,
  selectAllCustomers,
} from '../../../redux/slices/khataSlice';
import {
  selectExchangeRate,
  selectLanguage,
  selectShopProfile,
} from '../../../redux/slices/settingsSlice';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const uid = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const toUSD = (value, currency, rate) =>
  currency === 'AFN' ? value / rate : value;
const fromUSD = (value, currency, rate) =>
  currency === 'AFN' ? value * rate : value;

export const useCheckout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const customer = useSelector(selectCustomer);
  const customers = useSelector(selectAllCustomers);
  const tradeIn = useSelector(selectTradeIn);
  const transactionType = useSelector(selectTransactionType);
  const exchangeRate = useSelector(selectExchangeRate);
  const shopProfile = useSelector(selectShopProfile);
  const language = useSelector(selectLanguage);

  const pricing = useMemo(() => {
    const subtotalUSD = cartItems.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      const unit = Number(item.sellPrice) || 0;
      const line = unit * qty;
      return sum + toUSD(line, item.currency, exchangeRate);
    }, 0);

    const tradeInUSD =
      transactionType === 'Exchange'
        ? toUSD(Number(tradeIn.tradeInValue) || 0, tradeIn.currency, exchangeRate)
        : 0;

    const netTotalUSD = Math.max(0, subtotalUSD - tradeInUSD);
    return {
      subtotalUSD: round2(subtotalUSD),
      tradeInUSD: round2(tradeInUSD),
      netTotalUSD: round2(netTotalUSD),
    };
  }, [cartItems, exchangeRate, tradeIn.currency, tradeIn.tradeInValue, transactionType]);

  const finalizeCheckout = async ({
    selectedCurrency,
    amountPaid,
    customerName,
    customerPhone,
    t,
  }) => {
    const paid = round2(Number(amountPaid) || 0);
    const netTotal = round2(fromUSD(pricing.netTotalUSD, selectedCurrency, exchangeRate));
    const dueAmount = paid >= netTotal ? 0 : round2(netTotal - paid);
    const changeAmount = paid > netTotal ? round2(paid - netTotal) : 0;
    const hasDebt = dueAmount > 0;

    if (hasDebt && (!customerName?.trim() || !customerPhone?.trim())) {
      return { ok: false, error: 'CUSTOMER_REQUIRED_FOR_DEBT' };
    }

    const now = new Date();
    const saleDate = now.toISOString().slice(0, 10);
    const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    let customerId = customer.id;
    if (hasDebt) {
      const normalizedPhone = customerPhone.trim();
      const existing = customers.find((item) => item.phone.trim() === normalizedPhone);
      if (existing) {
        customerId = existing.id;
      } else {
        customerId = uid('cust');
        dispatch(
          addCustomer({
            id: customerId,
            name: customerName.trim(),
            phone: normalizedPhone,
            email: '',
            debtAmount: 0,
            currency: selectedCurrency,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            notes: '',
          })
        );
      }
    }

    const sale = {
      id: uid('sale'),
      customerId: customerId || null,
      customerName: customerName?.trim() || customer.name || 'Walk-in',
      items: cartItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        sellPrice: Number(item.sellPrice) || 0,
      })),
      totalAmount: netTotal,
      amountPaid: paid,
      dueAmount,
      changeAmount,
      currency: selectedCurrency,
      saleType: transactionType,
      saleDate,
      createdAt: now.toISOString(),
      invoiceNumber,
      tradeIn:
        transactionType === 'Exchange'
          ? {
              ...tradeIn,
              tradeInValue: Number(tradeIn.tradeInValue) || 0,
            }
          : null,
      tradeInDeduction:
        transactionType === 'Exchange'
          ? round2(fromUSD(pricing.tradeInUSD, selectedCurrency, exchangeRate))
          : 0,
    };

    // 1) Generate PDF first while UI is locked (Backdrop).
    await generateInvoicePDF({
      sale,
      exchangeRate,
      shopProfile,
      language,
      t,
    });

    // 2) Apply inventory changes.
    sale.items.forEach((item) => {
      if (item.type === 'phone') dispatch(markPhoneSold(item.itemId));
      if (item.type === 'accessory') {
        dispatch(decreaseAccessoryQty({ id: item.itemId, qty: item.quantity }));
      }
    });

    // 3) Record debt after successful PDF generation.
    if (hasDebt && customerId) {
      dispatch(increaseDebt({ customerId, amount: dueAmount }));
    }

    // 4) Save sale + reset POS.
    dispatch(addSale(sale));
    dispatch(setLastInvoiceNumber(invoiceNumber));
    dispatch(closeCheckout());
    dispatch(resetPOS());

    return { ok: true, sale };
  };

  return { pricing, finalizeCheckout };
};
