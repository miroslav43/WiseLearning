
import { createContext, useContext } from 'react';
import { CartContextType } from './types';
import { Cart } from '@/types/cart';

// Define default cart state
export const defaultCart: Cart = { 
  items: [], 
  totalPrice: 0, 
  totalPointsPrice: 0 
};

// Create the context with default values
export const CartContext = createContext<CartContextType>({
  cart: defaultCart,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
  checkoutWithPoints: async () => false,
  voucherCode: null,
  applyVoucherCode: () => {},
  removeVoucherCode: () => {},
  referralCode: null,
  applyReferralCode: () => {},
  removeReferralCode: () => {},
  calculatedDiscount: 0,
  pointsToEarn: 0,
});

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);
