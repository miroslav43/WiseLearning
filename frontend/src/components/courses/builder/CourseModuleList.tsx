
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { CourseFormData } from '@/types/course';
import { ModuleCard } from './ModuleCard';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CourseModuleListProps {
  courseData: CourseFormData;
  setCourseData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}

export const CourseModuleList: React.FC<CourseModuleListProps> = ({ 
  courseData, 
  setCourseData 
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const handleAddModule = () => {
    setCourseData(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          id: uuidv4(),
          title: `Modul ${prev.topics.length + 1}`,
          description: '',
          lessons: [],
          order: prev.topics.length + 1
        }
      ]
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If user drops outside of a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle modules reordering
    if (type === 'MODULE') {
      const reorderedModules = Array.from(courseData.topics);
      const [movedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, movedModule);

      // Update order property for all modules
      const updatedModules = reorderedModules.map((module, index) => ({
        ...module,
        order: index + 1
      }));

      setCourseData(prev => ({
        ...prev,
        topics: updatedModules
      }));
      return;
    }

    // Handle lessons reordering within a module
    if (type === 'LESSON') {
      const moduleId = source.droppableId.split('-')[1];
      
      // If moving within the same module
      if (source.droppableId === destination.droppableId) {
        const moduleIndex = courseData.topics.findIndex(t => t.id === moduleId);
        if (moduleIndex === -1) return;
        
        const moduleTopics = Array.from(courseData.topics);
        const moduleLessons = Array.from(moduleTopics[moduleIndex].lessons);
        
        const [movedLesson] = moduleLessons.splice(source.index, 1);
        moduleLessons.splice(destination.index, 0, movedLesson);
        
        // Update order property
        const updatedLessons = moduleLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));
        
        moduleTopics[moduleIndex] = {
          ...moduleTopics[moduleIndex],
          lessons: updatedLessons
        };
        
        setCourseData(prev => ({
          ...prev,
          topics: moduleTopics
        }));
      } 
      // Moving between different modules
      else {
        const sourceModuleId = source.droppableId.split('-')[1];
        const destModuleId = destination.droppableId.split('-')[1];
        
        const sourceModuleIndex = courseData.topics.findIndex(t => t.id === sourceModuleId);
        const destModuleIndex = courseData.topics.findIndex(t => t.id === destModuleId);
        
        if (sourceModuleIndex === -1 || destModuleIndex === -1) return;
        
        const newTopics = Array.from(courseData.topics);
        const sourceLessons = Array.from(newTopics[sourceModuleIndex].lessons);
        const destLessons = Array.from(newTopics[destModuleIndex].lessons);
        
        // Move the lesson
        const [movedLesson] = sourceLessons.splice(source.index, 1);
        destLessons.splice(destination.index, 0, movedLesson);
        
        // Update orders for both modules' lessons
        const updatedSourceLessons = sourceLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));
        
        const updatedDestLessons = destLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));
        
        newTopics[sourceModuleIndex] = {
          ...newTopics[sourceModuleIndex],
          lessons: updatedSourceLessons
        };
        
        newTopics[destModuleIndex] = {
          ...newTopics[destModuleIndex],
          lessons: updatedDestLessons
        };
        
        setCourseData(prev => ({
          ...prev,
          topics: newTopics
        }));
      }
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModuleId(prev => prev === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Module și lecții</h2>
        <Button onClick={handleAddModule} className="bg-brand-600 hover:bg-brand-700 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adaugă modul
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" type="MODULE">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {courseData.topics.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Nu există module</h3>
                  <p className="text-muted-foreground mb-4">Adaugă un modul pentru a începe crearea cursului tău</p>
                  <Button onClick={handleAddModule}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adaugă primul modul
                  </Button>
                </div>
              ) : (
                courseData.topics.map((module, index) => (
                  <Draggable 
                    key={module.id} 
                    draggableId={module.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="rounded-lg"
                      >
                        <ModuleCard
                          module={module}
                          moduleIndex={index}
                          courseData={courseData}
                          setCourseData={setCourseData}
                          isExpanded={expandedModuleId === module.id}
                          onToggleExpand={() => toggleModuleExpansion(module.id)}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
