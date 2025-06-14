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
exports.completeAchievement = exports.progressAchievement = exports.getUserAchievements = exports.getAllAchievements = void 0;
const achievementService = __importStar(require("./achievementService"));
/**
 * Get all achievements
 * GET /api/achievements
 */
const getAllAchievements = async (req, res) => {
    try {
        const achievements = await achievementService.getAllAchievements();
        res.status(200).json(achievements);
    }
    catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Failed to fetch achievements' });
    }
};
exports.getAllAchievements = getAllAchievements;
/**
 * Get achievements for a specific user
 * GET /api/achievements/user/:id
 */
const getUserAchievements = async (req, res) => {
    try {
        const { id } = req.params;
        const userAchievements = await achievementService.getUserAchievements(id);
        res.status(200).json(userAchievements);
    }
    catch (error) {
        console.error(`Error fetching achievements for user ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch user achievements' });
    }
};
exports.getUserAchievements = getUserAchievements;
/**
 * Progress/complete an achievement
 * POST /api/achievements/:id/progress
 */
const progressAchievement = async (req, res) => {
    try {
        const { id } = req.params; // Achievement ID
        const userId = req.user.id; // User ID from auth middleware
        const { progress, increment = true } = req.body;
        if (progress === undefined) {
            return res.status(400).json({ message: 'Progress value is required' });
        }
        const updatedAchievement = await achievementService.progressAchievement(userId, id, Number(progress), Boolean(increment));
        res.status(200).json(updatedAchievement);
    }
    catch (error) {
        console.error(`Error progressing achievement ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to progress achievement' });
    }
};
exports.progressAchievement = progressAchievement;
/**
 * Complete an achievement
 * POST /api/achievements/:id/complete
 */
const completeAchievement = async (req, res) => {
    try {
        const { id } = req.params; // Achievement ID
        const userId = req.user.id; // User ID from auth middleware
        const updatedAchievement = await achievementService.completeAchievement(userId, id);
        res.status(200).json(updatedAchievement);
    }
    catch (error) {
        console.error(`Error completing achievement ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to complete achievement' });
    }
};
exports.completeAchievement = completeAchievement;
