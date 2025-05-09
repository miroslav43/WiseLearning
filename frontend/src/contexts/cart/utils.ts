
// Mock voucher codes for demonstration
export const validVoucherCodes: Record<string, { type: 'percentage' | 'fixed' | 'points', value: number }> = {
  'DISCOUNT20': { type: 'percentage', value: 20 },  // 20% off
  'DISCOUNT50': { type: 'fixed', value: 50 },       // 50 RON off
  'EXTRAPOINTS': { type: 'points', value: 200 },    // 200 extra points
};

// Mock referral codes
export const validReferralCodes = {
  'FRIEND10': { discount: 10, points: 50 },  // 10% off and 50 extra points
  'TEACHER5': { discount: 5, points: 100 },  // 5% off and 100 extra points
};

// Helper function to calculate total price from cart items
export const calculateTotalPrice = (items: any[]): { moneyPrice: number, pointsPrice: number } => {
  return items.reduce((total, item) => ({
    moneyPrice: total.moneyPrice + item.price,
    pointsPrice: total.pointsPrice + item.pointsPrice
  }), { moneyPrice: 0, pointsPrice: 0 });
};
