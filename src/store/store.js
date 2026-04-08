import { configureStore, combineReducers} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from 'redux-persist/es/storage'
import inventoryReducer from './inventorySlice'
import posReducer from './posSlice'
import settingsReducer from './settingsSlice'

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    inventory: inventoryReducer,
    pos: posReducer,
    settings: settingsReducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                'persist/PERSIST',
                'persist/REHYDRATE',
                'persist/PAUSE',
                'persist/PURGE',
                'persist/FLUSH'
            ]
        }
    })
});

export const persistor = persistStore(store);