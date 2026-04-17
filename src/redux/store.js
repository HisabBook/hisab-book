import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// ── Slice Reducers
import settingsReducer from './slices/settingsSlice';
import inventoryReducer from './slices/inventorySlice';
import salesReducer from './slices/salesSlice';
import khataReducer from './slices/khataSlice';
import roznamchaReducer from './slices/roznamchaSlice';
import posReducer from './slices/posSlice';

const rootReducer = combineReducers({
  settings: settingsReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
  khata: khataReducer,
  roznamcha: roznamchaReducer,
  pos: posReducer,
});

const persistConfig = {
  key: 'hisabbook-root', // Key visible in DevTools → localStorage
  storage, // Browser localStorage
  version: 1,
  blacklist: ['pos'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
//  STORE
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // ── Enable Redux DevTools in development only 
  devTools: import.meta.env.MODE !== 'production',
});
export const persistor = persistStore(store);
