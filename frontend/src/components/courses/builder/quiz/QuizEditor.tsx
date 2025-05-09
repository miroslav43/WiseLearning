
import React from 'react';
import { Quiz } from '@/types/course';
import { QuizBasicDetails } from './QuizBasicDetails';
import { QuizQuestionList } from './QuizQuestionList';
import { EmptyQuizState } from './EmptyQuizState';
import { v4 as uuidv4 } from 'uuid';

interface QuizEditorProps {
  quiz: Quiz;
  onChange: (quiz: Partial<Quiz>) => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onChange }) => {
  // Ensure the quiz has an ID
  if (!quiz.id) {
    onChange({ id: uuidv4() });
  }

  // Handle adding a new question
  const handleAddQuestion = () => {
    onChange({ 
      questions: [
        ...quiz.questions,
        {
          id: uuidv4(),
          questionText: '',
          type: 'single',
          options: ['', '', '', ''],
          correctOptions: []
        }
      ] 
    });
  };

  return (
    <div className="space-y-6">
      <QuizBasicDetails quiz={quiz} onChange={onChange} />
      
      <div className="space-y-4">
        <QuizQuestionList 
          quiz={quiz} 
          onChange={onChange} 
        />
        
        {quiz.questions.length === 0 && (
          <EmptyQuizState onAddQuestion={handleAddQuestion} />
        )}
      </div>
    </div>
  );
};
