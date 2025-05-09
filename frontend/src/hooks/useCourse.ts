
import { useState, useEffect } from 'react';
import { Course, Lesson } from '@/types/course';
import { mockCourses } from '@/data/mockData';

export const useCourse = (courseId: string | undefined) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [firstLessonId, setFirstLessonId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      // In a real application, this would be an API call
      const foundCourse = mockCourses.find(c => c.id === courseId);
      
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
      
      setIsLoading(false);
    };

    fetchCourse();
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
    expandedTopics,
    toggleTopic,
    formatDuration,
    getFirstLesson,
    firstLessonId,
    totalLessons,
    totalDuration
  };
};
