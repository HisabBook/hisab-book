import { createSlice } from '@reduxjs/toolkit';
import { mockSales } from '../../mockData/initialData';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: mockSales,
  },
  reducers: {
    addSale(state, action) {
      state.sales.push(action.payload);
    },
    deleteSale(state, action) {
      state.sales = state.sales.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSale, deleteSale } = salesSlice.actions;

export const selectAllSales = (state) => state.sales.sales;
export const selectTodaySales = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.sales.sales.filter((s) => s.saleDate === today);
};

export default salesSlice.reducer;
