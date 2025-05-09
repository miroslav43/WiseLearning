
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Course } from '@/types/course';
import CoursePrice from './CoursePrice';
import CourseButtons from './CourseButtons';
import CourseStats from './CourseStats';
import CourseIncludes from './CourseIncludes';
import CourseActions from './CourseActions';

interface CourseSidebarProps {
  course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  // Calculate total topics and lessons
  const totalTopics = course.topics ? course.topics.length : 0;
  const totalLessons = course.topics ? course.topics.reduce((total, topic) => total + topic.lessons.length, 0) : 0;
  
  // Calculate total duration
  const totalDuration = course.topics ? course.topics.reduce((total, topic) => {
    return total + topic.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
  }, 0) : 0;

  return (
    <Card className="shadow-lg border-t-4 border-t-brand-500">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Price Component */}
          <CoursePrice price={course.price} />
          
          {/* Buttons Component */}
          <CourseButtons course={course} />
          
          <Separator />
          
          {/* Stats Component */}
          <CourseStats 
            subject={course.subject} 
            totalTopics={totalTopics}
            totalLessons={totalLessons}
            totalDuration={totalDuration}
            updatedAt={course.updatedAt}
          />
          
          <Separator />
          
          {/* Course Includes Component */}
          <CourseIncludes totalLessons={totalLessons} />
          
          <Separator />
          
          {/* Course Actions Component */}
          <CourseActions course={course} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSidebar;
