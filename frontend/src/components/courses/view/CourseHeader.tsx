
import React from 'react';
import { StarIcon, Clock, Users } from 'lucide-react';
import { Course } from '@/types/course';

interface CourseHeaderProps {
  course: Course;
  formatDuration: (minutes: number) => string;
  totalLessons: number;
  totalDuration: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  course, 
  formatDuration, 
  totalLessons, 
  totalDuration 
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{course.description}</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1">
          <StarIcon className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">{course.rating.toFixed(1)}</span>
          <span className="text-gray-500">({course.reviews.length} recenzii)</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Users className="h-5 w-5 text-primary" />
          <span>{course.students} studenți înscriși</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="h-5 w-5 text-primary" />
          <span>{formatDuration(totalDuration)} ({totalLessons} lecții)</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {course.subject}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
          Actualizat {course.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CourseHeader;
