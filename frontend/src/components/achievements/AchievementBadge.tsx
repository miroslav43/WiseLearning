
import React from 'react';
import { Achievement } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Award, Star, BookOpen, CheckCircle2, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showTooltip = true,
}) => {
  const getIcon = () => {
    // Default icons based on category
    if (achievement.category === 'learning') return BookOpen;
    if (achievement.category === 'community') return Star;
    if (achievement.category === 'mastery') return Trophy;
    return Award;
  };

  const Icon = getIcon();
  
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-12 h-12 p-2',
    lg: 'w-16 h-16 p-3',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const badge = (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br relative",
        achievement.completed 
          ? "from-brand-600 to-brand-800 text-white shadow-md" 
          : "from-gray-200 to-gray-300 text-gray-500 grayscale",
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {achievement.completed && size !== 'sm' && (
        <CheckCircle2 className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
      )}
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {badge}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{achievement.name}</p>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            {achievement.pointsRewarded > 0 && (
              <p className="text-xs text-brand-600 font-medium">
                {achievement.completed 
                  ? `Ai primit ${achievement.pointsRewarded} puncte!` 
                  : `Recompensă: ${achievement.pointsRewarded} puncte`}
              </p>
            )}
            {!achievement.completed && achievement.progress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-brand-600 h-1.5 rounded-full" 
                  style={{ width: `${achievement.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
