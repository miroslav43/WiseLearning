import { fetchCourse } from '@/services/courseService';
import { Course, Lesson } from '@/types/course';
import { useEffect, useState } from 'react';

interface UseCourseResult {
  course: Course | null;
  isLoading: boolean;
  error: Error | null;
  expandedTopics: {[key: string]: boolean};
  toggleTopic: (topicId: string) => void;
  formatDuration: (minutes: number) => string;
  getFirstLesson: () => Lesson | null;
  firstLessonId: string | null;
  totalLessons: number;
  totalDuration: number;
}

export const useCourse = (courseId: string | undefined): UseCourseResult => {
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);
      
      // Stronger check for courseId
      if (!courseId || courseId === 'undefined' || courseId.trim() === '') {
        setCourse(null);
        setExpandedTopics({});
        setFirstLessonId(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const foundCourse = await fetchCourse(courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          
          // Initialize all topics as expanded
          if (foundCourse.topics && foundCourse.topics.length > 0) {
            const topicsState = foundCourse.topics.reduce((acc, topic) => {
              acc[topic.id] = true;
              return acc;
            }, {} as {[key: string]: boolean});
            setExpandedTopics(topicsState);
            
            // Find the first lesson ID for the course
            const firstTopic = foundCourse.topics[0];
            if (firstTopic?.lessons && firstTopic.lessons.length > 0) {
              setFirstLessonId(firstTopic.lessons[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError(err instanceof Error ? err : new Error('Failed to load course details'));
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const formatDuration = (minutes: number): string => {
    if (!minutes || isNaN(minutes)) return '0 minute';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} minute`;
  };

  const getFirstLesson = (): Lesson | null => {
    if (!course || !course.topics || course.topics.length === 0) return null;
    
    for (const topic of course.topics) {
      if (topic.lessons && topic.lessons.length > 0) {
        return topic.lessons[0];
      }
    }
    
    return null;
  };

  // Calculate total lessons with safe navigation
  const totalLessons = course?.topics?.reduce(
    (total, topic) => total + (topic.lessons?.length ?? 0), 
    0
  ) ?? 0;

  // Calculate total duration with safe navigation
  const totalDuration = course?.topics?.reduce(
    (total, topic) => total + (topic.lessons?.reduce(
      (subtotal, lesson) => subtotal + (lesson.duration ?? 0), 
      0
    ) ?? 0), 
    0
  ) ?? 0;

  return {
    course,
    isLoading,
    error,
    expandedTopics,
    toggleTopic,
    formatDuration,
    getFirstLesson,
    firstLessonId,
    totalLessons,
    totalDuration
  };
};
