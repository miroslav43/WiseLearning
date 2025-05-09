
import React, { useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CourseFormData, ContentType } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';
import { ModuleHeader } from './ModuleHeader';
import { ModuleInfoForm } from './ModuleInfoForm';
import { ModuleContentActions } from './ModuleContentActions';
import { LessonsList } from './LessonsList';

interface ModuleCardProps {
  module: CourseFormData['topics'][0];
  moduleIndex: number;
  courseData: CourseFormData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  moduleIndex,
  courseData,
  setCourseData,
  isExpanded,
  onToggleExpand,
  dragHandleProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

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

  const handleAddContentItem = (type: ContentType) => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      const currentLessons = updatedTopics[moduleIndex].lessons || [];
      const lessonCount = currentLessons.length + 1;
      const lessonId = uuidv4();
      
      let newLesson: any = {
        id: lessonId,
        title: '',
        description: '',
        type: type,
        duration: 0,
        order: lessonCount,
        content: '',
      };

      // Set content type specific properties
      switch (type) {
        case 'lesson':
          newLesson.title = `Lecția ${lessonCount}`;
          newLesson.content = '';
          break;
        case 'quiz':
          newLesson.title = `Quiz ${lessonCount}`;
          newLesson.quiz = {
            id: uuidv4(),
            title: `Quiz ${lessonCount}`,
            description: '',
            questions: [],
            timeLimit: 15
          };
          break;
        case 'assignment':
          newLesson.title = `Tema ${lessonCount}`;
          newLesson.assignment = {
            id: uuidv4(),
            title: `Tema ${lessonCount}`,
            description: '',
            maxScore: 100,
            allowFileUpload: true,
            allowedFileTypes: ['.pdf', '.doc', '.docx']
          };
          break;
      }
      
      updatedTopics[moduleIndex].lessons = [
        ...currentLessons,
        newLesson
      ];
      
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleRemoveModule = () => {
    setCourseData(prev => {
      const updatedTopics = [...prev.topics];
      updatedTopics.splice(moduleIndex, 1);
      
      // Update order for remaining modules
      const reorderedTopics = updatedTopics.map((topic, idx) => ({
        ...topic,
        order: idx + 1
      }));
      
      return { ...prev, topics: reorderedTopics };
    });
  };

  const toggleCompactView = () => {
    setIsCompact(!isCompact);
  };

  const renderContent = () => {
    if (isCompact) {
      return (
        <div className="p-3 bg-gray-100 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {module.title || `Modul ${module.order}`} • {module.lessons.length} {module.lessons.length === 1 ? 'element' : 'elemente'}
          </p>
        </div>
      );
    }

    return (
      <CardContent className="p-4">
        {(isEditing || !module.title) && (
          <ModuleInfoForm 
            title={module.title}
            description={module.description}
            moduleIndex={moduleIndex}
            onTitleChange={(value) => handleModuleChange('title', value)}
            onDescriptionChange={(value) => handleModuleChange('description', value)}
          />
        )}

        {!isEditing && module.title && (
          <div className="mb-4">
            <h3 className="text-lg font-medium">{module.title}</h3>
            {module.description && (
              <p className="text-gray-600 mt-1">{module.description}</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <ModuleContentActions onAddContent={handleAddContentItem} />

          <LessonsList
            moduleId={module.id}
            moduleIndex={moduleIndex}
            lessons={module.lessons}
            courseData={courseData}
            setCourseData={setCourseData}
          />
        </div>
      </CardContent>
    );
  };

  return (
    <Card className="shadow-sm transition-all hover:shadow">
      <ModuleHeader 
        moduleTitle={module.title}
        moduleOrder={module.order}
        lessonsCount={module.lessons.length}
        isEditing={isEditing}
        isExpanded={isExpanded}
        isCompact={isCompact}
        onToggleExpand={onToggleExpand}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onRemoveModule={handleRemoveModule}
        onToggleCompact={toggleCompactView}
        dragHandleProps={dragHandleProps}
      />
      
      <Collapsible open={isExpanded}>
        {renderContent()}
      </Collapsible>
    </Card>
  );
};
