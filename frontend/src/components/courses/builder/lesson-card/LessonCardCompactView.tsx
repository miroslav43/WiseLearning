
import React from 'react';
import { Lesson } from '@/types/course';
import { getTypeLabel } from './lessonTypeUtils';

interface LessonCardCompactViewProps {
  lesson: Lesson;
}

export const LessonCardCompactView: React.FC<LessonCardCompactViewProps> = ({ lesson }) => {
  return (
    <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        {getTypeLabel(lesson.type)} • {lesson.duration > 0 ? `${lesson.duration} min` : 'Durată nespecificată'}
      </p>
    </div>
  );
};
