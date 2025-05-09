
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizEditor } from '../quiz/QuizEditor';
import { Assignment, Lesson, Quiz } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';
import { LessonEditor } from './LessonEditor';

interface LessonContentProps {
  lesson: Lesson;
  isEditing: boolean;
  handleUpdateLesson: (field: string, value: any) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  isEditing,
  handleUpdateLesson
}) => {
  if (!isEditing) {
    return (
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
          <p className="text-gray-600">{lesson.description}</p>
        </div>
        
        {lesson.type === 'lesson' && lesson.content && (
          <div className="prose max-w-none mb-4">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        )}
        
        {lesson.type === 'quiz' && lesson.quiz && (
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">{lesson.quiz.title}</h4>
            <p className="text-gray-600">{lesson.quiz.description}</p>
            <p className="text-sm text-gray-500">
              {lesson.quiz.questions.length} întrebări • 
              {lesson.quiz.timeLimit ? ` ${lesson.quiz.timeLimit} minute` : ' Fără limită de timp'}
            </p>
          </div>
        )}
        
        {lesson.type === 'assignment' && lesson.assignment && (
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">{lesson.assignment.title}</h4>
            <p className="text-gray-600">{lesson.assignment.description}</p>
            <p className="text-sm text-gray-500">
              Punctaj maxim: {lesson.assignment.maxScore} puncte •
              {lesson.assignment.dueDate ? ` Termen: ${new Date(lesson.assignment.dueDate).toLocaleDateString()}` : ' Fără termen limită'}
            </p>
          </div>
        )}
      </CardContent>
    );
  }

  return (
    <CardContent className="p-4">
      {lesson.type === 'lesson' && (
        <LessonEditor 
          lesson={lesson}
          onUpdate={handleUpdateLesson}
        />
      )}

      {lesson.type === 'quiz' && (
        <div className="mt-2">
          <Tabs defaultValue="quiz-content">
            <TabsList className="mb-4">
              <TabsTrigger value="quiz-content">Conținut Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="quiz-content">
              <QuizEditor 
                quiz={lesson.quiz || {
                  id: uuidv4(),
                  title: "",
                  description: "",
                  questions: [],
                  timeLimit: 0
                }}
                onChange={(quizData) => handleUpdateLesson('quiz', {
                  id: lesson.quiz?.id || uuidv4(),
                  ...quizData
                })}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {lesson.type === 'assignment' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor={`assignment-title-${lesson.id}`}>
              Titlu temă
            </label>
            <input
              id={`assignment-title-${lesson.id}`}
              className="w-full p-2 border rounded"
              value={lesson.assignment?.title || ''}
              onChange={(e) => {
                const updatedAssignment = {
                  id: lesson.assignment?.id || uuidv4(),
                  ...(lesson.assignment || {
                    title: "",
                    description: "",
                    maxScore: 100,
                    allowFileUpload: true,
                    allowedFileTypes: ['.pdf', '.doc', '.docx']
                  }),
                  title: e.target.value
                };
                handleUpdateLesson('assignment', updatedAssignment);
              }}
              placeholder="Titlul temei"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor={`assignment-description-${lesson.id}`}>
              Descriere temă
            </label>
            <textarea
              id={`assignment-description-${lesson.id}`}
              className="w-full p-2 border rounded"
              rows={4}
              value={lesson.assignment?.description || ''}
              onChange={(e) => {
                const updatedAssignment = {
                  id: lesson.assignment?.id || uuidv4(),
                  ...(lesson.assignment || {
                    title: "",
                    description: "",
                    maxScore: 100,
                    allowFileUpload: true,
                    allowedFileTypes: ['.pdf', '.doc', '.docx']
                  }),
                  description: e.target.value
                };
                handleUpdateLesson('assignment', updatedAssignment);
              }}
              placeholder="Descrierea temei"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor={`assignment-score-${lesson.id}`}>
              Punctaj maxim
            </label>
            <input
              id={`assignment-score-${lesson.id}`}
              className="w-32 p-2 border rounded"
              type="number"
              min="1"
              value={lesson.assignment?.maxScore || 100}
              onChange={(e) => {
                const updatedAssignment = {
                  id: lesson.assignment?.id || uuidv4(),
                  ...(lesson.assignment || {
                    title: "",
                    description: "",
                    maxScore: 100,
                    allowFileUpload: true,
                    allowedFileTypes: ['.pdf', '.doc', '.docx']
                  }),
                  maxScore: parseInt(e.target.value) || 100
                };
                handleUpdateLesson('assignment', updatedAssignment);
              }}
            />
          </div>
        </div>
      )}
    </CardContent>
  );
};
