import { createSlice } from '@reduxjs/toolkit';
import { mockExpenses } from '../../mockData/initialData';

const roznamchaSlice = createSlice({
  name: 'roznamcha',
  initialState: {
    expenses: mockExpenses,
  },
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    updateExpense(state, action) {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.expenses[index] = action.payload;
    },
    deleteExpense(state, action) {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addExpense, updateExpense, deleteExpense } =
  roznamchaSlice.actions;

export const selectAllExpenses = (state) => state.roznamcha.expenses;
export const selectTodayExpenses = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.roznamcha.expenses.filter((e) => e.date === today);
};

export default roznamchaSlice.reducer;
