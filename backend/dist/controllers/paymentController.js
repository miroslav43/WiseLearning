"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.getPaymentMethods = exports.handleWebhook = exports.confirmPaymentIntent = exports.createCheckoutSession = exports.createPaymentIntent = void 0;
const index_1 = require("../index");
const paymentService_1 = __importDefault(require("../services/paymentService"));
/**
 * Create a payment intent for a specific purchase
 */
const createPaymentIntent = async (req, res) => {
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
        const paymentIntent = await paymentService_1.default.createPaymentIntent(amount, currency || 'eur', paymentMetadata, paymentMethodTypes);
        res.status(200).json(paymentIntent);
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
};
exports.createPaymentIntent = createPaymentIntent;
/**
 * Create a checkout session for a specific purchase
 */
const createCheckoutSession = async (req, res) => {
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
        const session = await paymentService_1.default.createCheckoutSession(priceId, quantity, sessionMetadata, req.user.id);
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Error creating checkout session' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
/**
 * Confirm a payment intent (complete the payment)
 */
const confirmPaymentIntent = async (req, res) => {
    try {
        const { paymentIntentId, paymentMethod } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!paymentIntentId || !paymentMethod) {
            return res.status(400).json({ message: 'Payment intent ID and payment method are required' });
        }
        const confirmedIntent = await paymentService_1.default.confirmPaymentIntent(paymentIntentId, paymentMethod);
        res.status(200).json(confirmedIntent);
    }
    catch (error) {
        console.error('Error confirming payment intent:', error);
        res.status(500).json({ message: 'Error confirming payment intent' });
    }
};
exports.confirmPaymentIntent = confirmPaymentIntent;
/**
 * Handle webhook events from payment provider
 */
const handleWebhook = async (req, res) => {
    try {
        const event = req.body;
        // In a real implementation, you would verify the webhook signature
        // const signature = req.headers['stripe-signature'];
        // const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        await paymentService_1.default.handleWebhookEvent(event.type, event.data);
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        res.status(400).json({ message: 'Webhook error' });
    }
};
exports.handleWebhook = handleWebhook;
/**
 * Get payment methods for the current user
 */
const getPaymentMethods = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const paymentMethods = await paymentService_1.default.getPaymentMethods(req.user.id);
        res.status(200).json(paymentMethods);
    }
    catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ message: 'Error fetching payment methods' });
    }
};
exports.getPaymentMethods = getPaymentMethods;
/**
 * Get payment history for the current user
 */
const getPaymentHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const payments = await index_1.prisma.payment.findMany({
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
    }
    catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: 'Error fetching payment history' });
    }
};
exports.getPaymentHistory = getPaymentHistory;
