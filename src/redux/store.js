import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses browser's LocalStorage

import settingsReducer from "./slices/settingsSlice";

const rootReducer = combineReducers({
  settings: settingsReducer,
});

// Configure Redux Persist
const persistConfig = {
  key: "hisabbook-root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these specific redux-persist actions to prevent console warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
