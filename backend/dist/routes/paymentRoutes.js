"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController = __importStar(require("../controllers/paymentController"));
const pointsController = __importStar(require("../controllers/points/pointsController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Create payment intent
router.post('/create-payment-intent', authMiddleware_1.authenticate, paymentController.createPaymentIntent);
// Create checkout session
router.post('/create-checkout-session', authMiddleware_1.authenticate, paymentController.createCheckoutSession);
// Confirm payment intent
router.post('/confirm-payment-intent', authMiddleware_1.authenticate, paymentController.confirmPaymentIntent);
// Handle webhooks (no authentication required)
router.post('/webhook', paymentController.handleWebhook);
// Get payment methods
router.get('/payment-methods', authMiddleware_1.authenticate, paymentController.getPaymentMethods);
// Get payment history
router.get('/history', authMiddleware_1.authenticate, paymentController.getPaymentHistory);
// Points-related routes
// These routes already have implementations in pointsController
// Get user points balance
router.get('/points/balance', authMiddleware_1.authenticate, pointsController.getPointsBalance);
// Get points packages
router.get('/points/packages', authMiddleware_1.authenticate, pointsController.getPointsPackages);
// Purchase points package
router.post('/points/purchase', authMiddleware_1.authenticate, pointsController.purchasePointsPackage);
// Add points to user account
router.post('/points/add', authMiddleware_1.authenticate, pointsController.addPoints);
// Deduct points from user account
router.post('/points/deduct', authMiddleware_1.authenticate, pointsController.deductPoints);
exports.default = router;
