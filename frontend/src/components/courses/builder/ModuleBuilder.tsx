import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { ContentBuilder } from './ContentBuilder';
import { CourseFormData } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';

interface ModuleBuilderProps {
  moduleIndex: number;
  courseData: CourseFormData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

const ModuleBuilder: React.FC<ModuleBuilderProps> = ({ moduleIndex, courseData, setCourseData }) => {
  const handleModuleChange = (field: string, value: string) => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics[moduleIndex] = {
        ...updatedTopics[moduleIndex],
        [field]: value
      };
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleAddLesson = () => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      const currentLessons = updatedTopics[moduleIndex].lessons || [];
      
      updatedTopics[moduleIndex].lessons = [
        ...currentLessons,
        {
          id: uuidv4(),
          title: `Lecția ${currentLessons.length + 1}`,
          description: '',
          type: 'lesson',
          duration: 0,
          order: currentLessons.length + 1
        }
      ];
      
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleRemoveModule = () => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics.splice(moduleIndex, 1);
      return { ...prev, topics: updatedTopics };
    });
  };

  return (
    <div className="border rounded-lg p-4 mb-6 bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="cursor-move">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Modul {moduleIndex + 1}</h3>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleRemoveModule}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Șterge modul
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`module-title-${moduleIndex}`}>Titlu modul</Label>
          <Input 
            id={`module-title-${moduleIndex}`}
            value={courseData.topics[moduleIndex].title} 
            onChange={(e) => handleModuleChange('title', e.target.value)}
            placeholder="Titlul modulului"
          />
        </div>

        <div>
          <Label htmlFor={`module-description-${moduleIndex}`}>Descriere modul</Label>
          <Textarea 
            id={`module-description-${moduleIndex}`}
            value={courseData.topics[moduleIndex].description} 
            onChange={(e) => handleModuleChange('description', e.target.value)}
            placeholder="Descrierea modulului"
            rows={3}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Conținut</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddLesson}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adaugă lecție
            </Button>
          </div>

          <div className="space-y-4">
            {courseData.topics[moduleIndex].lessons.map((lesson, lessonIndex) => (
              <ContentBuilder 
                key={lesson.id || lessonIndex}
                moduleIndex={moduleIndex}
                lessonIndex={lessonIndex}
                courseData={courseData}
                setCourseData={setCourseData}
              />
            ))}

            {courseData.topics[moduleIndex].lessons.length === 0 && (
              <div className="p-6 border border-dashed rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Nu există lecții în acest modul. Adaugă o lecție pentru a începe.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleBuilder;
