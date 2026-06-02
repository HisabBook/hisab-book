import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSale } from '../redux/slices/salesSlice';
import {
  closeCheckout,
  resetPOS,
  selectCartItems,
  selectCartTotal, // Using the new, powerful selector
  selectCustomer,
  selectTradeIn,
  selectTransactionType,
  setIsFinalizingCheckout,
} from '../redux/slices/posSlice';
import {
  addPhone,
  decreaseAccessoryQty,
  markPhoneSold,
  selectPhoneImeiSet,
} from '../redux/slices/inventorySlice';
import {
  addCustomer,
  increaseDebt,
  selectAllCustomers,
} from '../redux/slices/khataSlice';
import { selectExchangeRate } from '../redux/slices/settingsSlice';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

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
  const cartTotal = useSelector(selectCartTotal); // Using the selector from the merged PR
  const customer = useSelector(selectCustomer);
  const customers = useSelector(selectAllCustomers);
  const tradeIn = useSelector(selectTradeIn);
  const transactionType = useSelector(selectTransactionType);
  const exchangeRate = useSelector(selectExchangeRate);
  const existingImeiSet = useSelector(selectPhoneImeiSet);

  // --- Memoized Pricing Engine ---
  const pricing = useMemo(() => {
    const subtotalUSD = cartTotal.usd; // Directly use the value from the smart selector

    const tradeInUSD =
      transactionType === 'Exchange'
        ? toUSD(tradeIn.tradeInValue || 0, tradeIn.currency, exchangeRate)
        : 0;

    const netTotalUSD = subtotalUSD - tradeInUSD; // This can correctly be negative

    return {
      subtotalUSD: round2(subtotalUSD),
      tradeInUSD: round2(tradeInUSD),
      netTotalUSD: round2(netTotalUSD),
    };
  }, [cartTotal.usd, exchangeRate, tradeIn, transactionType]);

  // --- Master Checkout Orchestrator ---
  const finalizeCheckout = ({
    selectedCurrency,
    amountPaid,
    customerName,
    customerPhone,
  }) => {
    dispatch(setIsFinalizingCheckout(true));

    // --- Step 1: Pre-flight Validation ---
    const tradeInImei = normalize(tradeIn.imei);
    if (transactionType === 'Exchange') {
      if (!/^\d{15}$/.test(tradeInImei)) {
        dispatch(setIsFinalizingCheckout(false));
        return {
          ok: false,
          error: 'INVALID_TRADE_IN_IMEI',
          message: 'Trade-in IMEI must be exactly 15 digits.',
        };
      }
      if (existingImeiSet.has(tradeInImei)) {
        dispatch(setIsFinalizingCheckout(false));
        return {
          ok: false,
          error: 'CIRCULAR_IMEI_LOOP',
          message: 'This trade-in device already exists in the inventory.',
        };
      }
    }

    // --- Step 2: Calculate Final Amounts ---
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
      dispatch(setIsFinalizingCheckout(false));
      return {
        ok: false,
        error: 'CUSTOMER_REQUIRED_FOR_DEBT',
        message: 'Customer name and phone are required for debt sales.',
      };
    }

    // --- Step 3: Dispatch State Updates ---
    const now = new Date();
    const saleDate = now.toISOString().slice(0, 10);
    const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    // A) Update Khata (Customer Debt) if necessary
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
            notes: 'Created via POS',
          })
        );
      }
      dispatch(increaseDebt({ customerId, amount: dueAmount }));
    }

    // B) Update Inventory (Deduct sold items)
    cartItems.forEach((item) => {
      if (item.type === 'phone' || item.type === 'laptop')
        dispatch(markPhoneSold(item.itemId));
      if (item.type === 'accessory') {
        dispatch(decreaseAccessoryQty({ id: item.itemId, qty: item.quantity }));
      }
    });

    // C) Update Inventory (Add trade-in item)
    if (transactionType === 'Exchange' && tradeInImei) {
      const tradedInPhone = {
        id: uid('ph'),
        imei: tradeIn.imei.trim(),
        brand: tradeIn.brand,
        model: tradeIn.model,
        condition: 'Used', // Strictly 'Used'
        purchasePrice: toUSD(
          tradeIn.tradeInValue || 0,
          tradeIn.currency,
          exchangeRate
        ), // The cost is its trade-in value in USD
        currency: 'USD',
        stockStatus: 'Available',
        dateAdded: saleDate,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        notes: `Traded-in via sale ${invoiceNumber}`,
        // Unspecified fields are blank for later manual entry
        color: '',
        ram: '',
        rom: '',
        batteryHealth: 0,
        sellPrice: 0,
      };
      dispatch(addPhone(tradedInPhone));
    }

    // D) Log the Final Sale
    const sale = {
      id: uid('sale'),
      customerId,
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
      tradeIn: transactionType === 'Exchange' ? { ...tradeIn } : null,
      tradeInDeduction: round2(
        pricing.tradeInUSD * (selectedCurrency === 'AFN' ? exchangeRate : 1)
      ),
    };
    dispatch(addSale(sale));

    // --- Step 4: Finalize and Cleanup ---
    // Use a small timeout to allow Redux state to settle before PDF generation
    setTimeout(() => {
      generateInvoicePDF(sale);
      dispatch(closeCheckout());
      dispatch(resetPOS()); // This will also set isFinalizingCheckout to false
    }, 500);

    return { ok: true, sale };
  };

  return { pricing, finalizeCheckout };
};
