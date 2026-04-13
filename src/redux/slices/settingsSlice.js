import { createSlice } from "@reduxjs/toolkit";

// The initialState now ONLY includes what was in the task description.
const initialState = {
  theme: "light",
  exchangeRate: 70,
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
    // The setLanguage reducer has been removed.
  },
});

// The setLanguage action has been removed from the export.
export const { toggleTheme, setExchangeRate } = settingsSlice.actions;

export default settingsSlice.reducer;
