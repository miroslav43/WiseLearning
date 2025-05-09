
import { BookOpen, FileQuestion, FileText } from 'lucide-react';
import { ContentType } from '@/types/course';
import React from 'react';

export const getTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'lesson':
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case 'quiz':
      return <FileQuestion className="h-4 w-4 text-green-500" />;
    case 'assignment':
      return <FileText className="h-4 w-4 text-orange-500" />;
    default:
      return <BookOpen className="h-4 w-4 text-blue-500" />;
  }
};

export const getLessonTypeIcon = getTypeIcon;

export const getLessonTypeColor = (type: ContentType): string => {
  switch (type) {
    case 'lesson':
      return 'text-blue-500';
    case 'quiz':
      return 'text-green-500';
    case 'assignment':
      return 'text-orange-500';
    default:
      return 'text-blue-500';
  }
};

export const getTypeLabel = (type: ContentType): string => {
  switch (type) {
    case 'lesson':
      return 'Lecție';
    case 'quiz':
      return 'Quiz';
    case 'assignment':
      return 'Temă';
    default:
      return 'Conținut';
  }
};
