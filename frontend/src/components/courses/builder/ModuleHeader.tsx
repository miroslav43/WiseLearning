
import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2, GripVertical, MinusSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModuleHeaderProps {
  moduleTitle: string;
  moduleOrder: number;
  lessonsCount: number;
  isEditing: boolean;
  isExpanded: boolean;
  isCompact: boolean;
  onToggleExpand: () => void;
  onToggleEdit: () => void;
  onRemoveModule: () => void;
  onToggleCompact: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  moduleTitle,
  moduleOrder,
  lessonsCount,
  isEditing,
  isExpanded,
  isCompact,
  onToggleExpand,
  onToggleEdit,
  onRemoveModule,
  onToggleCompact,
  dragHandleProps
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg">
      <div className="flex items-center gap-2 flex-1">
        <div {...dragHandleProps} className="cursor-move p-1 hover:bg-gray-200 rounded">
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg">Modul {moduleOrder}</span>
            <Badge variant="outline" className="text-xs">
              {lessonsCount} {lessonsCount === 1 ? 'element' : 'elemente'}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleCompact}
                className="text-gray-500"
              >
                <MinusSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCompact ? 'Extinde' : 'Compactează'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleEdit}
        >
          {isEditing ? 'Gata' : 'Editează'}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleExpand}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemoveModule} 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Șterge
        </Button>
      </div>
    </CardHeader>
  );
};
