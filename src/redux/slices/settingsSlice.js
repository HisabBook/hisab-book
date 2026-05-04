import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  exchangeRate: 70, // 1 USD = 70 AFN
  primaryCurrency: 'USD', 
  language: 'en',
  shopName: 'HisabBook Store',
  shopAddress: 'Herat, Afghanistan',
  shopPhone: '+93 700 000 000',
  shopLogo: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    setTheme(state, action) {
      state.theme = action.payload;
    },

    setExchangeRate(state, action) {
      const rate = parseFloat(action.payload);
      if (!isNaN(rate) && rate > 0) {
        state.exchangeRate = rate;
      }
    },

    setPrimaryCurrency(state, action) {
      state.primaryCurrency = action.payload;
    },

    // ── Language: also syncs i18n in ThemeProviderWrapper ──
    setLanguage(state, action) {
      const validLangs = ['en', 'fa', 'ps'];
      if (validLangs.includes(action.payload)) {
        state.language = action.payload;
      }
    },

    updateShopProfile(state, action) {
      const { shopName, shopAddress, shopPhone, shopLogo } = action.payload;
      if (shopName !== undefined) state.shopName = shopName;
      if (shopAddress !== undefined) state.shopAddress = shopAddress;
      if (shopPhone !== undefined) state.shopPhone = shopPhone;
      if (shopLogo !== undefined) state.shopLogo = shopLogo;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setExchangeRate,
  setPrimaryCurrency,
  setLanguage,
  updateShopProfile,
} = settingsSlice.actions;

// ── Selectors
export const selectTheme = (state) => state.settings.theme;
export const selectExchangeRate = (state) => state.settings.exchangeRate;
export const selectLanguage = (state) => state.settings.language;
export const selectPrimaryCurrency = (state) => state.settings.primaryCurrency;
const selectSettings = (state) => state.settings;
export const selectShopProfile = createSelector([selectSettings], (settings) => ({
  shopName: settings.shopName,
  shopAddress: settings.shopAddress,
  shopPhone: settings.shopPhone,
  shopLogo: settings.shopLogo,
}));

export default settingsSlice.reducer;
