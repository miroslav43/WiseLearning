import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import * as pointsController from '../controllers/points/pointsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Create payment intent
router.post('/create-payment-intent', authenticate, paymentController.createPaymentIntent);

// Create checkout session
router.post('/create-checkout-session', authenticate, paymentController.createCheckoutSession);

// Confirm payment intent
router.post('/confirm-payment-intent', authenticate, paymentController.confirmPaymentIntent);

// Handle webhooks (no authentication required)
router.post('/webhook', paymentController.handleWebhook);

// Get payment methods
router.get('/payment-methods', authenticate, paymentController.getPaymentMethods);

// Get payment history
router.get('/history', authenticate, paymentController.getPaymentHistory);

// Points-related routes
// These routes already have implementations in pointsController

// Get user points balance
router.get('/points/balance', authenticate, pointsController.getPointsBalance);

// Get points packages
router.get('/points/packages', authenticate, pointsController.getPointsPackages);

// Purchase points package
router.post('/points/purchase', authenticate, pointsController.purchasePointsPackage);

// Add points to user account
router.post('/points/add', authenticate, pointsController.addPoints);

// Deduct points from user account
router.post('/points/deduct', authenticate, pointsController.deductPoints);

export default router; 