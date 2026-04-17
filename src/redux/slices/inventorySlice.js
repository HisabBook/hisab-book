import { createSlice } from '@reduxjs/toolkit';
import {
  mockPhones,
  mockLaptops,
  mockAccessories,
} from '../../mockData/initialData';

const initialState = {
  phones: mockPhones,
  laptops: mockLaptops,
  accessories: mockAccessories,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // ── Phones 
    addPhone(state, action) {
      state.phones.push(action.payload);
    },
    updatePhone(state, action) {
      const index = state.phones.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.phones[index] = action.payload;
    },
    deletePhone(state, action) {
      state.phones = state.phones.filter((p) => p.id !== action.payload);
    },
    markPhoneSold(state, action) {
      const phone = state.phones.find((p) => p.id === action.payload);
      if (phone) phone.stockStatus = 'Sold';
    },

    // ── Laptops
    addLaptop(state, action) {
      state.laptops.push(action.payload);
    },
    updateLaptop(state, action) {
      const index = state.laptops.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) state.laptops[index] = action.payload;
    },
    deleteLaptop(state, action) {
      state.laptops = state.laptops.filter((l) => l.id !== action.payload);
    },

    // ── Accessories 
    addAccessory(state, action) {
      state.accessories.push(action.payload);
    },
    updateAccessory(state, action) {
      const index = state.accessories.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) state.accessories[index] = action.payload;
    },
    deleteAccessory(state, action) {
      state.accessories = state.accessories.filter(
        (a) => a.id !== action.payload
      );
    },
    decreaseAccessoryQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.accessories.find((a) => a.id === id);
      if (item) item.quantity = Math.max(0, item.quantity - qty);
    },
  },
});

export const {
  addPhone,
  updatePhone,
  deletePhone,
  markPhoneSold,
  addLaptop,
  updateLaptop,
  deleteLaptop,
  addAccessory,
  updateAccessory,
  deleteAccessory,
  decreaseAccessoryQty,
} = inventorySlice.actions;

// ── Selectors 
export const selectAllPhones = (state) => state.inventory.phones;
export const selectAvailablePhones = (state) =>
  state.inventory.phones.filter((p) => p.stockStatus === 'Available');
export const selectAllLaptops = (state) => state.inventory.laptops;
export const selectAllAccessories = (state) => state.inventory.accessories;
export const selectLowStockAccessories = (state) =>
  state.inventory.accessories.filter((a) => a.quantity <= a.lowStockThreshold);

export default inventorySlice.reducer;
