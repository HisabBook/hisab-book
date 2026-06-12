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
import { selectExchangeRate } from '../../../redux/slices/settingsSlice';
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

  const pricing = useMemo(() => {
    const subtotalUSD = cartItems.reduce(
      (sum, item) =>
        sum +
        toUSD(
          (Number(item.sellPrice) || 0) * (Number(item.quantity) || 1),
          item.currency,
          exchangeRate
        ),
      0
    );
    const tradeInUSD =
      transactionType === 'Exchange'
        ? toUSD(
            Number(tradeIn.tradeInValue) || 0,
            tradeIn.currency,
            exchangeRate
          )
        : 0;
    const netTotalUSD = Math.max(0, subtotalUSD - tradeInUSD);
    return {
      subtotalUSD: round2(subtotalUSD),
      tradeInUSD: round2(tradeInUSD),
      netTotalUSD: round2(netTotalUSD),
    };
  }, [
    cartItems,
    exchangeRate,
    tradeIn.currency,
    tradeIn.tradeInValue,
    transactionType,
  ]);

  const finalizeCheckout = async ({
    selectedCurrency,
    amountPaid,
    customerName,
    customerPhone,
  }) => {
    const paid = round2(Number(amountPaid) || 0);
    const netTotal = round2(
      fromUSD(pricing.netTotalUSD, selectedCurrency, exchangeRate)
    );
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
      const existing = customers.find(
        (item) => item.phone.trim() === normalizedPhone
      );
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
      dispatch(
        increaseDebt({
          customerId,
          amount: dueAmount,
        })
      );
    }

    cartItems.forEach((item) => {
      if (item.type === 'phone') dispatch(markPhoneSold(item.itemId));
      if (item.type === 'accessory') {
        dispatch(decreaseAccessoryQty({ id: item.itemId, qty: item.quantity }));
      }
    });

    const sale = {
      id: uid('sale'),
      customerId: customerId || null,
      customerName: customerName?.trim() || customer.name || 'Walk-in',
      items: cartItems,
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

    dispatch(addSale(sale));
    dispatch(setLastInvoiceNumber(invoiceNumber));
    dispatch(closeCheckout());
    dispatch(resetPOS());
    const pdf = await generateInvoicePDF(sale);
    return { ok: true, sale, pdf };
  };

  return { pricing, finalizeCheckout };
};
