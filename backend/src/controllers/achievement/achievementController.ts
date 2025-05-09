import { Request, Response } from 'express';
import * as achievementService from './achievementService';

/**
 * Get all achievements
 * GET /api/achievements
 */
export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
};

/**
 * Get achievements for a specific user
 * GET /api/achievements/user/:id
 */
export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userAchievements = await achievementService.getUserAchievements(id);
    res.status(200).json(userAchievements);
  } catch (error) {
    console.error(`Error fetching achievements for user ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch user achievements' });
  }
};

/**
 * Progress/complete an achievement
 * POST /api/achievements/:id/progress
 */
export const progressAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Achievement ID
    const userId = (req as any).user.id; // User ID from auth middleware
    const { progress, increment = true } = req.body;
    
    if (progress === undefined) {
      return res.status(400).json({ message: 'Progress value is required' });
    }
    
    const updatedAchievement = await achievementService.progressAchievement(
      userId, 
      id, 
      Number(progress),
      Boolean(increment)
    );
    
    res.status(200).json(updatedAchievement);
  } catch (error) {
    console.error(`Error progressing achievement ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to progress achievement' });
  }
};

/**
 * Complete an achievement
 * POST /api/achievements/:id/complete
 */
export const completeAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Achievement ID
    const userId = (req as any).user.id; // User ID from auth middleware
    
    const updatedAchievement = await achievementService.completeAchievement(userId, id);
    
    res.status(200).json(updatedAchievement);
  } catch (error) {
    console.error(`Error completing achievement ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to complete achievement' });
  }
}; 