import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  mockPhones,
  mockLaptops,
  mockAccessories,
} from '../../mockData/initialData';

const isNonNegativeNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const normalize = (value) => String(value ?? '').trim().toLowerCase();

const initialState = {
  phones: mockPhones,
  laptops: mockLaptops,
  accessories: mockAccessories,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addPhone(state, action) {
      const payload = action.payload;
      const imei = normalize(payload.imei);
      const id = normalize(payload.id);

      if (!id || !imei) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      const idExists = state.phones.some((p) => normalize(p.id) === id);
      const imeiExists = state.phones.some((p) => normalize(p.imei) === imei);
      if (idExists || imeiExists) return;

      state.phones.push(payload);
    },
    updatePhone(state, action) {
      const payload = action.payload;
      const index = state.phones.findIndex((p) => p.id === payload.id);
      if (index === -1) return;

      const imei = normalize(payload.imei);
      if (!imei) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      const duplicateImei = state.phones.some(
        (p, i) => i !== index && normalize(p.imei) === imei
      );
      if (duplicateImei) return;

      state.phones[index] = payload;
    },
    deletePhone(state, action) {
      state.phones = state.phones.filter((p) => p.id !== action.payload);
    },
    markPhoneSold(state, action) {
      const phone = state.phones.find((p) => p.id === action.payload);
      if (phone) phone.stockStatus = 'Sold';
    },

    addLaptop(state, action) {
      const payload = action.payload;
      const serial = normalize(payload.serialNumber);
      const id = normalize(payload.id);

      if (!id || !serial) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      const idExists = state.laptops.some((l) => normalize(l.id) === id);
      const serialExists = state.laptops.some(
        (l) => normalize(l.serialNumber) === serial
      );
      if (idExists || serialExists) return;

      state.laptops.push(payload);
    },
    updateLaptop(state, action) {
      const payload = action.payload;
      const index = state.laptops.findIndex((l) => l.id === payload.id);
      if (index === -1) return;

      const serial = normalize(payload.serialNumber);
      if (!serial) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      const duplicateSerial = state.laptops.some(
        (l, i) => i !== index && normalize(l.serialNumber) === serial
      );
      if (duplicateSerial) return;

      state.laptops[index] = payload;
    },
    deleteLaptop(state, action) {
      state.laptops = state.laptops.filter((l) => l.id !== action.payload);
    },

    addAccessory(state, action) {
      const payload = action.payload;
      const id = normalize(payload.id);
      if (!id) return;
      if (!isNonNegativeNumber(payload.quantity)) return;
      if (!isNonNegativeNumber(payload.lowStockThreshold)) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      const idExists = state.accessories.some((a) => normalize(a.id) === id);
      if (idExists) return;

      state.accessories.push(payload);
    },
    updateAccessory(state, action) {
      const payload = action.payload;
      const index = state.accessories.findIndex((a) => a.id === payload.id);
      if (index === -1) return;

      if (!isNonNegativeNumber(payload.quantity)) return;
      if (!isNonNegativeNumber(payload.lowStockThreshold)) return;
      if (!isNonNegativeNumber(payload.purchasePrice)) return;
      if (!isNonNegativeNumber(payload.sellPrice)) return;

      state.accessories[index] = payload;
    },
    deleteAccessory(state, action) {
      state.accessories = state.accessories.filter((a) => a.id !== action.payload);
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

export const selectAllPhones = (state) => state.inventory.phones;
export const selectAvailablePhones = (state) =>
  state.inventory.phones.filter((p) => p.stockStatus === 'Available');
export const selectAllLaptops = (state) => state.inventory.laptops;
export const selectAllAccessories = (state) => state.inventory.accessories;

export const selectPhoneImeiSet = createSelector([selectAllPhones], (phones) =>
  new Set(phones.map((p) => normalize(p.imei)))
);

export const selectLaptopSerialSet = createSelector([selectAllLaptops], (laptops) =>
  new Set(laptops.map((l) => normalize(l.serialNumber)))
);

export const selectLowStockAccessories = createSelector(
  [selectAllAccessories],
  (accessories) =>
    accessories.filter((a) => a.quantity <= a.lowStockThreshold)
);

export default inventorySlice.reducer;
