import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';


// POS Slice
import {
  closeCheckout,
  resetPOS,
  selectCartItems,
  selectCustomer,
  selectTradeIn,
  selectTransactionType,
  setLastInvoiceNumber,
} from '../redux/slices/posSlice';

// Sales and Expenses Slices
import { addSale } from '../redux/slices/salesSlice';
import { addExpense } from '../redux/slices/roznamchaSlice';

// Inventory Slice
import {
  addPhone,
  decreaseAccessoryQty,
  markLaptopSold,
  markPhoneSold,
  selectPhoneImeiSet,
} from '../redux/slices/inventorySlice';

// Khata and Settings Slices
import {
  createDebtRecord,
  selectAllCustomers,
} from '../redux/slices/khataSlice';
import { selectExchangeRate, selectShopSettings } from '../redux/slices/settingsSlice';

// Utilities
// Note: We assume the PDF utility is in a global utils folder
import { generateInvoicePDF } from '../utils/generateInvoicePDF'; 

// --- Helper Functions ---
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const normalize = (value) => String(value ?? '').trim().toLowerCase();
const toUSD = (value, currency, rate) => (rate > 0 && currency === 'AFN' ? value / rate : value);
const fromUSD = (value, currency, rate) => (currency === 'AFN' ? value * rate : value);

export const useCheckout = () => {
  const dispatch = useDispatch();

  // --- Redux State Selection (Combined from both versions) ---
  const cartItems = useSelector(selectCartItems);
  const tempCustomer = useSelector(selectCustomer);
  const allCustomers = useSelector(selectAllCustomers);
  const tradeIn = useSelector(selectTradeIn);
  const transactionType = useSelector(selectTransactionType);
  const exchangeRate = useSelector(selectExchangeRate);
  const existingImeiSet = useSelector(selectPhoneImeiSet);
  const shopProfile = useSelector(selectShopSettings);

  // --- Memoized Pricing Engine ---
  const pricing = useMemo(() => {
    const subtotalUSD = cartItems.reduce((sum, item) => {
        const itemPrice = Number(item.sellPrice) || 0;
        const itemQty = Number(item.quantity) || 1;
        return sum + toUSD(itemPrice * itemQty, item.currency, exchangeRate);
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
  }, [cartItems, exchangeRate, tradeIn, transactionType]);

  const finalizeCheckout = async ({
    selectedCurrency,
    amountPaid,
    customerName,
    customerPhone,
    t,
    i18n,
  }) => {
    // --- Pre-flight Validations ---
    const tradeInImei = normalize(tradeIn.imei);
    if (transactionType === 'Exchange') {
       if (!tradeIn.model?.trim()) {
         return { ok: false, error: 'INVALID_TRADE_IN_MODEL', message: 'Trade-in phone model is required.' };
      }
      if (!/^\d{15}$/.test(tradeInImei)) {
        return { ok: false, error: 'INVALID_TRADE_IN_IMEI', message: 'Trade-in IMEI must be exactly 15 digits.' };
      }
      if (existingImeiSet.has(tradeInImei)) {
        return { ok: false, error: 'DUPLICATE_TRADE_IN_IMEI', message: 'This trade-in device already exists in the inventory.' };
      }
    }
    
    const paid = round2(Number(amountPaid) || 0);
    const netTotal = round2(fromUSD(pricing.netTotalUSD, selectedCurrency, exchangeRate));
    const dueAmount = paid >= netTotal ? 0 : round2(netTotal - paid);
    const changeAmount = paid > netTotal ? round2(paid - netTotal) : 0;
    const hasDebt = dueAmount > 0;

    if (hasDebt && (!customerName?.trim() || !customerPhone?.trim())) {
      return { ok: false, error: 'CUSTOMER_REQUIRED_FOR_DEBT', message: 'Customer name and phone are required for debt sales.' };
    }

    const now = new Date();
    const saleDate = now.toISOString().slice(0, 10);
    const saleId = uid('sale');
    const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    // --- Debt Management (using the better 'main' branch logic) ---
    let customerId = tempCustomer.id;
    if (hasDebt) {
        const normalizedPhone = customerPhone.trim();
        const existingCustomer = allCustomers.find((c) => c.phone.trim() === normalizedPhone);
        customerId = existingCustomer?.id ?? uid('cust');

        dispatch(createDebtRecord({
            id: uid('debt'),
            customerId,
            customer: { id: customerId, name: customerName.trim(), phone: normalizedPhone },
            totalDebt: dueAmount,
            currency: selectedCurrency,
            linkedSaleId: saleId,
            linkedSaleNumber: invoiceNumber,
            linkedSaleDate: saleDate,
        }));
    }

    cartItems.forEach((item) => {
      if (item.type === 'phone') dispatch(markPhoneSold(item.itemId));
      else if (item.type === 'laptop') dispatch(markLaptopSold(item.itemId));
      else if (item.type === 'accessory') dispatch(decreaseAccessoryQty({ id: item.itemId, qty: item.quantity }));
    });

    if (transactionType === 'Exchange' && tradeInImei) {
      dispatch(addPhone({
        id: uid('ph'),
        imei: tradeIn.imei.trim(),
        brand: tradeIn.brand,
        model: tradeIn.model.trim(),
        condition: 'Used',
        purchasePrice: pricing.tradeInUSD,
        currency: 'USD',
        stockStatus: 'Available',
        dateAdded: saleDate,
        createdAt: now.toISOString(),
        notes: `Traded-in via sale ${invoiceNumber}`,
        color: '', ram: '', rom: '', batteryHealth: 0, sellPrice: 0,
      }));

      if (pricing.tradeInUSD > 0) {
        dispatch(addExpense({
          id: `exp_trade_${saleId}`,
          category: 'Stock Purchase',
          amount: pricing.tradeInUSD,
          currency: 'USD',
          description: `Trade-in Value: ${tradeIn.brand || ''} ${tradeIn.model || ''}`.trim(),
          date: saleDate,
          notes: `Value for old device on sale ${invoiceNumber}`,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        }));
      }
    }

    const sale = {
      id: saleId,
      customerId: customerId || null,
      customerName: customerName?.trim() || tempCustomer.name || 'Walk-in',
      customerPhone: customerPhone?.trim() || tempCustomer.phone || '',
      items: cartItems,
      subtotal: round2(fromUSD(pricing.subtotalUSD, selectedCurrency, exchangeRate)),
      tradeInDeduction: round2(fromUSD(pricing.tradeInUSD, selectedCurrency, exchangeRate)),
      totalAmount: netTotal,
      amountPaid: paid,
      dueAmount,
      changeAmount,
      currency: selectedCurrency,
      saleType: transactionType,
      saleDate,
      createdAt: now.toISOString(),
      invoiceNumber,
      tradeIn: transactionType === 'Exchange' ? { ...tradeIn, tradeInValue: Number(tradeIn.tradeInValue) || 0 } : null,
    };
    
    dispatch(addSale(sale));
    dispatch(setLastInvoiceNumber(invoiceNumber));

    const pdf = await generateInvoicePDF({ sale, shopProfile, t, i18n, exchangeRate });

    dispatch(closeCheckout());
    dispatch(resetPOS());

    return { ok: true, sale, pdf };
  };

  return { pricing, finalizeCheckout };
};