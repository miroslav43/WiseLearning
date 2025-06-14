import { PointsTransaction } from '@/types/user';
import { apiClient } from '@/utils/apiClient';

// Interface for PointsPackage
export interface PointsPackage {
  id: string;
  name: string;
  description?: string;
  points: number;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for ReferralCode
export interface ReferralCode {
  id: string;
  code: string;
  pointsReward: number;
  maxUses: number | null;
  usageCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get current user's points balance
 */
export const getMyPoints = async () => {
  return apiClient.get<{ points: number }>('/points/balance');
};

/**
 * Get points transaction history for current user
 */
export const getMyTransactions = async () => {
  return apiClient.get<PointsTransaction[]>('/points/transactions');
};

/**
 * Get specific transaction by ID
 */
export const getTransaction = async (transactionId: string) => {
  return apiClient.get<PointsTransaction>(`/points/transactions/${transactionId}`);
};

/**
 * Add points to the current user account 
 */
export const addPoints = async (
  amount: number,
  type: 'purchase' | 'referral' | 'achievement' | 'admin_grant',
  description: string
) => {
  return apiClient.post<PointsTransaction>('/points/add', {
    amount,
    type,
    description
  });
};

/**
 * Deduct points from the current user account
 */
export const deductPoints = async (
  amount: number,
  type: 'course_purchase' | 'tutoring_purchase',
  description: string
) => {
  return apiClient.post<PointsTransaction>('/points/deduct', {
    amount,
    type,
    description
  });
};

/**
 * Purchase a points package
 */
export const purchasePointsPackage = async (packageId: string, paymentMethod: string) => {
  return apiClient.post<{
    transaction: PointsTransaction,
    success: boolean,
    message: string
  }>('/points/purchase', {
    packageId,
    paymentMethod
  });
};

/**
 * Get all available points packages
 */
export const getPointsPackages = async () => {
  return apiClient.get<PointsPackage[]>('/points/packages');
};

/**
 * Apply a referral code
 */
export const applyReferralCode = async (code: string) => {
  return apiClient.post<{
    success: boolean;
    message: string;
    pointsAwarded?: number;
  }>('/points/referral', { code });
};

/**
 * Get user's referral code
 */
export const getMyReferralCode = async () => {
  return apiClient.get<{
    code: string;
    usageCount: number;
    pointsEarned: number;
  }>('/points/referral/my-code');
};

/**
 * Admin: Get any user's points balance
 */
export const getUserPoints = async (userId: string) => {
  return apiClient.get<{ points: number, userId: string }>(`/admin/points/user/${userId}`);
};

/**
 * Admin: Grant points to any user
 */
export const grantPointsToUser = async (userId: string, amount: number, description: string) => {
  return apiClient.post<PointsTransaction>('/admin/points/grant', {
    userId,
    amount,
    description
  });
};

/**
 * Admin: Get all transactions (with pagination)
 */
export const getAllTransactions = async (page = 1, limit = 50, filter?: string) => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString()
  };
  
  if (filter) {
    params.filter = filter;
  }
  
  return apiClient.get<{
    transactions: PointsTransaction[];
    total: number;
    page: number;
    lastPage: number;
  }>('/admin/points/transactions', params);
};

/**
 * Admin: Get all points packages (including inactive ones)
 */
export const adminGetAllPointsPackages = async () => {
  return apiClient.get<PointsPackage[]>('/admin/points-packages');
};

/**
 * Admin: Create a new points package
 */
export const adminCreatePointsPackage = async (packageData: Omit<PointsPackage, 'id' | 'createdAt' | 'updatedAt'>) => {
  return apiClient.post<PointsPackage>('/admin/points-packages', packageData);
};

/**
 * Admin: Update an existing points package
 */
export const adminUpdatePointsPackage = async (id: string, packageData: Partial<Omit<PointsPackage, 'id' | 'createdAt' | 'updatedAt'>>) => {
  return apiClient.put<PointsPackage>(`/admin/points-packages/${id}`, packageData);
};

/**
 * Admin: Delete a points package
 */
export const adminDeletePointsPackage = async (id: string) => {
  return apiClient.delete<{ message: string }>(`/admin/points-packages/${id}`);
};

/**
 * Admin: Toggle active status of a points package
 */
export const adminTogglePointsPackageStatus = async (id: string) => {
  return apiClient.patch<PointsPackage>(`/admin/points-packages/${id}/toggle`, {});
};

/**
 * Admin: Get all referral codes
 */
export const adminGetAllReferralCodes = async () => {
  return apiClient.get<ReferralCode[]>('/admin/points/referral-codes');
};

/**
 * Admin: Create a new referral code
 */
export const adminCreateReferralCode = async (codeData: {
  code: string;
  pointsReward: number;
  maxUses: number | null;
  active: boolean;
  expiresAt: string | null;
}) => {
  return apiClient.post<ReferralCode>('/admin/points/referral-codes', codeData);
};

/**
 * Admin: Update an existing referral code
 */
export const adminUpdateReferralCode = async (
  id: string,
  codeData: Partial<{
    code: string;
    pointsReward: number;
    maxUses: number | null;
    active: boolean;
    expiresAt: string | null;
  }>
) => {
  return apiClient.put<ReferralCode>(`/admin/points/referral-codes/${id}`, codeData);
};

/**
 * Admin: Delete a referral code
 */
export const adminDeleteReferralCode = async (id: string) => {
  return apiClient.delete<{ message: string }>(`/admin/points/referral-codes/${id}`);
};

/**
 * Admin: Toggle active status of a referral code
 */
export const adminToggleReferralCodeStatus = async (id: string) => {
  return apiClient.patch<ReferralCode>(`/admin/points/referral-codes/${id}/toggle`, {});
};

/**
 * Purchase courses with points
 */
export const purchaseCoursesWithPoints = async (
  courseIds: string[],
  totalPointsPrice: number,
  description: string
) => {
  return apiClient.post<{
    success: boolean,
    message: string,
    transaction: PointsTransaction,
    enrollments: any[]
  }>('/points/purchase-courses', {
    courseIds,
    totalPointsPrice,
    description
  });
}; 