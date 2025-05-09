
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trash2, Edit, Eye } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { v4 as uuidv4 } from 'uuid';
import { Lesson } from '@/types/course';
import { LessonCardHeader } from './LessonCardHeader';
import { LessonContent } from './LessonContent';
import { LessonCardCompactView } from './LessonCardCompactView';

interface LessonCardProps {
  lesson: Lesson;
  moduleIndex: number;
  lessonIndex: number;
  removeLesson: (index: number) => void;
  updateLesson: (index: number, updatedLesson: Lesson) => void;
  dragHandleProps?: any;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  moduleIndex,
  lessonIndex,
  removeLesson,
  updateLesson,
  dragHandleProps
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const toggleCompact = () => {
    setIsCompact(!isCompact);
  };

  const handleUpdateLesson = (field: string, value: any) => {
    // Create a copy of the lesson to modify
    let updatedLesson: Lesson = { ...lesson };
    
    // Handle special cases for quiz and assignment
    if (field === 'quiz') {
      updatedLesson.quiz = {
        id: value.id || lesson.quiz?.id || uuidv4(),
        title: value.title || "",
        description: value.description || "",
        questions: value.questions || [],
        timeLimit: value.timeLimit || 0
      };
    } else if (field === 'assignment') {
      updatedLesson.assignment = {
        id: value.id || lesson.assignment?.id || uuidv4(),
        title: value.title || "",
        description: value.description || "",
        maxScore: value.maxScore || 0,
        allowFileUpload: value.allowFileUpload || false,
        allowedFileTypes: value.allowedFileTypes || [],
        unitTests: value.unitTests || []
      };
    } else {
      // For regular fields, just update the field directly
      updatedLesson[field] = value;
    }
    
    updateLesson(lessonIndex, updatedLesson);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <LessonCardHeader 
        lesson={lesson}
        isCollapsed={!isExpanded}
        toggleCollapse={toggleExpanded}
        removeLesson={() => removeLesson(lessonIndex)}
        isEditing={isEditing}
        toggleEdit={toggleEditing}
        dragHandleProps={dragHandleProps}
      />
      
      {isExpanded ? (
        <LessonContent
          lesson={lesson}
          isEditing={isEditing}
          handleUpdateLesson={handleUpdateLesson}
        />
      ) : isCompact ? (
        <LessonCardCompactView lesson={lesson} />
      ) : null}
    </Card>
  );
};
