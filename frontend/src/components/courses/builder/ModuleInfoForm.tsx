
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ModuleInfoFormProps {
  title: string;
  description: string;
  moduleIndex: number;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const ModuleInfoForm: React.FC<ModuleInfoFormProps> = ({
  title,
  description,
  moduleIndex,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4 mb-4">
      <div>
        <label htmlFor={`module-title-${moduleIndex}`} className="block text-sm font-medium mb-1">
          Titlu modul
        </label>
        <Input 
          id={`module-title-${moduleIndex}`}
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Titlul modulului"
          className="border-gray-300"
        />
      </div>

      <div>
        <label htmlFor={`module-description-${moduleIndex}`} className="block text-sm font-medium mb-1">
          Descriere modul
        </label>
        <Textarea 
          id={`module-description-${moduleIndex}`}
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descrierea modulului"
          rows={3}
          className="border-gray-300"
        />
      </div>
    </div>
  );
};
