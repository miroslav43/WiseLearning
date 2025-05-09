
import { Achievement } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

// Define all possible achievements
export const achievementDefinitions: Omit<Achievement, 'completed' | 'completedAt'>[] = [
  {
    id: 'first-lesson',
    name: 'Prima lecție',
    description: 'Completează prima lecție din orice curs',
    pointsRewarded: 50,
    category: 'learning',
  },
  {
    id: 'course-completed',
    name: 'Primul curs finalizat',
    description: 'Finalizează complet primul tău curs',
    pointsRewarded: 100,
    category: 'learning',
  },
  {
    id: 'top-quiz',
    name: 'Performanță de top',
    description: 'Obține un scor în primele 10% la un test',
    pointsRewarded: 75,
    category: 'mastery',
  },
  {
    id: 'five-assignments',
    name: 'Tema perfectă',
    description: 'Completează 5 teme cu succes',
    pointsRewarded: 120,
    category: 'learning',
  },
  {
    id: 'daily-streak',
    name: 'Consecvență',
    description: 'Conectează-te 7 zile consecutive',
    pointsRewarded: 150,
    category: 'community',
  },
  {
    id: 'first-comment',
    name: 'Contribuitor',
    description: 'Lasă primul tău comentariu într-un curs',
    pointsRewarded: 25,
    category: 'community',
  },
  {
    id: 'three-courses',
    name: 'Pasionat de cunoaștere',
    description: 'Înscrie-te la cel puțin 3 cursuri diferite',
    pointsRewarded: 80,
    category: 'learning',
  },
  {
    id: 'perfect-quiz',
    name: 'Perfecțiune',
    description: 'Obține scorul maxim la un test',
    pointsRewarded: 100,
    category: 'mastery',
  },
  {
    id: 'share-course',
    name: 'Ambasador',
    description: 'Împărtășește un curs pe rețelele sociale',
    pointsRewarded: 50,
    category: 'community',
  },
];

// Initialize user achievements
export const initializeAchievements = (): Achievement[] => {
  return achievementDefinitions.map(achievement => ({
    ...achievement,
    completed: false,
    progress: 0,
  }));
};

// Check if an achievement is completed
export const checkAchievementCompletion = (
  achievementId: string,
  user: any, // Using any here to avoid circular dependencies
  additionalData?: any
): boolean => {
  if (!user) return false;
  
  switch (achievementId) {
    case 'first-lesson':
      return (user.completedLessons?.length || 0) > 0;
      
    case 'course-completed':
      // Logic to check if a course is fully completed
      // This is a placeholder - actual implementation would need course completion data
      return false;
      
    case 'top-quiz':
      // Placeholder - would need quiz score data and distribution
      return false;
      
    case 'five-assignments':
      return (user.completedAssignments?.length || 0) >= 5;
      
    case 'daily-streak':
      // Would need login streak data
      return false;
      
    case 'first-comment':
      // Would need comment data
      return false;
      
    case 'three-courses':
      return (user.enrolledCourses?.length || 0) >= 3;
      
    case 'perfect-quiz':
      // Check if any quiz has a perfect score
      const quizScores = user.completedQuizzes || {};
      return Object.values(quizScores).some((score: any) => score === 100);
      
    case 'share-course':
      // Would need social sharing data
      return false;
      
    default:
      return false;
  }
};

// Calculate achievement progress
export const calculateAchievementProgress = (
  achievementId: string,
  user: any
): number => {
  if (!user) return 0;
  
  switch (achievementId) {
    case 'five-assignments':
      const completed = user.completedAssignments?.length || 0;
      return Math.min(completed / 5 * 100, 100);
      
    case 'daily-streak':
      // Placeholder for login streak logic
      // Would track consecutive days logged in
      return 0;
      
    case 'three-courses':
      const enrolled = user.enrolledCourses?.length || 0;
      return Math.min(enrolled / 3 * 100, 100);
      
    default:
      // For binary achievements (completed or not), return either 0 or 100
      return checkAchievementCompletion(achievementId, user) ? 100 : 0;
  }
};

// Update user achievements
export const updateAchievements = (
  user: any, 
  onAchievementCompleted?: (achievement: Achievement) => void
): Achievement[] => {
  if (!user || !user.achievements) return [];
  
  const updatedAchievements = user.achievements.map((achievement: Achievement) => {
    // Skip already completed achievements
    if (achievement.completed) return achievement;
    
    // Check if the achievement is now completed
    const isCompleted = checkAchievementCompletion(achievement.id, user);
    
    // Calculate progress
    const progress = calculateAchievementProgress(achievement.id, user);
    
    // If newly completed, set completion date and notify
    if (isCompleted && !achievement.completed) {
      const completedAchievement = {
        ...achievement,
        completed: true,
        completedAt: new Date(),
        progress: 100
      };
      
      if (onAchievementCompleted) {
        onAchievementCompleted(completedAchievement);
      }
      
      return completedAchievement;
    }
    
    // Update progress for incomplete achievements
    return {
      ...achievement,
      progress
    };
  });
  
  return updatedAchievements;
};
