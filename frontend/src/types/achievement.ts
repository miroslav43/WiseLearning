/**
 * Achievement model representing a badge or milestone in the system
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'tutoring' | 'profile' | 'community' | 'learning' | string;
  category?: string;
  pointsRewarded: number;
  iconUrl: string;
  requirement?: {
    type: string;
    count: number;
  };
}

/**
 * User's progress on an achievement
 */
export interface UserAchievement {
  id?: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  progress: number;
  completed: boolean;
  completedAt?: Date;
} 