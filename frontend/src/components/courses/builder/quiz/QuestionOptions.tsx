
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Question, Quiz } from '@/types/course';

interface QuestionOptionsProps {
  question: Question;
  questionIndex: number;
  quiz: Quiz;
  onChange: (quiz: Partial<Quiz>) => void;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({ 
  question, 
  questionIndex, 
  quiz, 
  onChange 
}) => {
  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedQuestions = [...(quiz.questions || [])];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    onChange({ questions: updatedQuestions });
  };

  const handleAddOption = () => {
    const updatedQuestions = [...(quiz.questions || [])];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: [...updatedQuestions[questionIndex].options, '']
    };
    
    onChange({ questions: updatedQuestions });
  };

  const handleRemoveOption = (optionIndex: number) => {
    const updatedQuestions = [...(quiz.questions || [])];
    const options = [...updatedQuestions[questionIndex].options];
    options.splice(optionIndex, 1);
    
    // Also remove from correctOptions if needed
    let correctOptions = [...updatedQuestions[questionIndex].correctOptions];
    correctOptions = correctOptions.filter(idx => idx !== optionIndex)
      .map(idx => idx > optionIndex ? idx - 1 : idx);
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
      correctOptions
    };
    
    onChange({ questions: updatedQuestions });
  };

  const handleCorrectOptionChange = (optionIndex: number, isChecked: boolean) => {
    const updatedQuestions = [...(quiz.questions || [])];
    let correctOptions = [...updatedQuestions[questionIndex].correctOptions];
    
    const questionType = updatedQuestions[questionIndex].type;
    
    if (questionType === 'single' || questionType === 'true-false') {
      // For single choice, only one can be correct
      correctOptions = isChecked ? [optionIndex] : [];
    } else {
      // For multiple choice
      if (isChecked) {
        correctOptions.push(optionIndex);
      } else {
        correctOptions = correctOptions.filter(idx => idx !== optionIndex);
      }
    }
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctOptions
    };
    
    onChange({ questions: updatedQuestions });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">
        Opțiuni {question.type === 'order' && '(Trage pentru a ordona)'}
      </label>
      
      <Droppable droppableId={`question-${question.id}`} type="OPTIONS">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {question.type === 'true-false' ? (
              <div className="space-y-1">
                <RadioGroup
                  value={question.correctOptions.includes(0) ? '0' : question.correctOptions.includes(1) ? '1' : ''}
                  onValueChange={(value) => {
                    const optionIndex = parseInt(value);
                    handleCorrectOptionChange(optionIndex, true);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id={`q-${questionIndex}-opt-0`} />
                    <Label htmlFor={`q-${questionIndex}-opt-0`}>Adevărat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={`q-${questionIndex}-opt-1`} />
                    <Label htmlFor={`q-${questionIndex}-opt-1`}>Fals</Label>
                  </div>
                </RadioGroup>
              </div>
            ) : (
              question.options.map((option, optionIndex) => (
                <Draggable
                  key={`option-${question.id}-${optionIndex}`}
                  draggableId={`option-${question.id}-${optionIndex}`}
                  index={optionIndex}
                  isDragDisabled={question.type !== 'order'}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-start gap-2"
                    >
                      {question.type === 'order' && (
                        <div {...provided.dragHandleProps} className="cursor-move p-1 mt-1 hover:bg-gray-200 rounded flex-shrink-0">
                          <GripVertical className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                      
                      {question.type === 'single' ? (
                        <RadioGroup
                          value={question.correctOptions.includes(optionIndex) ? optionIndex.toString() : ''}
                          onValueChange={() => {
                            handleCorrectOptionChange(optionIndex, true);
                          }}
                          className="flex items-start gap-2 w-full"
                        >
                          <RadioGroupItem 
                            value={optionIndex.toString()} 
                            id={`q-${questionIndex}-opt-${optionIndex}`}
                            className="mt-2"
                          />
                          <div className="flex-1">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                              placeholder={`Opțiunea ${optionIndex + 1}`}
                              className="border-gray-300"
                            />
                          </div>
                        </RadioGroup>
                      ) : question.type === 'multiple' ? (
                        <div className="flex items-start gap-2 w-full">
                          <Checkbox 
                            id={`q-${questionIndex}-opt-${optionIndex}`}
                            checked={question.correctOptions.includes(optionIndex)}
                            onCheckedChange={(checked) => {
                              handleCorrectOptionChange(optionIndex, checked === true);
                            }}
                            className="mt-2"
                          />
                          <div className="flex-1">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                              placeholder={`Opțiunea ${optionIndex + 1}`}
                              className="border-gray-300"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                            placeholder={`Opțiunea ${optionIndex + 1}`}
                            className="border-gray-300"
                          />
                        </div>
                      )}
                      
                      {question.type !== 'true-false' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveOption(optionIndex)}
                          disabled={question.options.length <= 2}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {question.type !== 'true-false' && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddOption}
          className="mt-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Adaugă opțiune
        </Button>
      )}
    </div>
  );
};
