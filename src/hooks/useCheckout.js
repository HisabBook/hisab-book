import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addSale } from '../redux/slices/salesSlice';
import { addExpense } from '../redux/slices/roznamchaSlice';
import {
  closeCheckout,
  resetPOS,
  selectCartItems,
  selectCustomer,
  selectTradeIn,
  selectTransactionType,
} from '../redux/slices/posSlice';
import {
  addPhone,
  decreaseAccessoryQty,
  markLaptopSold,
  markPhoneSold,
  selectPhoneImeiSet,
} from '../redux/slices/inventorySlice';
import { addDebt } from '../redux/slices/khataSlice';
import { selectExchangeRate } from '../redux/slices/settingsSlice';

// --- Helper Functions ---
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;
const uid = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();
const toUSD = (value, currency, rate) =>
  rate > 0 && currency === 'AFN' ? value / rate : value;

export const useCheckout = () => {
  const dispatch = useDispatch();

  // --- Redux State ---
  const cartItems = useSelector(selectCartItems);
  const tempCustomer = useSelector(selectCustomer);
  const transactionType = useSelector(selectTransactionType);
  const exchangeRate = useSelector(selectExchangeRate);
  const existingImeiSet = useSelector(selectPhoneImeiSet);
  const tradeIn = useSelector(selectTradeIn);

  // --- Memoized Pricing Engine ---
  const pricing = useMemo(() => {
    const subtotalUSD = cartItems.reduce((sum, item) => {
      const itemPrice = item.sellPrice || 0;
      const itemQty = item.quantity || 1;
      return sum + toUSD(itemPrice * itemQty, item.currency, exchangeRate);
    }, 0);

    const tradeInUSD =
      transactionType === 'Exchange'
        ? toUSD(tradeIn.tradeInValue || 0, tradeIn.currency, exchangeRate)
        : 0;
    const netTotalUSD = subtotalUSD - tradeInUSD;
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
  }) => {
    // --- Pre-flight Validation ---
    const tradeInImei = normalize(tradeIn.imei);
    if (transactionType === 'Exchange') {
      if (!tradeIn.model?.trim()) {
        return {
          ok: false,
          error: 'INVALID_TRADE_IN_MODEL',
          message: 'Trade-in phone model is required.',
        };
      }
      if (!/^\d{15}$/.test(tradeInImei)) {
        return {
          ok: false,
          error: 'INVALID_TRADE_IN_IMEI',
          message: 'Trade-in IMEI must be exactly 15 digits.',
        };
      }
      if (existingImeiSet.has(tradeInImei)) {
        return {
          ok: false,
          error: 'DUPLICATE_TRADE_IN_IMEI',
          message: 'This trade-in device already exists in the inventory.',
        };
      }
    }

    const netTotalInSelectedCurrency =
      selectedCurrency === 'AFN'
        ? pricing.netTotalUSD * exchangeRate
        : pricing.netTotalUSD;
    const netTotal = round2(netTotalInSelectedCurrency);
    const paid = round2(amountPaid || 0);
    const dueAmount = paid >= netTotal ? 0 : round2(netTotal - paid);
    const changeAmount = paid > netTotal ? round2(paid - netTotal) : 0;
    const hasDebt = dueAmount > 0;

    if (hasDebt && (!customerName?.trim() || !customerPhone?.trim())) {
      return {
        ok: false,
        error: 'CUSTOMER_REQUIRED_FOR_DEBT',
        message: 'Customer name and phone are required for debt sales.',
      };
    }

    const now = new Date();
    const saleDate = now.toISOString().slice(0, 10);
    const saleId = uid('sale');
    const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    if (hasDebt) {
      dispatch(
        addDebt({
          saleId: saleId,
          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
          },
          dueAmount: dueAmount,
          currency: selectedCurrency,
          createdAt: now.toISOString(),
        })
      );
    }

    cartItems.forEach((item) => {
      if (item.type === 'phone') dispatch(markPhoneSold(item.itemId));
      else if (item.type === 'laptop') dispatch(markLaptopSold(item.itemId));
      else if (item.type === 'accessory')
        dispatch(decreaseAccessoryQty({ id: item.itemId, qty: item.quantity }));
    });

    if (transactionType === 'Exchange' && tradeInImei) {
      const tradedInPhone = {
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
        color: '',
        ram: '',
        rom: '',
        batteryHealth: 0,
        sellPrice: 0,
      };
      dispatch(addPhone(tradedInPhone));

      if (pricing.tradeInUSD > 0) {
        const tradeInDescription =
          `Trade-in Value: ${tradeIn.brand || ''} ${tradeIn.model || ''}`.trim();
        dispatch(
          addExpense({
            id: `exp_trade_${saleId}`, // Unique, predictable ID
            category: 'Stock Purchase',
            amount: pricing.tradeInUSD,
            currency: 'USD',
            description: tradeInDescription,
            date: saleDate,
            notes: `Value for old device on sale ${invoiceNumber}`,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          })
        );
      }
    }

    const sale = {
      id: saleId,
      invoiceNumber,
      customerName: customerName?.trim() || tempCustomer.name || 'Walk-in',
      customerPhone: customerPhone?.trim() || tempCustomer.phone || '',
      items: cartItems,
      subtotal: round2(
        pricing.subtotalUSD * (selectedCurrency === 'AFN' ? exchangeRate : 1)
      ),
      tradeInDeduction: round2(
        pricing.tradeInUSD * (selectedCurrency === 'AFN' ? exchangeRate : 1)
      ),
      totalAmount: netTotal,
      amountPaid: paid,
      dueAmount,
      changeAmount,
      currency: selectedCurrency,
      saleType: transactionType,
      saleDate,
      createdAt: now.toISOString(),
      tradeIn: transactionType === 'Exchange' ? { ...tradeIn } : null,
    };
    dispatch(addSale(sale));
    dispatch(closeCheckout());
    dispatch(resetPOS());

    return { ok: true, sale };
  };

  return { pricing, finalizeCheckout };
};
