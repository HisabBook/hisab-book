import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  theme: "light",
  exchangeRate: 70,
  language: "en",
};

// Create the slice
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setExchangeRate: (state, action) => {
      // Updates the global USD to AFN rate used in the POS and Dashboard
      state.exchangeRate = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

// Export actions for components to use
export const { toggleTheme, setExchangeRate, setLanguage } =
  settingsSlice.actions;
export default settingsSlice.reducer;
