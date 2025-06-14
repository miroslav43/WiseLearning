import { Request, Response } from 'express';
import { prisma } from '../index';
import paymentService from '../services/paymentService';

/**
 * Create a payment intent for a specific purchase
 */
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency, metadata, paymentMethodTypes } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Add user ID to metadata
    const paymentMetadata = {
      userId: req.user.id,
      ...metadata
    };

    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency || 'eur',
      paymentMetadata,
      paymentMethodTypes
    );

    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

/**
 * Create a checkout session for a specific purchase
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { priceId, quantity, metadata } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!priceId || !quantity) {
      return res.status(400).json({ message: 'Price ID and quantity are required' });
    }

    // Add user ID to metadata
    const sessionMetadata = {
      userId: req.user.id,
      ...metadata
    };

    const session = await paymentService.createCheckoutSession(
      priceId,
      quantity,
      sessionMetadata,
      req.user.id
    );

    res.status(200).json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

/**
 * Confirm a payment intent (complete the payment)
 */
export const confirmPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!paymentIntentId || !paymentMethod) {
      return res.status(400).json({ message: 'Payment intent ID and payment method are required' });
    }

    const confirmedIntent = await paymentService.confirmPaymentIntent(paymentIntentId, paymentMethod);

    res.status(200).json(confirmedIntent);
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    res.status(500).json({ message: 'Error confirming payment intent' });
  }
};

/**
 * Handle webhook events from payment provider
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // In a real implementation, you would verify the webhook signature
    // const signature = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    await paymentService.handleWebhookEvent(event.type, event.data);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
};

/**
 * Get payment methods for the current user
 */
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const paymentMethods = await paymentService.getPaymentMethods(req.user.id);

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: 'Error fetching payment methods' });
  }
};

/**
 * Get payment history for the current user
 */
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const payments = await prisma.payment.findMany({
      where: {
        metadata: {
          path: ['userId'],
          equals: req.user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
}; 