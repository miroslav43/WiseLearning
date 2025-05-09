
import React from 'react';
import { Badge } from '@/types/user';
import { cn } from '@/lib/utils';
import { Award, BookOpen, Heart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  badge,
  size = 'md',
  showTooltip = true,
}) => {
  const getIcon = () => {
    if (badge.type === 'course') return BookOpen;
    if (badge.type === 'tutoring') return Heart;
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

  const badgeIcon = (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md",
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );

  if (!showTooltip) return badgeIcon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {badgeIcon}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeIcon;
