"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const index_1 = require("../index");
// Mock payment service that simulates Stripe API
class PaymentService {
    constructor() {
        this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    }
    /**
     * Create a payment intent (similar to Stripe's API)
     */
    async createPaymentIntent(amount, currency = 'eur', metadata = {}, paymentMethodTypes = ['card', 'apple_pay', 'google_pay']) {
        // In a real implementation, this would call Stripe's API
        const paymentIntent = {
            id: `pi_${(0, uuid_1.v4)().replace(/-/g, '')}`,
            object: 'payment_intent',
            amount,
            amount_received: 0,
            client_secret: `pi_${(0, uuid_1.v4)().replace(/-/g, '')}_secret_${(0, uuid_1.v4)().replace(/-/g, '')}`,
            currency,
            metadata,
            payment_method_types: paymentMethodTypes,
            status: 'requires_payment_method',
            created: Math.floor(Date.now() / 1000)
        };
        // Store the payment intent in the database for reference
        await index_1.prisma.payment.create({
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
    async createCheckoutSession(priceId, quantity, metadata = {}, customerId) {
        // In a real implementation, this would call Stripe's API
        const paymentIntentId = `pi_${(0, uuid_1.v4)().replace(/-/g, '')}`;
        const session = {
            id: `cs_${(0, uuid_1.v4)().replace(/-/g, '')}`,
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
        await index_1.prisma.payment.create({
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
    async confirmPaymentIntent(paymentIntentId, paymentMethod) {
        // Find the payment in our database
        const payment = await index_1.prisma.payment.findFirst({
            where: { referenceId: paymentIntentId }
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        // Update the payment status in our database
        await index_1.prisma.payment.update({
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
            client_secret: `${paymentIntentId}_secret_${(0, uuid_1.v4)().replace(/-/g, '')}`,
            currency: 'eur',
            metadata: payment.metadata,
            payment_method: paymentMethod,
            payment_method_types: ['card', 'apple_pay', 'google_pay'],
            status: 'succeeded',
            created: Math.floor(payment.createdAt.getTime() / 1000)
        };
    }
    /**
     * Process a webhook event (for handling asynchronous payment events)
     */
    async handleWebhookEvent(eventType, data) {
        // In a real implementation, this would verify and process Stripe webhook events
        console.log(`Processing webhook event: ${eventType}`, data);
        if (eventType === 'payment_intent.succeeded') {
            const paymentIntentId = data.object.id;
            // Find the payment in our database
            const payment = await index_1.prisma.payment.findFirst({
                where: { referenceId: paymentIntentId }
            });
            if (payment) {
                // Update the payment status
                await index_1.prisma.payment.update({
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
    async processCompletedPayment(payment) {
        const metadata = payment.metadata;
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
    async processPointsPackagePayment(packageId, payment) {
        const userId = payment.metadata.userId;
        if (!userId) {
            console.error('Missing user ID in payment metadata');
            return;
        }
        // Find the points package
        const pointsPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id: packageId }
        });
        if (!pointsPackage) {
            console.error(`Points package not found: ${packageId}`);
            return;
        }
        // Create a points transaction
        await index_1.prisma.pointsTransaction.create({
            data: {
                userId,
                amount: pointsPackage.points,
                type: 'purchase',
                description: `Purchased ${pointsPackage.name} package`,
            }
        });
        // Update user's points balance
        await index_1.prisma.user.update({
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
    async processSubscriptionPayment(subscriptionId, payment) {
        // Implementation would depend on your subscription model
        console.log(`Processing subscription payment: ${subscriptionId}`);
    }
    /**
     * Process a course payment
     */
    async processCoursePayment(courseId, payment) {
        const userId = payment.metadata.userId;
        if (!userId) {
            console.error('Missing user ID in payment metadata');
            return;
        }
        // Create enrollment
        await index_1.prisma.enrollment.create({
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
    async getPaymentMethods(customerId) {
        // In a real implementation, this would call Stripe's API
        // For our mock, we'll return some fake payment methods
        return [
            {
                id: `pm_${(0, uuid_1.v4)().replace(/-/g, '')}`,
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
                id: `pm_${(0, uuid_1.v4)().replace(/-/g, '')}`,
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
exports.default = new PaymentService();
