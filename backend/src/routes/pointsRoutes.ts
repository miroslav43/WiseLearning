import { Router } from 'express';
import {
    addPoints,
    createPointsPackagePaymentIntent,
    deductPoints,
    getPointsBalance,
    getPointsPackages,
    getPointsTransactions,
    purchaseCoursesWithPoints,
    purchasePointsPackage
} from '../controllers/points/pointsController';
import {
    applyReferralCode,
    getMyReferralCode
} from '../controllers/points/referralController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get user points balance
router.get('/balance', authenticate, getPointsBalance);

// Get user points transactions
router.get('/transactions', authenticate, getPointsTransactions);

// Get available points packages
router.get('/packages', getPointsPackages);

// Add points to user account (admin only)
router.post('/add', authenticate, addPoints);

// Deduct points from user account
router.post('/deduct', authenticate, deductPoints);

// Purchase courses with points
router.post('/purchase-courses', authenticate, purchaseCoursesWithPoints);

// Purchase points package (legacy method)
router.post('/purchase', authenticate, purchasePointsPackage);

// Create payment intent for points package
router.post('/create-payment-intent', authenticate, createPointsPackagePaymentIntent);

// Referral code routes
router.get('/referral-code', authenticate, getMyReferralCode);
router.post('/referral-code/apply', authenticate, applyReferralCode);

export default router; 