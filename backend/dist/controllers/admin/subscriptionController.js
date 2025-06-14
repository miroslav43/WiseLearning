"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionPlan = exports.upsertSubscriptionPlan = exports.getSubscriptionPlans = void 0;
const index_1 = require("../../index");
/**
 * Get all subscription plans
 * Retrieves all subscription plans ordered by price
 */
const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await index_1.prisma.subscriptionPlan.findMany({
            orderBy: [
                { price: 'asc' }
            ]
        });
        res.status(200).json(plans);
    }
    catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ message: 'Error fetching subscription plans' });
    }
};
exports.getSubscriptionPlans = getSubscriptionPlans;
/**
 * Create or update subscription plan
 * Handles both creation and updates of subscription plans
 */
const upsertSubscriptionPlan = async (req, res) => {
    try {
        const { id, name, description, price, period, featuredBenefit, benefits, isPopular } = req.body;
        let plan;
        if (id) {
            // Update existing plan
            plan = await index_1.prisma.subscriptionPlan.update({
                where: { id },
                data: {
                    name,
                    description,
                    price,
                    period,
                    featuredBenefit,
                    benefits,
                    isPopular
                }
            });
        }
        else {
            // Create new plan
            plan = await index_1.prisma.subscriptionPlan.create({
                data: {
                    name,
                    description,
                    price,
                    period,
                    featuredBenefit,
                    benefits: benefits || [],
                    isPopular: isPopular || false
                }
            });
        }
        res.status(200).json({
            message: id ? 'Subscription plan updated' : 'Subscription plan created',
            plan
        });
    }
    catch (error) {
        console.error('Error managing subscription plan:', error);
        res.status(500).json({ message: 'Error managing subscription plan' });
    }
};
exports.upsertSubscriptionPlan = upsertSubscriptionPlan;
/**
 * Delete subscription plan
 * Removes a subscription plan if it has no active subscriptions
 */
const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if plan exists
        const plan = await index_1.prisma.subscriptionPlan.findUnique({
            where: { id },
            include: {
                users: true
            }
        });
        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found' });
        }
        // Check if plan has active subscriptions
        if (plan.users.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete plan with active subscriptions. Update the plan instead.'
            });
        }
        // Delete plan
        await index_1.prisma.subscriptionPlan.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Subscription plan deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ message: 'Error deleting subscription plan' });
    }
};
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
