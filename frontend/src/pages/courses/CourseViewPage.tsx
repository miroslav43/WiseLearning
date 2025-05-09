
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useCourse } from '@/hooks/useCourse';
import CourseHeader from '@/components/courses/view/CourseHeader';
import CourseTopics from '@/components/courses/view/CourseTopics';
import CourseReviews from '@/components/courses/view/CourseReviews';
import CourseSidebar from '@/components/courses/view/CourseSidebar';
import CourseLearningPoints from '@/components/courses/view/CourseLearningPoints';
import CourseLoadingState from '@/components/courses/view/CourseLoadingState';
import CourseNotFound from '@/components/courses/view/CourseNotFound';
import { useReviewService } from '@/services/reviewService';

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { 
    course, 
    isLoading, 
    expandedTopics, 
    toggleTopic, 
    formatDuration,
    firstLessonId,
    totalLessons,
    totalDuration
  } = useCourse(courseId);
  
  const { getCourseReviewsByCourseId, getAverageCourseRating } = useReviewService();
  const [refreshKey, setRefreshKey] = useState(0);

  // Sample learning points (in a real app, these would come from the course data)
  const learningPoints = [
    "Fundamentele teoretice ale materiei",
    "Aplicații practice și studii de caz",
    "Tehnici de rezolvare a subiectelor de examen",
    "Metode eficiente de învățare și memorare"
  ];

  const handleRefreshReviews = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return <CourseLoadingState />;
  }

  if (!course || !courseId) {
    return <CourseNotFound />;
  }

  // Get reviews for this course
  const reviews = getCourseReviewsByCourseId(courseId);
  const averageRating = getAverageCourseRating(courseId);

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      <CourseHeader 
        course={course}
        formatDuration={formatDuration}
        totalLessons={totalLessons}
        totalDuration={totalDuration}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 lg:mb-8">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6 lg:space-y-8">
            <CourseLearningPoints learningPoints={learningPoints} />
            
            <Separator />
            
            <CourseTopics 
              courseId={courseId}
              topics={course.topics}
              expandedTopics={expandedTopics}
              toggleTopic={toggleTopic}
              formatDuration={formatDuration}
            />
            
            <Separator />
            
            <CourseReviews 
              courseId={courseId}
              rating={averageRating || 0}
              reviews={reviews}
              onRefreshReviews={handleRefreshReviews}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
          <div className="sticky top-4">
            <CourseSidebar course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
