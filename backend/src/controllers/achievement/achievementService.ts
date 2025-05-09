import { PointsTxnType } from '@prisma/client';
import { prisma } from '../../index';

/**
 * Get all available achievements
 */
export const getAllAchievements = async () => {
  return prisma.achievement.findMany({
    orderBy: {
      id: 'asc'
    }
  });
};

/**
 * Get achievements for a specific user
 */
export const getUserAchievements = async (userId: string) => {
  // First, ensure all achievements are initialized for the user
  await initializeUserAchievements(userId);
  
  // Then get all user achievements with achievement details
  return prisma.userAchievement.findMany({
    where: {
      userId
    },
    include: {
      achievement: true
    },
    orderBy: {
      completedAt: {
        sort: 'desc',
        nulls: 'last'
      }
    }
  });
};

/**
 * Initialize achievements for a user
 * Ensures all achievements exist for a user
 */
export const initializeUserAchievements = async (userId: string) => {
  // Get all achievements
  const allAchievements = await prisma.achievement.findMany();
  
  // Get user's existing achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: {
      userId
    },
    select: {
      achievementId: true
    }
  });
  
  const existingAchievementIds = userAchievements.map(ua => ua.achievementId);
  
  // Find achievements that user doesn't have yet
  const achievementsToAdd = allAchievements.filter(
    a => !existingAchievementIds.includes(a.id)
  );
  
  // Create missing user achievements
  if (achievementsToAdd.length > 0) {
    const createPromises = achievementsToAdd.map(achievement => 
      prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          completed: false,
          progress: 0
        }
      })
    );
    
    await Promise.all(createPromises);
  }
  
  return true;
};

/**
 * Progress an achievement for a user
 * @param userId User ID
 * @param achievementId Achievement ID
 * @param progress Progress value (absolute)
 * @param increment Whether to increment or set the progress value
 */
export const progressAchievement = async (
  userId: string, 
  achievementId: string, 
  progress: number,
  increment: boolean = true
) => {
  // First get the current achievement and user achievement
  const [achievement, userAchievement] = await Promise.all([
    prisma.achievement.findUnique({
      where: { id: achievementId }
    }),
    prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      }
    })
  ]);
  
  if (!achievement || !userAchievement) {
    throw new Error('Achievement or user achievement not found');
  }
  
  // If already completed, don't update
  if (userAchievement.completed) {
    return userAchievement;
  }
  
  // Calculate new progress
  const newProgress = increment 
    ? Math.min(100, userAchievement.progress + progress)
    : Math.min(100, progress);
    
  // Check if achievement is completed with this update
  const isNowCompleted = newProgress >= 100;
  
  // Update the user achievement
  const updatedAchievement = await prisma.userAchievement.update({
    where: {
      id: userAchievement.id
    },
    data: {
      progress: newProgress,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date() : null
    },
    include: {
      achievement: true
    }
  });
  
  // If achievement is completed, add points to user
  if (isNowCompleted && achievement.pointsRewarded > 0) {
    // Add points transaction
    await prisma.$transaction([
      // Add points transaction
      prisma.pointsTransaction.create({
        data: {
          userId,
          amount: achievement.pointsRewarded,
          type: PointsTxnType.achievement,
          description: `Achievement completed: ${achievement.name}`
        }
      }),
      
      // Update user points
      prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: achievement.pointsRewarded
          }
        }
      }),
      
      // Create notification
      prisma.notification.create({
        data: {
          userId,
          title: 'Achievement Unlocked!',
          message: `You've earned ${achievement.pointsRewarded} points for completing "${achievement.name}"`,
          type: 'success',
          link: '/achievements'
        }
      })
    ]);
  }
  
  return updatedAchievement;
};

/**
 * Complete an achievement for a user (automatic 100% progress)
 */
export const completeAchievement = async (userId: string, achievementId: string) => {
  return progressAchievement(userId, achievementId, 100, false);
}; 