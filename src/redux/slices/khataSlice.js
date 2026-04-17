import { createSlice } from '@reduxjs/toolkit';
import { mockCustomers } from '../../mockData/initialData';

const khataSlice = createSlice({
  name: 'khata',
  initialState: {
    customers: mockCustomers,
  },
  reducers: {
    addCustomer(state, action) {
      state.customers.push(action.payload);
    },
    updateCustomer(state, action) {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) state.customers[index] = action.payload;
    },
    deleteCustomer(state, action) {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    },
    recordRepayment(state, action) {
      const { customerId, amount } = action.payload;
      const customer = state.customers.find((c) => c.id === customerId);
      if (customer) {
        customer.debtAmount = Math.max(0, customer.debtAmount - amount);
      }
    },
    increaseDebt(state, action) {
      const { customerId, amount } = action.payload;
      const customer = state.customers.find((c) => c.id === customerId);
      if (customer) customer.debtAmount += amount;
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  recordRepayment,
  increaseDebt,
} = khataSlice.actions;

export const selectAllCustomers = (state) => state.khata.customers;
export const selectDebtors = (state) =>
  state.khata.customers.filter((c) => c.debtAmount > 0);

export default khataSlice.reducer;
