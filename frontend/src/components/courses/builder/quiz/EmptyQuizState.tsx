
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyQuizStateProps {
  onAddQuestion: () => void;
}

export const EmptyQuizState: React.FC<EmptyQuizStateProps> = ({ onAddQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-md">
      <h3 className="text-lg font-medium mb-2">No questions yet</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        Start adding questions to create your quiz
      </p>
      <Button onClick={onAddQuestion} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add First Question
      </Button>
    </div>
  );
};
