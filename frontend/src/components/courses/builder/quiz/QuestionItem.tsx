import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Draggable } from 'react-beautiful-dnd';
import { GripVertical, Trash2 } from 'lucide-react';
import { Question, Quiz, QuestionType } from '@/types/course';
import { QuestionOptions } from './QuestionOptions';

interface QuestionItemProps {
  question: Question;
  questionIndex: number;
  quiz: Quiz;
  onChange: (quiz: Partial<Quiz>) => void;
  onRemove: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ 
  question, 
  questionIndex, 
  quiz, 
  onChange, 
  onRemove 
}) => {
  const handleQuestionChange = (field: keyof Question, value: any) => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    
    // Special handling for question type change
    if (field === 'type') {
      const questionType = value as QuestionType;
      const currentOptions = updatedQuestions[questionIndex].options;
      const currentCorrectOptions = updatedQuestions[questionIndex].correctOptions;
      
      // Reset correctOptions based on the question type
      switch (questionType) {
        case 'single':
          updatedQuestions[questionIndex].correctOptions = currentCorrectOptions.length > 0 
            ? [currentCorrectOptions[0]] 
            : [];
          break;
        case 'true-false':
          updatedQuestions[questionIndex].options = ['Adevărat', 'Fals'];
          updatedQuestions[questionIndex].correctOptions = currentCorrectOptions.length > 0 
            ? [currentCorrectOptions[0]] 
            : [];
          break;
        case 'multiple':
          // Keep current correctOptions
          break;
        case 'order':
          // For order type, each option is correct in its own position
          updatedQuestions[questionIndex].correctOptions = currentOptions.map((_, i) => i);
          break;
      }
    }
    
    onChange({ questions: updatedQuestions });
  };

  return (
    <Draggable
      key={question.id}
      draggableId={question.id}
      index={questionIndex}
    >
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div {...provided.dragHandleProps} className="cursor-move p-1 hover:bg-gray-200 rounded">
                <GripVertical className="h-4 w-4 text-gray-500" />
              </div>
              <span className="font-medium">Întrebarea {questionIndex + 1}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Text întrebare</label>
              <Textarea 
                value={question.questionText}
                onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                placeholder="Textul întrebării"
                rows={2}
                className="border-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tip întrebare</label>
              <Select
                value={question.type}
                onValueChange={(value) => handleQuestionChange('type', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selectează tipul întrebării" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Răspuns unic</SelectItem>
                  <SelectItem value="multiple">Răspunsuri multiple</SelectItem>
                  <SelectItem value="true-false">Adevărat / Fals</SelectItem>
                  <SelectItem value="order">Ordonare</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <QuestionOptions 
              question={question}
              questionIndex={questionIndex}
              quiz={quiz}
              onChange={onChange}
            />
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
