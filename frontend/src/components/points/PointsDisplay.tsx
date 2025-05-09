
import React from 'react';
import { usePoints } from '@/contexts/PointsContext';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PointsDisplayProps {
  variant?: 'default' | 'compact';
  showIcon?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  variant = 'default',
  showIcon = true
}) => {
  const { points, formatPoints } = usePoints();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  // Ensure points is a valid number
  const safePoints = points ?? 0;
  
  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="brand" className="flex items-center gap-1 cursor-help">
              {showIcon && <Coins className="h-3.5 w-3.5" />}
              <span>{formatPoints(safePoints)}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Punctele tale disponibile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex items-center">
      <Badge variant="brand" className="flex items-center gap-1 px-3 py-1 text-base">
        {showIcon && <Coins className="h-4 w-4" />}
        <span>{formatPoints(safePoints)} puncte</span>
      </Badge>
    </div>
  );
};

export default PointsDisplay;
