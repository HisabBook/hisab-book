import { createSlice, createSelector } from '@reduxjs/toolkit';
import { mockExpenses } from '../../mockData/initialData';
import { selectAllSales } from './salesSlice';
import { selectAllRepayments } from './khataSlice';

const asNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

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

export const selectTodaySales = createSelector([selectAllSales], (sales) => {
  const today = new Date().toISOString().slice(0, 10);
  return sales.filter((sale) => sale.saleDate === today);
});

export const selectTodayRepayments = createSelector(
  [selectAllRepayments],
  (repayments) => {
    const today = new Date().toISOString().slice(0, 10);
    return repayments.filter((repayment) => {
      const paidAt = repayment.paidAt || repayment.createdAt;
      return paidAt && paidAt.slice(0, 10) === today;
    });
  }
);

export const selectTodayExpenses = createSelector(
  [selectAllExpenses],
  (expenses) => {
    const today = new Date().toISOString().slice(0, 10);
    return expenses.filter((expense) => expense.date === today);
  }
);

export const selectTodayCashboxSummary = createSelector(
  [selectTodaySales, selectTodayRepayments, selectTodayExpenses],
  (todaySales, todayRepayments, todayExpenses) => {
    const summary = {
      usd: 0,
      afn: 0,
      inflows: { usd: 0, afn: 0 },
      outflows: { usd: 0, afn: 0 },
    };

    // --- Process Inflows (Cash from Sales & Repayments) ---
    todaySales.forEach((sale) => {
      const amount = asNumber(sale.amountPaid);
      if (sale.currency === 'USD') {
        summary.inflows.usd += amount;
      } else {
        summary.inflows.afn += amount;
      }
    });

    todayRepayments.forEach((repayment) => {
      const amount = asNumber(repayment.amount);
      if (repayment.currency === 'USD') {
        summary.inflows.usd += amount;
      } else {
        summary.inflows.afn += amount;
      }
    });

    // --- Process Outflows (Cash for Expenses) ---
    todayExpenses.forEach((expense) => {
      const amount = asNumber(expense.amount);
      if (expense.currency === 'USD') {
        summary.outflows.usd += amount;
      } else {
        summary.outflows.afn += amount;
      }
    });

    summary.usd = summary.inflows.usd - summary.outflows.usd;
    summary.afn = summary.inflows.afn - summary.outflows.afn;

    return summary;
  }
);

export default roznamchaSlice.reducer;
