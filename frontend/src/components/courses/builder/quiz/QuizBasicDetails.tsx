
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Quiz } from '@/types/course';

interface QuizBasicDetailsProps {
  quiz: Quiz;
  onChange: (quiz: Partial<Quiz>) => void;
}

export const QuizBasicDetails: React.FC<QuizBasicDetailsProps> = ({ quiz, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Titlu quiz</label>
        <Input 
          value={quiz.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Titlul quizului"
          className="border-gray-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Timp limită (minute)</label>
        <Input 
          type="number"
          value={quiz.timeLimit || 0}
          onChange={(e) => onChange({ timeLimit: parseInt(e.target.value) || 0 })}
          placeholder="15"
          className="border-gray-300"
          min="0"
        />
        <p className="text-xs text-gray-500 mt-1">0 = fără limită de timp</p>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Descriere quiz</label>
        <Textarea 
          value={quiz.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Descrierea quizului"
          rows={2}
          className="border-gray-300"
        />
      </div>
    </div>
  );
};
