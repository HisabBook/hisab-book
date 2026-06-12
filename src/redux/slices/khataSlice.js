import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  debts: [],
  repayments: [],
};

// --- Slice Definition ---
const khataSlice = createSlice({
  name: 'khata',
  initialState,
  reducers: {
    addDebt(state, action) {
      const { saleId, customer, dueAmount, currency, createdAt } =
        action.payload;

      // Prevent adding a duplicate debt for the same sale
      const exists = state.debts.some((debt) => debt.saleId === saleId);
      if (exists) return;

      state.debts.push({
        id: `debt_${saleId}`,
        saleId,
        customer,
        initialDue: dueAmount,
        remainingDue: dueAmount,
        currency,
        status: 'Unpaid',
        createdAt,
      });
    },

    recordRepayment(state, action) {
      const { debtId, amount, date } = action.payload;
      const debt = state.debts.find((d) => d.id === debtId);

      if (debt) {
        const newRemaining = debt.remainingDue - amount;
        debt.remainingDue = Math.max(0, newRemaining);

        if (debt.remainingDue === 0) {
          debt.status = 'Paid';
        } else if (debt.remainingDue < debt.initialDue) {
          debt.status = 'Partially Paid';
        }

        state.repayments.push({
          id: `repay_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          debtId,
          amount,
          date,
        });
      }
    },
  },
});

export const { addDebt, recordRepayment } = khataSlice.actions;

const selectKhataState = (state) => state.khata;
export const selectAllDebts = createSelector(
  [selectKhataState],
  (khata) => khata.debts || []
);

export const selectAllRepayments = createSelector(
  [selectKhataState],
  (khata) => khata.repayments || []
);

export const selectActiveDebts = createSelector([selectAllDebts], (debts) =>
  debts
    .filter((d) => d.status !== 'Paid')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

export const selectDebtorsSummary = createSelector(
  [selectActiveDebts],
  (activeDebts) => {
    const summary = {};
    activeDebts.forEach((debt) => {
      const phone = debt.customer.phone;
      if (!summary[phone]) {
        summary[phone] = {
          customer: debt.customer,
          totalDebtUSD: 0,
          totalDebtAFN: 0,
          debtCount: 0,
          debts: [],
        };
      }
      if (debt.currency === 'USD') {
        summary[phone].totalDebtUSD += debt.remainingDue;
      } else {
        summary[phone].totalDebtAFN += debt.remainingDue;
      }
      summary[phone].debtCount += 1;
      summary[phone].debts.push(debt);
    });
    return Object.values(summary);
  }
);

export const selectDebtors = selectDebtorsSummary;
export default khataSlice.reducer;
