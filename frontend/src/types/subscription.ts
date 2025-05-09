
export type SubscriptionPeriod = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: SubscriptionPeriod;
  featuredBenefit?: string;
  benefits: string[];
  isPopular?: boolean;
}

export interface CourseBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  courses: string[];
  featuredBenefit?: string;
  benefits: string[];
  imageUrl?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: Date;
}

export interface UserBundle {
  id: string;
  userId: string;
  bundleId: string;
  purchaseDate: Date;
}
