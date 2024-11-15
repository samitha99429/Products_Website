import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    favorites: favoritesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
