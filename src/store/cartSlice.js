// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {
    items: [],
    totalCount: 0,
    lastUpdated: null,
  };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action 1: Add item to cart
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalCount = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      state.lastUpdated = new Date().toISOString();
    },

    // Action 2: Remove item from cart
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalCount = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      state.lastUpdated = new Date().toISOString();
    },

    // Action 3: Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.lastUpdated = new Date().toISOString();
    },

    // Action 4: Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity); // Minimum quantity of 1
        state.totalCount = state.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        state.lastUpdated = new Date().toISOString();
      }
    },
  },
});

// Export actions
export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalCount;
export const selectLastUpdated = (state) => state.cart.lastUpdated;

export default cartSlice.reducer;
