
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import AchievementList from '@/components/achievements/AchievementList';
import { updateAchievements } from '@/services/achievementService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Star, BookOpen } from 'lucide-react';
import { Achievement } from '@/types/user';

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const { completeAchievement } = usePoints();
  
  useEffect(() => {
    if (user) {
      // Update achievements on page load to check for any newly completed achievements
      const handleAchievementCompleted = (achievement: Achievement) => {
        completeAchievement(achievement.id);
      };
      
      updateAchievements(user, handleAchievementCompleted);
    }
  }, [user, completeAchievement]);
  
  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Realizări</h1>
          <p>Trebuie să fii autentificat ca student pentru a accesa realizările.</p>
        </div>
      </div>
    );
  }

  const achievements = user.achievements || [];
  const completedCount = achievements.filter(a => a.completed).length;
  const totalPoints = achievements
    .filter(a => a.completed)
    .reduce((sum, a) => sum + a.pointsRewarded, 0);
  
  // Group achievements by category
  const learningAchievements = achievements.filter(a => a.category === 'learning');
  const masteryAchievements = achievements.filter(a => a.category === 'mastery');
  const communityAchievements = achievements.filter(a => a.category === 'community');
  
  // Calculate completion rate by category
  const getCompletionRate = (items: Achievement[]) => {
    if (!items.length) return 0;
    return Math.round((items.filter(a => a.completed).length / items.length) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Realizările mele</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total realizări</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{completedCount}/{achievements.length}</div>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Puncte câștigate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Învățare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{getCompletionRate(learningAchievements)}%</div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-brand-600 h-1.5 rounded-full" 
                  style={{ width: `${getCompletionRate(learningAchievements)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comunitate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{getCompletionRate(communityAchievements)}%</div>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-brand-600 h-1.5 rounded-full" 
                  style={{ width: `${getCompletionRate(communityAchievements)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-10">
        <AchievementList 
          achievements={achievements}
          title="Toate realizările"
          description="Explorează toate realizările disponibile și progresul tău"
        />
      </div>
    </div>
  );
};

export default AchievementsPage;
