"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeAchievement = exports.progressAchievement = exports.initializeUserAchievements = exports.getUserAchievements = exports.getAllAchievements = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../../index");
/**
 * Get all available achievements
 */
const getAllAchievements = async () => {
    return index_1.prisma.achievement.findMany({
        orderBy: {
            id: 'asc'
        }
    });
};
exports.getAllAchievements = getAllAchievements;
/**
 * Get achievements for a specific user
 */
const getUserAchievements = async (userId) => {
    // First, ensure all achievements are initialized for the user
    await (0, exports.initializeUserAchievements)(userId);
    // Then get all user achievements with achievement details
    return index_1.prisma.userAchievement.findMany({
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
exports.getUserAchievements = getUserAchievements;
/**
 * Initialize achievements for a user
 * Ensures all achievements exist for a user
 */
const initializeUserAchievements = async (userId) => {
    // Get all achievements
    const allAchievements = await index_1.prisma.achievement.findMany();
    // Get user's existing achievements
    const userAchievements = await index_1.prisma.userAchievement.findMany({
        where: {
            userId
        },
        select: {
            achievementId: true
        }
    });
    const existingAchievementIds = userAchievements.map(ua => ua.achievementId);
    // Find achievements that user doesn't have yet
    const achievementsToAdd = allAchievements.filter(a => !existingAchievementIds.includes(a.id));
    // Create missing user achievements
    if (achievementsToAdd.length > 0) {
        const createPromises = achievementsToAdd.map(achievement => index_1.prisma.userAchievement.create({
            data: {
                userId,
                achievementId: achievement.id,
                completed: false,
                progress: 0
            }
        }));
        await Promise.all(createPromises);
    }
    return true;
};
exports.initializeUserAchievements = initializeUserAchievements;
/**
 * Progress an achievement for a user
 * @param userId User ID
 * @param achievementId Achievement ID
 * @param progress Progress value (absolute)
 * @param increment Whether to increment or set the progress value
 */
const progressAchievement = async (userId, achievementId, progress, increment = true) => {
    // First get the current achievement and user achievement
    const [achievement, userAchievement] = await Promise.all([
        index_1.prisma.achievement.findUnique({
            where: { id: achievementId }
        }),
        index_1.prisma.userAchievement.findUnique({
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
    const updatedAchievement = await index_1.prisma.userAchievement.update({
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
        await index_1.prisma.$transaction([
            // Add points transaction
            index_1.prisma.pointsTransaction.create({
                data: {
                    userId,
                    amount: achievement.pointsRewarded,
                    type: client_1.PointsTxnType.achievement,
                    description: `Achievement completed: ${achievement.name}`
                }
            }),
            // Update user points
            index_1.prisma.user.update({
                where: { id: userId },
                data: {
                    points: {
                        increment: achievement.pointsRewarded
                    }
                }
            }),
            // Create notification
            index_1.prisma.notification.create({
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
exports.progressAchievement = progressAchievement;
/**
 * Complete an achievement for a user (automatic 100% progress)
 */
const completeAchievement = async (userId, achievementId) => {
    return (0, exports.progressAchievement)(userId, achievementId, 100, false);
};
exports.completeAchievement = completeAchievement;
