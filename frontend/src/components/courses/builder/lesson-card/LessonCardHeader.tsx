
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Trash2, Edit, Eye, GripVertical, Pencil } from 'lucide-react';
import { Lesson } from '@/types/course';
import { getLessonTypeIcon, getLessonTypeColor, getTypeLabel } from './lessonTypeUtils';

export interface LessonCardHeaderProps {
  lesson: Lesson;
  lessonIndex?: number;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  removeLesson: () => void;
  isEditing: boolean;
  toggleEdit: () => void;
  dragHandleProps?: any;
}

export const LessonCardHeader: React.FC<LessonCardHeaderProps> = ({
  lesson,
  isCollapsed,
  toggleCollapse,
  removeLesson,
  isEditing,
  toggleEdit,
  dragHandleProps
}) => {
  const typeIcon = getLessonTypeIcon(lesson.type);
  const typeColor = getLessonTypeColor(lesson.type);
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3 flex-1">
        {dragHandleProps && (
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <div className={`${typeColor} mr-1`}>
          {typeIcon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium truncate pr-2">{lesson.title || 'Lecție fără titlu'}</h3>
          {lesson.duration > 0 && (
            <p className="text-xs text-gray-500">{lesson.duration} min</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        <Badge variant={isEditing ? "outline" : "secondary"} className="mr-2">
          {getTypeLabel(lesson.type)}
        </Badge>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleEdit}
                className="h-8 w-8 p-0"
              >
                {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isEditing ? 'Vezi lecția' : 'Editează lecția'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeLesson}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Șterge lecția</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isCollapsed ? 'Extinde lecția' : 'Restrânge lecția'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
