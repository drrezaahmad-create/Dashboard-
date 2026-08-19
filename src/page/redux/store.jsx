import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storageRaw from "redux-persist/lib/storage";

import { baseApi } from './api/baseApi';
import { authSlice } from './features/auth/authSlice';

const storage = (storageRaw && typeof storageRaw.getItem === 'function')
    ? storageRaw
    : ((storageRaw && storageRaw.default && typeof storageRaw.default.getItem === 'function')
        ? storageRaw.default
        : {
            getItem: (key) => Promise.resolve(localStorage.getItem(key)),
            setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
            removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
        });

const persistConfig = {
    key: "quiz-app",
    storage,
    blacklist: ["baseApi"],
};

const rootReducer = combineReducers({
    logInUser: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);




// import { configureStore } from '@reduxjs/toolkit'

// import { setupListeners } from '@reduxjs/toolkit/query'
// import { baseApi } from './api/baseApi'

// export const store = configureStore({
//   reducer: {
//     [baseApi.reducerPath] :  baseApi.reducer
//   },
//   middleware : (getDefaultMiddleware)=>
//     getDefaultMiddleware().concat(baseApi.middleware)
// })
// setupListeners(store.dispatch)


