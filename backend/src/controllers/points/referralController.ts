import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../index';

/**
 * Get user's referral code
 */
export const getMyReferralCode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find or create user's referral code
    let referral = await prisma.referralCode.findFirst({
      where: {
        userId: req.user.id,
        isUserCode: true
      }
    });
    
    if (!referral) {
      // Generate a unique code for the user based on their username or ID
      const code = `${req.user.username || 'user'}_${uuidv4().substring(0, 8)}`.toUpperCase();
      
      referral = await prisma.referralCode.create({
        data: {
          code,
          userId: req.user.id,
          isUserCode: true,
          pointsReward: 50, // Default reward
          active: true
        }
      });
    }
    
    const usageCount = await prisma.referralUse.count({
      where: {
        referralCodeId: referral.id
      }
    });
    
    const pointsEarned = await prisma.pointsTransaction.aggregate({
      where: {
        userId: req.user.id,
        type: 'referral'
      },
      _sum: {
        amount: true
      }
    });
    
    res.status(200).json({
      code: referral.code,
      usageCount,
      pointsEarned: pointsEarned._sum.amount || 0
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({ message: 'Error getting referral code' });
  }
};

/**
 * Apply a referral code
 */
export const applyReferralCode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Referral code is required' });
    }
    
    // Find the referral code
    const referralCode = await prisma.referralCode.findFirst({
      where: {
        code,
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });
    
    if (!referralCode) {
      return res.status(404).json({ message: 'Invalid or expired referral code' });
    }
    
    // Check if user is trying to use their own code
    if (referralCode.userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot use your own referral code' });
    }
    
    // Check if code has reached max uses
    if (referralCode.maxUses !== null) {
      const usageCount = await prisma.referralUse.count({
        where: {
          referralCodeId: referralCode.id
        }
      });
      
      if (usageCount >= referralCode.maxUses) {
        return res.status(400).json({ message: 'This referral code has reached its maximum number of uses' });
      }
    }
    
    // Check if user has already used this code
    const existingUse = await prisma.referralUse.findFirst({
      where: {
        referralCodeId: referralCode.id,
        userId: req.user.id
      }
    });
    
    if (existingUse) {
      return res.status(400).json({ message: 'You have already used this referral code' });
    }
    
    // Record the use of the referral code
    await prisma.referralUse.create({
      data: {
        referralCodeId: referralCode.id,
        userId: req.user.id
      }
    });
    
    // Add points to the user
    const transaction = await prisma.pointsTransaction.create({
      data: {
        userId: req.user.id,
        amount: referralCode.pointsReward,
        type: 'referral',
        description: `Applied referral code ${code}`
      }
    });
    
    // Update user's points balance
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { increment: referralCode.pointsReward } }
    });
    
    // If it's a user's referral code, also reward the referrer
    if (referralCode.isUserCode && referralCode.userId) {
      // Add referral reward to the code owner (usually a smaller amount or same)
      const referrerReward = referralCode.pointsReward; // Could be different
      
      await prisma.pointsTransaction.create({
        data: {
          userId: referralCode.userId,
          amount: referrerReward,
          type: 'referral',
          description: `Your referral code ${code} was used by a new user`
        }
      });
      
      await prisma.user.update({
        where: { id: referralCode.userId },
        data: { points: { increment: referrerReward } }
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Successfully applied referral code for ${referralCode.pointsReward} points`,
      pointsAwarded: referralCode.pointsReward
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    res.status(500).json({ message: 'Error applying referral code' });
  }
};

/**
 * Admin: Get all referral codes
 */
export const getAllReferralCodes = async (_req: Request, res: Response) => {
  try {
    const codes = await prisma.referralCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Get usage counts for each code
    const codesWithUsage = await Promise.all(
      codes.map(async (code) => {
        const usageCount = await prisma.referralUse.count({
          where: { referralCodeId: code.id }
        });
        
        return {
          ...code,
          usageCount
        };
      })
    );
    
    res.status(200).json(codesWithUsage);
  } catch (error) {
    console.error('Error fetching referral codes:', error);
    res.status(500).json({ message: 'Error fetching referral codes' });
  }
};

/**
 * Admin: Create a new referral code
 */
export const createReferralCode = async (req: Request, res: Response) => {
  try {
    const { code, pointsReward, maxUses, active, expiresAt } = req.body;
    
    if (!code || !pointsReward) {
      return res.status(400).json({ message: 'Code and points reward are required' });
    }
    
    // Check if code already exists
    const existingCode = await prisma.referralCode.findFirst({
      where: { code }
    });
    
    if (existingCode) {
      return res.status(400).json({ message: 'This referral code already exists' });
    }
    
    const newCode = await prisma.referralCode.create({
      data: {
        code,
        pointsReward: Number(pointsReward),
        maxUses: maxUses ? Number(maxUses) : null,
        active: active !== undefined ? active : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isUserCode: false
      }
    });
    
    res.status(201).json({ ...newCode, usageCount: 0 });
  } catch (error) {
    console.error('Error creating referral code:', error);
    res.status(500).json({ message: 'Error creating referral code' });
  }
};

/**
 * Admin: Update an existing referral code
 */
export const updateReferralCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, pointsReward, maxUses, active, expiresAt } = req.body;
    
    // Check if code exists
    const existingCode = await prisma.referralCode.findUnique({
      where: { id }
    });
    
    if (!existingCode) {
      return res.status(404).json({ message: 'Referral code not found' });
    }
    
    // If code is changing, check if new code already exists
    if (code && code !== existingCode.code) {
      const duplicateCode = await prisma.referralCode.findFirst({
        where: {
          code,
          id: { not: id }
        }
      });
      
      if (duplicateCode) {
        return res.status(400).json({ message: 'This referral code already exists' });
      }
    }
    
    const updatedCode = await prisma.referralCode.update({
      where: { id },
      data: {
        code: code || existingCode.code,
        pointsReward: pointsReward !== undefined ? Number(pointsReward) : existingCode.pointsReward,
        maxUses: maxUses !== undefined ? (maxUses ? Number(maxUses) : null) : existingCode.maxUses,
        active: active !== undefined ? active : existingCode.active,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : existingCode.expiresAt
      }
    });
    
    // Get usage count
    const usageCount = await prisma.referralUse.count({
      where: { referralCodeId: id }
    });
    
    res.status(200).json({ ...updatedCode, usageCount });
  } catch (error) {
    console.error('Error updating referral code:', error);
    res.status(500).json({ message: 'Error updating referral code' });
  }
};

/**
 * Admin: Delete a referral code
 */
export const deleteReferralCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if code exists
    const existingCode = await prisma.referralCode.findUnique({
      where: { id }
    });
    
    if (!existingCode) {
      return res.status(404).json({ message: 'Referral code not found' });
    }
    
    // Don't delete user-specific codes
    if (existingCode.isUserCode) {
      return res.status(400).json({ message: 'Cannot delete user-specific referral codes' });
    }
    
    // Delete uses first (cascade would be better in the schema)
    await prisma.referralUse.deleteMany({
      where: { referralCodeId: id }
    });
    
    // Delete the code
    await prisma.referralCode.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Referral code deleted successfully' });
  } catch (error) {
    console.error('Error deleting referral code:', error);
    res.status(500).json({ message: 'Error deleting referral code' });
  }
};

/**
 * Admin: Toggle active status of a referral code
 */
export const toggleReferralCodeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if code exists
    const existingCode = await prisma.referralCode.findUnique({
      where: { id }
    });
    
    if (!existingCode) {
      return res.status(404).json({ message: 'Referral code not found' });
    }
    
    const updatedCode = await prisma.referralCode.update({
      where: { id },
      data: {
        active: !existingCode.active
      }
    });
    
    // Get usage count
    const usageCount = await prisma.referralUse.count({
      where: { referralCodeId: id }
    });
    
    res.status(200).json({ ...updatedCode, usageCount });
  } catch (error) {
    console.error('Error toggling referral code status:', error);
    res.status(500).json({ message: 'Error toggling referral code status' });
  }
}; 