import { Router } from 'express';
import * as achievementController from '../controllers/achievement';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get all achievements
router.get('/', achievementController.getAllAchievements);

// Get achievements for a specific user
router.get('/user/:id', achievementController.getUserAchievements);

// Progress an achievement 
router.post('/:id/progress', authenticate, achievementController.progressAchievement);

// Complete/progress an achievement
router.post('/:id/complete', authenticate, achievementController.completeAchievement);

export default router; 