import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : { items: [], subtotal: 0 };
};

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.final_price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.1;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      Object.assign(state, calculateTotals(state.items));
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      Object.assign(state, calculateTotals(state.items));
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        Object.assign(state, calculateTotals(state.items));
        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.tax = 0;
      state.total = 0;
      saveCartToStorage(state);
    },
    applyCoupon: (state, action) => {
      state.discount = action.payload.discount;
      state.total = state.subtotal + state.shipping + state.tax - state.discount;
      saveCartToStorage(state);
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon } = cartSlice.actions;
export default cartSlice.reducer;