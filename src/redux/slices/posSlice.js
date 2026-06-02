import { createSlice, createSelector } from '@reduxjs/toolkit';
import { selectExchangeRate } from './settingsSlice';

const initialState = {
  // Cart & Customer
  cartItems: [],
  customer: {
    id: null,
    name: '',
    phone: '',
  },

  // Transaction Flow State
  transactionType: 'Standard', // 'Standard' | 'Exchange'
  tradeIn: {
    brand: '',
    model: '',
    imei: '',
    condition: 'Used',
    tradeInValue: 0,
    currency: 'USD',
  },

  // Checkout & UI State
  selectedCurrency: 'USD',
  amountPaid: 0,
  dueAmount: 0,
  isCheckoutOpen: false,
  isFinalizingCheckout: false,
  lastInvoiceNumber: null,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // --- Core Cart Engine ---
    addToCart(state, action) {
      const itemPayload = action.payload;

      // Unique Item Validation (Phones/Laptops)
      if (itemPayload.type === 'phone' || itemPayload.type === 'laptop') {
        if (itemPayload.stockStatus === 'Sold') return;
        const uniqueIdentifier = itemPayload.imei || itemPayload.serialNumber;
        const isAlreadyInCart = state.cartItems.some(
          (cartItem) =>
            (cartItem.imei || cartItem.serialNumber) === uniqueIdentifier
        );
        if (isAlreadyInCart) return;
      }

      // Bulk Item Validation (Accessories)
      if (itemPayload.type === 'accessory') {
        if (itemPayload.availableQty <= 0) return;
        const existingItem = state.cartItems.find(
          (cartItem) => cartItem.itemId === itemPayload.itemId
        );
        if (existingItem) {
          const newQty = existingItem.quantity + 1;
          existingItem.quantity = Math.min(newQty, itemPayload.availableQty);
          return;
        }
      }

      state.cartItems.push({
        ...itemPayload,
        quantity: 1,
        cartItemId: `cart_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      });
    },

    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== action.payload
      );
    },

    // *** RENAMED based on feedback for consistency ***
    updateCartQty(state, action) {
      const { cartItemId, quantity } = action.payload;
      const item = state.cartItems.find((c) => c.cartItemId === cartItemId);

      if (item && item.type === 'accessory') {
        const requestedQty = Number(quantity);
        if (!Number.isFinite(requestedQty)) return;
        const clampedMin = Math.max(1, requestedQty);
        item.quantity = Math.min(clampedMin, Number(item.availableQty));
      }
    },

    clearCart(state) {
      state.cartItems = [];
    },

    // --- Customer & Transaction Management ---
    setCustomer(state, action) {
      state.customer = { ...state.customer, ...action.payload };
    },

    setTransactionType(state, action) {
      state.transactionType = action.payload;
      if (action.payload !== 'Exchange') {
        state.tradeIn = initialState.tradeIn;
      }
    },

    setTradeIn(state, action) {
      state.tradeIn = { ...state.tradeIn, ...action.payload };
    },

    // --- Checkout UI Flow ---
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
    setIsFinalizingCheckout(state, action) {
      state.isFinalizingCheckout = Boolean(action.payload);
    },
    setLastInvoiceNumber(state, action) {
      state.lastInvoiceNumber = action.payload;
    },

    // --- Global Reset ---
    resetPOS: () => initialState,
  },
});

// --- Actions ---
export const {
  addToCart,
  removeFromCart,
  updateCartQty, // *** RENAMED here as well ***
  clearCart,
  setCustomer,
  setTransactionType,
  setTradeIn,
  setSelectedCurrency,
  setAmountPaid,
  setDueAmount,
  openCheckout,
  closeCheckout,
  setIsFinalizingCheckout,
  setLastInvoiceNumber,
  resetPOS,
} = posSlice.actions;

// --- Selectors ---
export const selectCartItems = (state) => state.pos.cartItems;
export const selectCustomer = (state) => state.pos.customer;
export const selectTransactionType = (state) => state.pos.transactionType;
export const selectTradeIn = (state) => state.pos.tradeIn;
export const selectSelectedCurrency = (state) => state.pos.selectedCurrency;
export const selectIsCheckoutOpen = (state) => state.pos.isCheckoutOpen;
export const selectIsFinalizingCheckout = (state) =>
  state.pos.isFinalizingCheckout;
export const selectAmountPaid = (state) => state.pos.amountPaid;
export const selectDueAmount = (state) => state.pos.dueAmount;

export const selectCartTotal = createSelector(
  [selectCartItems, selectExchangeRate],
  (cartItems, exchangeRate) => {
    let totalUSD = 0;
    cartItems.forEach((item) => {
      const itemTotal = item.sellPrice * item.quantity;
      if (item.currency === 'USD') {
        totalUSD += itemTotal;
      } else if (item.currency === 'AFN' && exchangeRate > 0) {
        totalUSD += itemTotal / exchangeRate;
      }
    });
    return { usd: totalUSD, afn: totalUSD * exchangeRate };
  }
);

export default posSlice.reducer;
