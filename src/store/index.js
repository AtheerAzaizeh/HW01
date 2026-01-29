// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Middleware to persist cart to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save cart to localStorage after any cart action
  if (action.type.startsWith('cart/')) {
    try {
      const cartState = store.getState().cart;
      localStorage.setItem('cart', JSON.stringify(cartState));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
  
  return result;
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
