import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PERSIST } from 'redux-persist/es/constants';
import reducer from './redux';


const persistConfig = {
  key: 'root', // Key cho localStorage
  storage, // Nơi lưu trữ là storage (localStorage hoặc sessionStorage)
  whitelist: ['dataKit'], // Chỉ định reducer nào cần lưu (ở đây là dataKit)
};

const persistedReducer = persistReducer(persistConfig, reducer);


const store = configureStore({
  reducer: {
    dataKit: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

})

export const persistor = persistStore(store);
export default store;