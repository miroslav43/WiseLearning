
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '../rich-text-editor';
import { Lesson } from '@/types/course';

interface LessonEditorProps {
  lesson: Lesson;
  onUpdate: (field: string, value: any) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`lesson-title-${lesson.id}`}>Titlu lecție</Label>
        <Input
          id={`lesson-title-${lesson.id}`}
          value={lesson.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Titlul lecției"
          className="mb-2"
        />
      </div>
      
      <div>
        <Label htmlFor={`lesson-description-${lesson.id}`}>Descriere scurtă</Label>
        <Textarea
          id={`lesson-description-${lesson.id}`}
          value={lesson.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="O scurtă descriere a lecției"
          rows={2}
          className="mb-2"
        />
      </div>
      
      <div>
        <Label htmlFor={`lesson-duration-${lesson.id}`}>Durată (minute)</Label>
        <Input
          id={`lesson-duration-${lesson.id}`}
          type="number"
          min="1"
          value={lesson.duration || 0}
          onChange={(e) => onUpdate('duration', parseInt(e.target.value) || 0)}
          className="w-32 mb-4"
        />
      </div>

      <div className="mt-3">
        <Label htmlFor={`lesson-content-${lesson.id}`} className="mb-2 block">Conținut lecție</Label>
        <RichTextEditor 
          value={lesson.content || ''} 
          onChange={(value) => onUpdate('content', value)} 
        />
      </div>
    </div>
  );
};
