
import React from 'react';
import { Achievement } from '@/types/user';
import AchievementBadge from './AchievementBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface AchievementListProps {
  achievements: Achievement[];
  title?: string;
  description?: string;
  compact?: boolean;
}

const AchievementList: React.FC<AchievementListProps> = ({
  achievements,
  title = "Realizări",
  description = "Realizările tale deblocate și progresul",
  compact = false,
}) => {
  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  // Order: completed first, then by category
  const sortedAchievements = Object.entries(groupedAchievements).sort((a, b) => {
    // First priority: category with most completed achievements
    const aCompleted = a[1].filter(ach => ach.completed).length;
    const bCompleted = b[1].filter(ach => ach.completed).length;
    if (bCompleted !== aCompleted) return bCompleted - aCompleted;
    
    // Second priority: predefined order
    const order = ['learning', 'mastery', 'community', 'other'];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  // Get category name in Romanian
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'learning': return 'Învățare';
      case 'community': return 'Comunitate';
      case 'mastery': return 'Măiestrie';
      default: return 'Altele';
    }
  };

  if (compact) {
    const completedCount = achievements.filter(a => a.completed).length;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Realizări deblocate</h3>
          <span className="text-sm text-muted-foreground">{completedCount}/{achievements.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {achievements
            .filter(a => a.completed)
            .slice(0, 5)
            .map(achievement => (
              <AchievementBadge 
                key={achievement.id}
                achievement={achievement}
                size="sm"
              />
            ))}
          {completedCount > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
              +{completedCount - 5}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-6">
            {sortedAchievements.map(([category, categoryAchievements]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-brand-800">{getCategoryName(category)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {categoryAchievements.map(achievement => (
                    <div key={achievement.id} className="flex flex-col items-center gap-2 text-center">
                      <AchievementBadge achievement={achievement} size="md" />
                      <div>
                        <p className="text-sm font-medium">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AchievementList;
