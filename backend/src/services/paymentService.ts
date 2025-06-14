import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../index';

// Mock Stripe types to match Stripe API structure
export interface StripePaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_received: number;
  client_secret: string;
  currency: string;
  customer?: string;
  description?: string;
  metadata: Record<string, string>;
  payment_method?: string;
  payment_method_types: string[];
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  created: number;
}

export interface StripeCheckoutSession {
  id: string;
  object: 'checkout.session';
  cancel_url: string;
  success_url: string;
  client_reference_id?: string;
  customer?: string;
  line_items?: any[];
  metadata: Record<string, string>;
  payment_intent?: string;
  payment_status: 'unpaid' | 'paid' | 'no_payment_required';
  status: 'open' | 'complete' | 'expired';
  url: string;
  created: number;
}

export interface StripePaymentMethod {
  id: string;
  object: 'payment_method';
  type: 'card' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface StripeWebhookEvent {
  id: string;
  object: 'event';
  type: string;
  data: {
    object: any;
  };
  created: number;
}

// Mock payment service that simulates Stripe API
class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  /**
   * Create a payment intent (similar to Stripe's API)
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
    metadata: Record<string, string> = {},
    paymentMethodTypes: string[] = ['card', 'apple_pay', 'google_pay']
  ): Promise<StripePaymentIntent> {
    // In a real implementation, this would call Stripe's API
    const paymentIntent: StripePaymentIntent = {
      id: `pi_${uuidv4().replace(/-/g, '')}`,
      object: 'payment_intent',
      amount,
      amount_received: 0,
      client_secret: `pi_${uuidv4().replace(/-/g, '')}_secret_${uuidv4().replace(/-/g, '')}`,
      currency,
      metadata,
      payment_method_types: paymentMethodTypes,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000)
    };

    // Store the payment intent in the database for reference
    await prisma.payment.create({
      data: {
        referenceId: paymentIntent.id,
        amount: amount / 100, // Convert cents to euros
        status: 'pending',
        paymentMethod: 'card', // Default, will be updated later
        metadata: metadata
      }
    });

    return paymentIntent;
  }

  /**
   * Create a checkout session (similar to Stripe's API)
   */
  async createCheckoutSession(
    priceId: string,
    quantity: number,
    metadata: Record<string, string> = {},
    customerId?: string
  ): Promise<StripeCheckoutSession> {
    // In a real implementation, this would call Stripe's API
    const paymentIntentId = `pi_${uuidv4().replace(/-/g, '')}`;
    
    const session: StripeCheckoutSession = {
      id: `cs_${uuidv4().replace(/-/g, '')}`,
      object: 'checkout.session',
      cancel_url: `${this.baseUrl}/payment/cancel`,
      success_url: `${this.baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: metadata.referenceType + '_' + metadata.referenceId,
      customer: customerId,
      metadata,
      payment_intent: paymentIntentId,
      payment_status: 'unpaid',
      status: 'open',
      url: `${this.baseUrl}/checkout/${paymentIntentId}`,
      created: Math.floor(Date.now() / 1000)
    };

    // Store the session in the database for reference
    await prisma.payment.create({
      data: {
        referenceId: session.id,
        amount: parseFloat(metadata.amount || '0'),
        status: 'pending',
        paymentMethod: 'checkout',
        metadata: metadata
      }
    });

    return session;
  }

  /**
   * Confirm a payment intent (always succeeds in our mock)
   */
  async confirmPaymentIntent(paymentIntentId: string, paymentMethod: string): Promise<StripePaymentIntent> {
    // Find the payment in our database
    const payment = await prisma.payment.findFirst({
      where: { referenceId: paymentIntentId }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Update the payment status in our database
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paymentMethod,
        updatedAt: new Date()
      }
    });

    // Return a successful payment intent
    return {
      id: paymentIntentId,
      object: 'payment_intent',
      amount: payment.amount * 100, // Convert euros to cents
      amount_received: payment.amount * 100,
      client_secret: `${paymentIntentId}_secret_${uuidv4().replace(/-/g, '')}`,
      currency: 'eur',
      metadata: payment.metadata as Record<string, string>,
      payment_method: paymentMethod,
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      status: 'succeeded',
      created: Math.floor(payment.createdAt.getTime() / 1000)
    };
  }

  /**
   * Process a webhook event (for handling asynchronous payment events)
   */
  async handleWebhookEvent(eventType: string, data: any): Promise<void> {
    // In a real implementation, this would verify and process Stripe webhook events
    console.log(`Processing webhook event: ${eventType}`, data);

    if (eventType === 'payment_intent.succeeded') {
      const paymentIntentId = data.object.id;
      
      // Find the payment in our database
      const payment = await prisma.payment.findFirst({
        where: { referenceId: paymentIntentId }
      });

      if (payment) {
        // Update the payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            updatedAt: new Date()
          }
        });

        // Process the payment based on the reference type
        await this.processCompletedPayment(payment);
      }
    }
  }

  /**
   * Process a completed payment based on its reference type
   */
  async processCompletedPayment(payment: any): Promise<void> {
    const metadata = payment.metadata as Record<string, string>;
    const referenceType = metadata.referenceType;
    const referenceId = metadata.referenceId;

    if (!referenceType || !referenceId) {
      console.error('Missing reference type or ID in payment metadata');
      return;
    }

    switch (referenceType) {
      case 'points_package':
        await this.processPointsPackagePayment(referenceId, payment);
        break;
      case 'subscription':
        await this.processSubscriptionPayment(referenceId, payment);
        break;
      case 'course':
        await this.processCoursePayment(referenceId, payment);
        break;
      default:
        console.error(`Unknown payment reference type: ${referenceType}`);
    }
  }

  /**
   * Process a points package payment
   */
  async processPointsPackagePayment(packageId: string, payment: any): Promise<void> {
    const userId = payment.metadata.userId;
    if (!userId) {
      console.error('Missing user ID in payment metadata');
      return;
    }

    // Find the points package
    const pointsPackage = await prisma.pointsPackage.findUnique({
      where: { id: packageId }
    });

    if (!pointsPackage) {
      console.error(`Points package not found: ${packageId}`);
      return;
    }

    // Create a points transaction
    await prisma.pointsTransaction.create({
      data: {
        userId,
        amount: pointsPackage.points,
        type: 'purchase',
        description: `Purchased ${pointsPackage.name} package`,
      }
    });

    // Update user's points balance
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: pointsPackage.points
        }
      }
    });
  }

  /**
   * Process a subscription payment
   */
  async processSubscriptionPayment(subscriptionId: string, payment: any): Promise<void> {
    // Implementation would depend on your subscription model
    console.log(`Processing subscription payment: ${subscriptionId}`);
  }

  /**
   * Process a course payment
   */
  async processCoursePayment(courseId: string, payment: any): Promise<void> {
    const userId = payment.metadata.userId;
    if (!userId) {
      console.error('Missing user ID in payment metadata');
      return;
    }

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
        status: 'active'
      }
    });
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId: string): Promise<StripePaymentMethod[]> {
    // In a real implementation, this would call Stripe's API
    // For our mock, we'll return some fake payment methods
    return [
      {
        id: `pm_${uuidv4().replace(/-/g, '')}`,
        object: 'payment_method',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        }
      },
      {
        id: `pm_${uuidv4().replace(/-/g, '')}`,
        object: 'payment_method',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 10,
          exp_year: 2024
        }
      }
    ];
  }
}

export default new PaymentService(); 