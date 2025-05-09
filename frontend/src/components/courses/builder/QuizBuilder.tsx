
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  CheckCircle, 
  Plus,
  SortDesc
} from 'lucide-react';
import { CourseFormData, QuestionType } from '@/types/course';

interface QuizBuilderProps {
  quiz: NonNullable<CourseFormData['topics'][0]['lessons'][0]['quiz']>;
  onUpdate: (data: Partial<NonNullable<CourseFormData['topics'][0]['lessons'][0]['quiz']>>) => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ quiz, onUpdate }) => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const addQuestion = (type: QuestionType = 'single') => {
    const newQuestion = {
      id: uuidv4(),
      questionText: '',
      type: type,
      options: type === 'true-false' ? ['Adevărat', 'Fals'] : ['', '', '', ''],
      correctOptions: [],
      order: type === 'order' ? 1 : undefined
    };

    const updatedQuestions = [...quiz.questions, newQuestion];
    onUpdate({ questions: updatedQuestions });
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, questionData: Partial<CourseFormData['topics'][0]['lessons'][0]['quiz']['questions'][0]>) => {
    onUpdate({
      questions: quiz.questions.map(question => 
        question.id === questionId ? { ...question, ...questionData } : question
      )
    });
  };

  const removeQuestion = (questionId: string) => {
    onUpdate({
      questions: quiz.questions.filter(question => question.id !== questionId)
    });
    
    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = value;

    updateQuestion(questionId, { options: newOptions });
  };

  const updateCorrectOption = (questionId: string, optionIndex: number, isMultiple: boolean = false) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    let correctOptions: number[];
    
    if (isMultiple) {
      // For multiple choice questions
      correctOptions = [...question.correctOptions];
      const existingIndex = correctOptions.indexOf(optionIndex);
      
      if (existingIndex > -1) {
        // Remove if already selected
        correctOptions.splice(existingIndex, 1);
      } else {
        // Add if not selected
        correctOptions.push(optionIndex);
      }
    } else {
      // For single choice questions
      correctOptions = [optionIndex];
    }
    
    updateQuestion(questionId, { correctOptions });
  };

  const moveOptionUp = (questionId: string, optionIndex: number) => {
    if (optionIndex === 0) return;
    
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOptions = [...question.options];
    [newOptions[optionIndex - 1], newOptions[optionIndex]] = [newOptions[optionIndex], newOptions[optionIndex - 1]];
    
    // Update correct options if necessary
    const newCorrectOptions = [...question.correctOptions].map(index => {
      if (index === optionIndex) return index - 1;
      if (index === optionIndex - 1) return index + 1;
      return index;
    });
    
    updateQuestion(questionId, { 
      options: newOptions,
      correctOptions: newCorrectOptions
    });
  };

  const moveOptionDown = (questionId: string, optionIndex: number) => {
    const question = quiz.questions.find(q => q.id === questionId);
    if (!question || optionIndex === question.options.length - 1) return;
    
    const newOptions = [...question.options];
    [newOptions[optionIndex], newOptions[optionIndex + 1]] = [newOptions[optionIndex + 1], newOptions[optionIndex]];
    
    // Update correct options if necessary
    const newCorrectOptions = [...question.correctOptions].map(index => {
      if (index === optionIndex) return index + 1;
      if (index === optionIndex + 1) return index - 1;
      return index;
    });
    
    updateQuestion(questionId, { 
      options: newOptions,
      correctOptions: newCorrectOptions
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Titlu quiz</label>
        <Input
          value={quiz.title}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Titlul quizului"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descriere quiz</label>
        <Textarea
          value={quiz.description}
          onChange={e => onUpdate({ description: e.target.value })}
          placeholder="Instrucțiuni pentru elevi"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Timp limită (minute)</label>
        <Input
          type="number"
          value={quiz.timeLimit || 15}
          onChange={e => onUpdate({ timeLimit: parseInt(e.target.value) || 15 })}
          placeholder="15"
          min="1"
          className="w-24"
        />
      </div>

      <div className="mt-6 mb-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Întrebări ({quiz.questions.length})</h3>
          <div className="flex gap-2">
            <Select onValueChange={(value) => addQuestion(value as QuestionType)} defaultValue="selectType">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Adaugă întrebare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selectType" disabled>Alege tipul întrebării</SelectItem>
                <SelectItem value="single">Cu un singur răspuns</SelectItem>
                <SelectItem value="multiple">Cu răspunsuri multiple</SelectItem>
                <SelectItem value="true-false">Adevărat / Fals</SelectItem>
                <SelectItem value="order">Ordonare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {quiz.questions.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Nicio întrebare adăugată</p>
            <p className="text-sm text-gray-400">Adaugă întrebări folosind meniul de mai sus</p>
          </div>
        ) : (
          <Accordion 
            type="single" 
            collapsible 
            value={activeQuestion || undefined}
            onValueChange={(value) => setActiveQuestion(value)}
            className="space-y-3"
          >
            {quiz.questions.map((question, questionIndex) => (
              <AccordionItem 
                key={question.id} 
                value={question.id}
                className="border rounded-md overflow-hidden bg-white"
              >
                <div className="flex justify-between items-center border-b">
                  <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 flex-1 font-medium">
                    <span className="mr-2">Întrebarea {questionIndex + 1}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-2">
                      {question.type === 'single' && 'Răspuns unic'}
                      {question.type === 'multiple' && 'Răspunsuri multiple'}
                      {question.type === 'true-false' && 'Adevărat/Fals'}
                      {question.type === 'order' && 'Ordonare'}
                    </span>
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(question.id);
                    }}
                    className="m-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Întrebare</label>
                      <Textarea
                        value={question.questionText}
                        onChange={e => updateQuestion(question.id, { questionText: e.target.value })}
                        placeholder="Scrie întrebarea aici..."
                      />
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          {question.type === 'order' ? 'Elemente de ordonat' : 'Opțiuni'}
                        </label>
                        {question.type === 'order' && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <SortDesc className="h-4 w-4 mr-1" />
                            Ordinea corectă este de sus în jos
                          </div>
                        )}
                      </div>
                      
                      {question.type === 'single' && (
                        <RadioGroup 
                          value={question.correctOptions[0]?.toString() || ''} 
                          onValueChange={(value) => updateCorrectOption(question.id, parseInt(value))}
                          className="space-y-2"
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <div className="flex items-center h-10 space-x-2">
                                <RadioGroupItem
                                  value={optionIndex.toString()}
                                  id={`option-${question.id}-${optionIndex}`}
                                />
                              </div>
                              <Input
                                value={option}
                                onChange={e => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Opțiunea ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionUp(question.id, optionIndex)}
                                  disabled={optionIndex === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionDown(question.id, optionIndex)}
                                  disabled={optionIndex === question.options.length - 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.type === 'multiple' && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <div className="flex items-center h-10 space-x-2">
                                <Checkbox
                                  checked={question.correctOptions.includes(optionIndex)}
                                  onCheckedChange={() => updateCorrectOption(question.id, optionIndex, true)}
                                  id={`option-${question.id}-${optionIndex}`}
                                />
                              </div>
                              <Input
                                value={option}
                                onChange={e => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Opțiunea ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionUp(question.id, optionIndex)}
                                  disabled={optionIndex === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionDown(question.id, optionIndex)}
                                  disabled={optionIndex === question.options.length - 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <RadioGroup 
                          value={question.correctOptions[0]?.toString() || ''} 
                          onValueChange={(value) => updateCorrectOption(question.id, parseInt(value))}
                          className="space-y-2"
                        >
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <div className="flex items-center h-10 space-x-2">
                                <RadioGroupItem
                                  value={optionIndex.toString()}
                                  id={`option-${question.id}-${optionIndex}`}
                                />
                                <label htmlFor={`option-${question.id}-${optionIndex}`}>
                                  {option}
                                </label>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.type === 'order' && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 border p-2 rounded-md bg-gray-50">
                              <div className="text-gray-400 font-medium flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                {optionIndex + 1}
                              </div>
                              <Input
                                value={option}
                                onChange={e => updateOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Element ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionUp(question.id, optionIndex)}
                                  disabled={optionIndex === 0}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveOptionDown(question.id, optionIndex)}
                                  disabled={optionIndex === question.options.length - 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type !== 'true-false' && question.options.length < 6 && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const newOptions = [...question.options, ''];
                            updateQuestion(question.id, { options: newOptions });
                          }}
                          className="mt-2"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adaugă opțiune
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
