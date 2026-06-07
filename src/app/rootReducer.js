import { combineReducers } from '@reduxjs/toolkit';
import inventoryReducer from '../redux/slices/inventorySlice';
import posReducer from '../redux/slices/posSlice';
import salesReducer from '../redux/slices/salesSlice';
import khataReducer from '../redux/slices/khataSlice';
import roznamchaReducer from '../redux/slices/roznamchaSlice';
import settingsReducer from '../redux/slices/settingsSlice';

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  pos: posReducer,
  sales: salesReducer,
  khata: khataReducer,
  roznamcha: roznamchaReducer,
  settings: settingsReducer,
});

export default rootReducer;
