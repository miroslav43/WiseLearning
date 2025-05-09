
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AchievementBadge from './AchievementBadge';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileAchievements: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || !user.achievements) {
    return null;
  }
  
  const achievements = user.achievements;
  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements
    .filter(a => !a.completed && (a.progress ?? 0) > 0)
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Realizări
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {completedAchievements.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Realizări deblocate</h3>
            <div className="flex flex-wrap gap-2">
              {completedAchievements.slice(0, 5).map(achievement => (
                <AchievementBadge 
                  key={achievement.id}
                  achievement={achievement}
                  size="sm"
                />
              ))}
              {completedAchievements.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                  +{completedAchievements.length - 5}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Nu ai deblocat încă nicio realizare.
          </div>
        )}
        
        {inProgressAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">În progres</h3>
            <div className="space-y-3">
              {inProgressAchievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{achievement.name}</span>
                    <span className="text-muted-foreground">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-brand-600 h-1.5 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button asChild variant="outline" className="w-full mt-2">
          <Link to="/my-achievements">
            Vezi toate realizările
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileAchievements;
