import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useStore = create((set, get) => ({
  // --- USER AUTHENTICATION STATE ---
  user: JSON.parse(localStorage.getItem('user')) || null,
  authError: null,
  authLoading: false,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
      set({ user: data, authLoading: false });
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ authError: msg, authLoading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const { data } = await axios.post(`${API_URL}/users`, { name, email, password });
      set({ user: data, authLoading: false });
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ authError: msg, authLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  // --- SHOPPING CART STATE ---
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  coupon: null, // Applied coupon: { code, discountValue, discountType, discountAmount }
  couponError: null,

  addToCart: (item) => {
    const { cart } = get();
    // Check if the exact product variant is already in cart
    const existingIndex = cart.findIndex(
      (x) =>
        x.productId === item.productId &&
        x.selectedMetal === item.selectedMetal &&
        x.selectedColor === item.selectedColor &&
        x.selectedSize === item.selectedSize
    );

    let newCart;
    if (existingIndex > -1) {
      newCart = [...cart];
      newCart[existingIndex].quantity += item.quantity;
    } else {
      newCart = [...cart, item];
    }

    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Reset coupon to ensure recalculation
    set({ coupon: null, couponError: null });
  },

  removeFromCart: (productId, selectedMetal, selectedColor, selectedSize) => {
    const { cart } = get();
    const newCart = cart.filter(
      (x) =>
        !(
          x.productId === productId &&
          x.selectedMetal === selectedMetal &&
          x.selectedColor === selectedColor &&
          x.selectedSize === selectedSize
        )
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    set({ coupon: null, couponError: null });
  },

  updateCartQuantity: (productId, selectedMetal, selectedColor, selectedSize, quantity) => {
    const { cart } = get();
    const existingIndex = cart.findIndex(
      (x) =>
        x.productId === productId &&
        x.selectedMetal === selectedMetal &&
        x.selectedColor === selectedColor &&
        x.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity = Math.max(1, quantity);
      set({ cart: newCart });
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    set({ coupon: null, couponError: null });
  },

  clearCart: () => {
    set({ cart: [], coupon: null, couponError: null });
    localStorage.removeItem('cart');
  },

  // --- FESTIVAL OFFERS (COUPON VALIDATION) ---
  applyCoupon: async (code) => {
    const { getCartSubtotal, user } = get();
    if (!user) {
      set({ couponError: 'Please login to apply coupon' });
      return;
    }
    set({ couponError: null });
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const subtotal = getCartSubtotal();
      const { data } = await axios.post(
        `${API_URL}/offers/validate`,
        { code, cartTotal: subtotal },
        config
      );
      set({ coupon: data });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Coupon code validation failed';
      set({ couponError: msg, coupon: null });
      throw new Error(msg);
    }
  },

  removeCoupon: () => {
    set({ coupon: null, couponError: null });
  },

  // --- CALCULATION HELPERS ---
  getCartSubtotal: () => {
    const { cart } = get();
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const { coupon, getCartSubtotal } = get();
    if (!coupon) return 0;
    const subtotal = getCartSubtotal();
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return coupon.discountValue;
  },

  getCartTotal: () => {
    const { getCartSubtotal, getDiscountAmount } = get();
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal - discount);
  }
}));

export default useStore;
export { API_URL };
