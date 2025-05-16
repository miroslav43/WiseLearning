import { fetchCourse } from '@/services/courseService';
import { Course, Lesson } from '@/types/course';
import { useEffect, useState } from 'react';

export const useCourse = (courseId: string | undefined) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!courseId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const foundCourse = await fetchCourse(courseId);
        
        if (foundCourse) {
          setCourse(foundCourse);
          // Initialize all topics as expanded
          const topicsState = foundCourse.topics.reduce((acc, topic) => {
            acc[topic.id] = true;
            return acc;
          }, {} as {[key: string]: boolean});
          setExpandedTopics(topicsState);
          
          // Find the first lesson ID for the course
          if (foundCourse.topics.length > 0 && foundCourse.topics[0].lessons.length > 0) {
            setFirstLessonId(foundCourse.topics[0].lessons[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Nu am putut încărca detaliile cursului.');
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} minute`;
  };

  const getFirstLesson = (): Lesson | null => {
    if (!course || course.topics.length === 0) return null;
    
    for (const topic of course.topics) {
      if (topic.lessons.length > 0) {
        return topic.lessons[0];
      }
    }
    
    return null;
  };

  const totalLessons = course?.topics.reduce(
    (total, topic) => total + topic.lessons.length, 
    0
  ) || 0;

  const totalDuration = course?.topics.reduce(
    (total, topic) => total + topic.lessons.reduce(
      (subtotal, lesson) => subtotal + lesson.duration, 
      0
    ), 
    0
  ) || 0;

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
