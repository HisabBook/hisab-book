import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { migratePersistedRootState } from './khataMigrations';

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
  version: 2,
  blacklist: ['pos'],
  migrate: createMigrate({
    2: (state) => migratePersistedRootState(state),
  }),
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
