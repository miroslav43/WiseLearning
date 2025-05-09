
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Quiz, Question, QuestionType } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { QuestionItem } from './QuestionItem';

interface QuizQuestionListProps {
  quiz: Quiz;
  onChange: (quiz: Partial<Quiz>) => void;
}

export const QuizQuestionList: React.FC<QuizQuestionListProps> = ({ quiz, onChange }) => {
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      questionText: '',
      type: 'single',
      options: ['', ''],
      correctOptions: [],
      order: (quiz.questions?.length || 0) + 1
    };

    onChange({
      questions: [...(quiz.questions || []), newQuestion]
    });
  };

  const handleRemoveQuestion = (questionIndex: number) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions.splice(questionIndex, 1);
    
    // Update question order
    const reorderedQuestions = updatedQuestions.map((q, idx) => ({
      ...q,
      order: idx + 1
    }));
    
    onChange({ questions: reorderedQuestions });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    if (type === 'QUESTIONS') {
      const reorderedQuestions = Array.from(quiz.questions || []);
      const [movedQuestion] = reorderedQuestions.splice(source.index, 1);
      reorderedQuestions.splice(destination.index, 0, movedQuestion);
      
      // Update order property
      const updatedQuestions = reorderedQuestions.map((q, idx) => ({
        ...q,
        order: idx + 1
      }));
      
      onChange({ questions: updatedQuestions });
    } else if (type === 'OPTIONS') {
      const questionId = source.droppableId.split('-')[1];
      const questionIndex = quiz.questions?.findIndex(q => q.id === questionId) || 0;
      
      if (questionIndex >= 0) {
        const reorderedOptions = Array.from(quiz.questions[questionIndex].options);
        const [movedOption] = reorderedOptions.splice(source.index, 1);
        reorderedOptions.splice(destination.index, 0, movedOption);
        
        // For order type questions, we need to update correctOptions to match new order
        let updatedCorrectOptions = [...quiz.questions[questionIndex].correctOptions];
        if (quiz.questions[questionIndex].type === 'order') {
          updatedCorrectOptions = reorderedOptions.map((_, i) => i);
        } else {
          // For other question types, we need to adjust the correctOptions indices
          updatedCorrectOptions = updatedCorrectOptions.map(correctIdx => {
            if (correctIdx === source.index) return destination.index;
            if (
              source.index < destination.index && 
              correctIdx > source.index && 
              correctIdx <= destination.index
            ) {
              return correctIdx - 1;
            }
            if (
              source.index > destination.index && 
              correctIdx < source.index && 
              correctIdx >= destination.index
            ) {
              return correctIdx + 1;
            }
            return correctIdx;
          });
        }
        
        const updatedQuestions = [...(quiz.questions || [])];
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          options: reorderedOptions,
          correctOptions: updatedCorrectOptions
        };
        
        onChange({ questions: updatedQuestions });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Întrebări</h3>
        <Button onClick={handleAddQuestion} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-1" />
          Adaugă întrebare
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions" type="QUESTIONS">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {quiz.questions && quiz.questions.length > 0 ? (
                quiz.questions.map((question, questionIndex) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    questionIndex={questionIndex}
                    quiz={quiz}
                    onChange={onChange}
                    onRemove={() => handleRemoveQuestion(questionIndex)}
                  />
                ))
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
