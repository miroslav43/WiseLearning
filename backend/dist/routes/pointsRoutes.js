"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pointsController_1 = require("../controllers/points/pointsController");
const referralController_1 = require("../controllers/points/referralController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get user points balance
router.get('/balance', authMiddleware_1.authenticate, pointsController_1.getPointsBalance);
// Get user points transactions
router.get('/transactions', authMiddleware_1.authenticate, pointsController_1.getPointsTransactions);
// Get available points packages
router.get('/packages', pointsController_1.getPointsPackages);
// Add points to user account (admin only)
router.post('/add', authMiddleware_1.authenticate, pointsController_1.addPoints);
// Deduct points from user account
router.post('/deduct', authMiddleware_1.authenticate, pointsController_1.deductPoints);
// Purchase courses with points
router.post('/purchase-courses', authMiddleware_1.authenticate, pointsController_1.purchaseCoursesWithPoints);
// Purchase points package (legacy method)
router.post('/purchase', authMiddleware_1.authenticate, pointsController_1.purchasePointsPackage);
// Create payment intent for points package
router.post('/create-payment-intent', authMiddleware_1.authenticate, pointsController_1.createPointsPackagePaymentIntent);
// Referral code routes
router.get('/referral-code', authMiddleware_1.authenticate, referralController_1.getMyReferralCode);
router.post('/referral-code/apply', authMiddleware_1.authenticate, referralController_1.applyReferralCode);
exports.default = router;
