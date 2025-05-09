
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LessonCard } from './lesson-card/LessonCard';
import { CourseFormData, Lesson } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';

interface ContentBuilderProps {
  moduleIndex: number;
  lessonIndex: number;
  courseData: CourseFormData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const ContentBuilder: React.FC<ContentBuilderProps> = ({
  moduleIndex,
  lessonIndex,
  courseData,
  setCourseData
}) => {
  const lesson = courseData.topics[moduleIndex].lessons[lessonIndex];

  const handleRemoveLesson = () => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      const updatedLessons = [...updatedTopics[moduleIndex].lessons];
      updatedLessons.splice(lessonIndex, 1);
      updatedTopics[moduleIndex].lessons = updatedLessons;
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleUpdateLesson = (lessonIndex: number, updatedLesson: Lesson) => {
    // Create a final version of the lesson with proper IDs
    let finalLesson = {...updatedLesson};
    
    // Ensure quiz has an id if it exists
    if (finalLesson.type === 'quiz' && finalLesson.quiz) {
      if (!finalLesson.quiz.id) {
        finalLesson.quiz = {
          ...finalLesson.quiz,
          id: uuidv4()
        };
      }
    }
    
    // Ensure assignment has an id if it exists
    if (finalLesson.type === 'assignment' && finalLesson.assignment) {
      if (!finalLesson.assignment.id) {
        finalLesson.assignment = {
          ...finalLesson.assignment,
          id: uuidv4()
        };
      }
    }
    
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[moduleIndex].lessons[lessonIndex] = finalLesson;
      return { ...prev, topics: updatedTopics };
    });
  };

  return (
    <div>
      <LessonCard
        lesson={lesson}
        moduleIndex={moduleIndex}
        lessonIndex={lessonIndex}
        removeLesson={handleRemoveLesson}
        updateLesson={handleUpdateLesson}
      />
    </div>
  );
};
