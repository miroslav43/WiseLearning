
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { CourseFormData, Lesson } from '@/types/course';
import { LessonCard } from './lesson-card/LessonCard';
import { v4 as uuidv4 } from 'uuid';

interface LessonsListProps {
  moduleId: string;
  moduleIndex: number;
  lessons: CourseFormData['topics'][0]['lessons'];
  courseData: CourseFormData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const LessonsList: React.FC<LessonsListProps> = ({
  moduleId,
  moduleIndex,
  lessons,
  courseData,
  setCourseData
}) => {
  // Process lessons to ensure all quiz and assignment objects have IDs
  const processedLessons = lessons.map(lesson => {
    let processedLesson = {...lesson};
    
    // Add ID to quiz if it exists but doesn't have an ID
    if (processedLesson.type === 'quiz' && processedLesson.quiz && !processedLesson.quiz.id) {
      processedLesson.quiz = {
        ...processedLesson.quiz,
        id: uuidv4(),
        title: processedLesson.quiz.title || "",
        description: processedLesson.quiz.description || "",
        questions: processedLesson.quiz.questions || [],
        timeLimit: processedLesson.quiz.timeLimit || 0
      };
    }
    
    // Add ID to assignment if it exists but doesn't have an ID
    if (processedLesson.type === 'assignment' && processedLesson.assignment && !processedLesson.assignment.id) {
      processedLesson.assignment = {
        ...processedLesson.assignment,
        id: uuidv4(),
        title: processedLesson.assignment.title || "",
        description: processedLesson.assignment.description || "",
        maxScore: processedLesson.assignment.maxScore || 0,
        allowFileUpload: processedLesson.assignment.allowFileUpload || false,
        allowedFileTypes: processedLesson.assignment.allowedFileTypes || [],
        unitTests: processedLesson.assignment.unitTests || []
      };
    }
    
    return processedLesson;
  });

  const handleRemoveLesson = (lessonIndex: number) => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      const updatedLessons = [...updatedTopics[moduleIndex].lessons];
      updatedLessons.splice(lessonIndex, 1);
      updatedTopics[moduleIndex].lessons = updatedLessons;
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleUpdateLesson = (lessonIndex: number, updatedLesson: Lesson) => {
    // Ensure updatedLesson has proper IDs for quiz and assignment
    let finalLesson = {...updatedLesson};
    
    if (finalLesson.type === 'quiz' && finalLesson.quiz && !finalLesson.quiz.id) {
      finalLesson.quiz = {
        ...finalLesson.quiz,
        id: uuidv4()
      };
    }
    
    if (finalLesson.type === 'assignment' && finalLesson.assignment && !finalLesson.assignment.id) {
      finalLesson.assignment = {
        ...finalLesson.assignment,
        id: uuidv4()
      };
    }
    
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[moduleIndex].lessons[lessonIndex] = finalLesson;
      return { ...prev, topics: updatedTopics };
    });
  };

  return (
    <Droppable droppableId={`module-${moduleId}`} type="LESSON">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-3"
        >
          {processedLessons.length === 0 ? (
            <div className="p-4 border border-dashed rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Nu există lecții în acest modul. Adaugă conținut pentru a începe.
              </p>
            </div>
          ) : (
            processedLessons.map((lesson, lessonIndex) => (
              <Draggable
                key={lesson.id}
                draggableId={lesson.id}
                index={lessonIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <LessonCard
                      lesson={lesson}
                      moduleIndex={moduleIndex}
                      lessonIndex={lessonIndex}
                      removeLesson={() => handleRemoveLesson(lessonIndex)}
                      updateLesson={(index, lesson) => handleUpdateLesson(index, lesson)}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
