
import React from 'react';
import { Lesson } from '@/types/course';
import { 
  BookOpen, 
  Video, 
  ListCheck 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  // Helper to determine content type display
  const getContentDisplay = () => {
    switch (lesson.type) {
      case 'lesson':
        // Video display if available
        if (lesson.videoUrl) {
          return (
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-60" />
                <p>Conținutul video este disponibil după achiziționarea cursului</p>
              </div>
            </div>
          );
        } 
        // Text content
        return (
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              Conținut lecție
            </h3>
            
            <div className="prose max-w-none">
              {lesson.content || (
                <div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="mt-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="mt-4 text-muted-foreground italic">
                    Conținutul complet al lecției va fi disponibil după achiziționarea cursului.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <ListCheck className="h-5 w-5 text-primary" />
              Quiz: {lesson.quiz?.title || 'Test de verificare'}
            </h3>
            
            <div className="rounded-md border p-4 bg-gray-50">
              <p>{lesson.quiz?.description || 'Acest quiz te va ajuta să verifici cât de bine ai înțeles conceptele din această lecție.'}</p>
              
              <div className="mt-4 bg-white rounded-md border p-4">
                <p className="text-muted-foreground italic">
                  Quizul complet va fi disponibil după achiziționarea cursului.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'assignment':
        return (
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              Temă: {lesson.assignment?.title || 'Exerciții practice'}
            </h3>
            
            <div className="rounded-md border p-4 bg-gray-50">
              <p>{lesson.assignment?.description || 'Rezolvă aceste exerciții pentru a-ți consolida cunoștințele dobândite în această lecție.'}</p>
              
              <div className="mt-4 bg-white rounded-md border p-4">
                <p className="text-muted-foreground italic">
                  Tema completă va fi disponibilă după achiziționarea cursului.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-6">
            <p className="text-muted-foreground italic">
              Conținutul lecției va fi disponibil după achiziționarea cursului.
            </p>
          </div>
        );
    }
  };

  return (
    <ScrollArea className="max-h-[calc(100vh-220px)]">
      {getContentDisplay()}
      
      <div className="p-6 pt-0 mt-4">
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Durată estimată:</span>
            <span className="font-semibold">{lesson.duration} minute</span>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default LessonContent;
