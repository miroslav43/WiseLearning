import { apiClient } from '@/utils/apiClient';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  payment_method_types: string[];
}

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface Payment {
  id: string;
  referenceId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a payment intent
 */
export const createPaymentIntent = async (
  amount: number,
  currency: string = 'eur',
  metadata: Record<string, string> = {},
  paymentMethodTypes: string[] = ['card', 'apple_pay', 'google_pay']
) => {
  return apiClient.post<PaymentIntent>('/payments/create-payment-intent', {
    amount,
    currency,
    metadata,
    paymentMethodTypes
  });
};

/**
 * Create a checkout session
 */
export const createCheckoutSession = async (
  priceId: string,
  quantity: number = 1,
  metadata: Record<string, string> = {}
) => {
  return apiClient.post<CheckoutSession>('/payments/create-checkout-session', {
    priceId,
    quantity,
    metadata
  });
};

/**
 * Confirm a payment intent
 */
export const confirmPaymentIntent = async (paymentIntentId: string, paymentMethod: string) => {
  return apiClient.post<PaymentIntent>('/payments/confirm-payment-intent', {
    paymentIntentId,
    paymentMethod
  });
};

/**
 * Get saved payment methods
 */
export const getPaymentMethods = async () => {
  return apiClient.get<PaymentMethod[]>('/payments/payment-methods');
};

/**
 * Get payment history
 */
export const getPaymentHistory = async () => {
  return apiClient.get<Payment[]>('/payments/history');
};

/**
 * Create a payment intent for a points package
 */
export const createPointsPackagePaymentIntent = async (packageId: string) => {
  return apiClient.post<{
    clientSecret: string;
    packageDetails: {
      id: string;
      name: string;
      points: number;
      price: number;
    }
  }>('/points/create-payment-intent', {
    packageId
  });
}; 