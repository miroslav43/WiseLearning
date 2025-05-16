import { useNotifications } from '@/contexts/NotificationContext';
import { Achievement, UserAchievement } from '@/types/achievement';
import { apiClient } from '@/utils/apiClient';

// Mock achievement definitions for compatibility with existing components
export const achievementDefinitions: Achievement[] = [
  {
    id: 'course_completion',
    name: 'Completarea unui curs',
    description: 'Finalizează un curs complet',
    type: 'course',
    pointsRewarded: 50,
    iconUrl: '/icons/achievements/course.svg'
  },
  {
    id: 'first_tutoring',
    name: 'Prima sesiune de tutoriat',
    description: 'Participă la prima ta sesiune de tutoriat',
    type: 'tutoring',
    pointsRewarded: 25,
    iconUrl: '/icons/achievements/tutoring.svg'
  },
  {
    id: 'profile_completion',
    name: 'Profil completat',
    description: 'Completează-ți profilul 100%',
    type: 'profile',
    pointsRewarded: 15,
    iconUrl: '/icons/achievements/profile.svg'
  }
];

// For compatibility with existing components
export const initializeAchievements = async () => {
  try {
    return await getAllAchievements();
  } catch (error) {
    console.error('Error initializing achievements:', error);
    return achievementDefinitions;
  }
};

// For compatibility with existing components
export const updateAchievements = async (userId?: string) => {
  try {
    if (userId) {
      return await getUserAchievements(userId);
    } else {
      return await getMyAchievements();
    }
  } catch (error) {
    console.error('Error updating achievements:', error);
    return [];
  }
};

// Get all achievements
export const getAllAchievements = async () => {
  return apiClient.get<Achievement[]>('/achievements');
};

// Get achievements for a specific user
export const getUserAchievements = async (userId: string) => {
  return apiClient.get<UserAchievement[]>(`/achievements/user/${userId}`);
};

// Get my achievements (for the current user)
export const getMyAchievements = async () => {
  const userId = 'current'; // This will be handled by the backend based on the JWT token
  return apiClient.get<UserAchievement[]>(`/achievements/user/${userId}`);
};

// Progress an achievement for the current user
export const progressAchievement = async (
  achievementId: string,
  progress: number,
  increment: boolean = true
) => {
  return apiClient.post<UserAchievement>(`/achievements/${achievementId}/progress`, {
    progress,
    increment
  });
};

// Complete an achievement for the current user
export const completeAchievement = async (achievementId: string) => {
  return apiClient.post<UserAchievement>(`/achievements/${achievementId}/complete`, {});
};

// Custom hook for using achievement service with notifications
export const useAchievementService = () => {
  const { addNotification } = useNotifications();
  
  const progressAchievementWithNotification = async (
    achievementId: string,
    progress: number,
    increment: boolean = true
  ) => {
    try {
      const result = await progressAchievement(achievementId, progress, increment);
      
      if (result.completed) {
        // If the achievement was just completed
        const achievement = result.achievement;
        addNotification({
          title: 'Realizare deblocată!',
          message: `Ai deblocat "${achievement.name}" și ai primit ${achievement.pointsRewarded} puncte.`,
          type: 'success'
        });
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la actualizarea progresului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const completeAchievementWithNotification = async (achievementId: string) => {
    try {
      const result = await completeAchievement(achievementId);
      
      if (result.completed) {
        // If the achievement was just completed
        const achievement = result.achievement;
        addNotification({
          title: 'Realizare completată!',
          message: `Ai completat "${achievement.name}" și ai primit ${achievement.pointsRewarded} puncte.`,
          type: 'success'
        });
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la completarea realizării';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  return {
    progressAchievementWithNotification,
    completeAchievementWithNotification
  };
};
