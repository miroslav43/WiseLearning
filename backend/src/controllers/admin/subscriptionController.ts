import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Get all subscription plans
 * Retrieves all subscription plans ordered by price
 */
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: [
        { price: 'asc' }
      ]
    });
    
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
};

/**
 * Create or update subscription plan
 * Handles both creation and updates of subscription plans
 */
export const upsertSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id, name, description, price, period, featuredBenefit, benefits, isPopular } = req.body;
    
    let plan;
    if (id) {
      // Update existing plan
      plan = await prisma.subscriptionPlan.update({
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
    } else {
      // Create new plan
      plan = await prisma.subscriptionPlan.create({
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
  } catch (error) {
    console.error('Error managing subscription plan:', error);
    res.status(500).json({ message: 'Error managing subscription plan' });
  }
};

/**
 * Delete subscription plan
 * Removes a subscription plan if it has no active subscriptions
 */
export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
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
    await prisma.subscriptionPlan.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: 'Error deleting subscription plan' });
  }
}; 