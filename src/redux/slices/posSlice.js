import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  cartItems: [],
  customer: {
    id: null,
    name: '',
    phone: '',
  },
  transactionType: 'Standard', // 'Standard' | 'Exchange'

  // ── Trade-in (Exchange only)
  tradeIn: {
    brand: '',
    model: '',
    imei: '',
    condition: 'Used',
    tradeInValue: 0, // deducted from total bill
    currency: 'USD',
  },

  // ── Checkout
  selectedCurrency: 'USD', // 'USD' | 'AFN'
  amountPaid: 0,
  dueAmount: 0,

  // ── UI State
  isCheckoutOpen: false,
  lastInvoiceNumber: null,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // ── Cart Operations
    addToCart(state, action) {
      const item = action.payload;
      // For phones/laptops: prevent duplicate IMEI in cart
      if (item.imei) {
        const exists = state.cartItems.some((c) => c.imei === item.imei);
        if (exists) return;
      }
      state.cartItems.push({
        ...item,
        cartItemId: `cart_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        quantity: item.quantity ?? 1,
      });
    },

    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== action.payload
      );
    },

    updateCartItemQty(state, action) {
      const { cartItemId, quantity } = action.payload;
      const item = state.cartItems.find((c) => c.cartItemId === cartItemId);
      // Only accessories can have qty > 1
      if (item && item.type === 'accessory') {
        item.quantity = Math.max(1, quantity);
      }
    },

    clearCart(state) {
      state.cartItems = [];
    },

    // ── Customer
    setCustomer(state, action) {
      state.customer = { ...state.customer, ...action.payload };
    },

    clearCustomer(state) {
      state.customer = { id: null, name: '', phone: '' };
    },

    // ── Transaction Type
    setTransactionType(state, action) {
      state.transactionType = action.payload; // 'Standard' | 'Exchange'
      if (action.payload !== 'Exchange') {
        state.tradeIn = initialState.tradeIn;
      }
    },

    // ── Trade-in
    setTradeIn(state, action) {
      state.tradeIn = { ...state.tradeIn, ...action.payload };
    },

    clearTradeIn(state) {
      state.tradeIn = initialState.tradeIn;
    },

    // ── Checkout
    setSelectedCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },

    setAmountPaid(state, action) {
      state.amountPaid = action.payload;
    },

    setDueAmount(state, action) {
      state.dueAmount = action.payload;
    },

    openCheckout(state) {
      state.isCheckoutOpen = true;
    },

    closeCheckout(state) {
      state.isCheckoutOpen = false;
    },

    setLastInvoiceNumber(state, action) {
      state.lastInvoiceNumber = action.payload;
    },

    // ── Reset entire POS after successful sale
    resetPOS(state) {
      state.cartItems = [];
      state.customer = { id: null, name: '', phone: '' };
      state.transactionType = 'Standard';
      state.tradeIn = initialState.tradeIn;
      state.selectedCurrency = 'USD';
      state.amountPaid = 0;
      state.dueAmount = 0;
      state.isCheckoutOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQty,
  clearCart,
  setCustomer,
  clearCustomer,
  setTransactionType,
  setTradeIn,
  clearTradeIn,
  setSelectedCurrency,
  setAmountPaid,
  setDueAmount,
  openCheckout,
  closeCheckout,
  setLastInvoiceNumber,
  resetPOS,
} = posSlice.actions;

// ── Selectors
export const selectCartItems = (state) => state.pos.cartItems;
export const selectCartTotal = (state) =>
  state.pos.cartItems.reduce(
    (sum, item) => sum + item.sellPrice * item.quantity,
    0
  );
export const selectCustomer = (state) => state.pos.customer;
export const selectTransactionType = (state) => state.pos.transactionType;
export const selectTradeIn = (state) => state.pos.tradeIn;
export const selectSelectedCurrency = (state) => state.pos.selectedCurrency;
export const selectIsCheckoutOpen = (state) => state.pos.isCheckoutOpen;
export const selectAmountPaid = (state) => state.pos.amountPaid;
export const selectDueAmount = (state) => state.pos.dueAmount;

export default posSlice.reducer;
