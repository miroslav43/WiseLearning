
import { Course } from '@/types/course';
import { Cart } from '@/types/cart';

// Voucher code type definition
export interface VoucherCode {
  code: string;
  type: 'percentage' | 'fixed' | 'points';
  value: number;
  valid: boolean;
}

// Cart context interface
export interface CartContextType {
  cart: Cart;
  addToCart: (course: Course) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  checkoutWithPoints: () => Promise<boolean>;
  voucherCode: VoucherCode | null;
  applyVoucherCode: (code: string) => void;
  removeVoucherCode: () => void;
  referralCode: string | null;
  applyReferralCode: (code: string) => void;
  removeReferralCode: () => void;
  calculatedDiscount: number;
  pointsToEarn: number;
}
