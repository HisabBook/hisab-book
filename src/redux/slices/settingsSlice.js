import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shop: {
    name: 'HisabBook Electronics',
    logo: '',
    address: 'Kabul, Afghanistan',
    phone: '+93 788 000 000',
    invoiceNotes: 'Items once sold are not returnable.',
  },

  exchangeRate: 70.0, // Default exchange rate
  language: 'en', // 'en', 'fa', 'ps'
  theme: 'light', // 'light', 'dark'
  primaryCurrency: 'USD', // 'USD' or 'AFN'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setExchangeRate(state, action) {
      state.exchangeRate = Number(action.payload) || 0;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setPrimaryCurrency(state, action) {
      state.primaryCurrency = action.payload;
    },
    updateShopSettings(state, action) {
      state.shop = { ...state.shop, ...action.payload };
    },
  },
});

export const {
  setExchangeRate,
  setLanguage,
  toggleTheme,
  setPrimaryCurrency,
  updateShopSettings,
} = settingsSlice.actions;

// --- Selectors ---
export const selectExchangeRate = (state) => state.settings.exchangeRate;
export const selectTheme = (state) => state.settings.theme;
export const selectLanguage = (state) => state.settings.language;
export const selectPrimaryCurrency = (state) => state.settings.primaryCurrency;

export const selectShopSettings = (state) => state.settings.shop;

export default settingsSlice.reducer;
