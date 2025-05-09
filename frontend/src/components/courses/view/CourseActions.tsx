
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Heart, Download, Bookmark } from 'lucide-react';
import { Course } from '@/types/course';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedCourses } from '@/contexts/SavedCoursesContext';

interface CourseActionsProps {
  course: Course;
}

const CourseActions: React.FC<CourseActionsProps> = ({ course }) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { savedCourses, toggleSavedCourse, likedCourses, toggleLikedCourse } = useSavedCourses();
  
  const isSaved = savedCourses.some(id => id === course.id);
  const isLiked = likedCourses.some(id => id === course.id);

  const handleSaveCourse = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a salva cursuri.",
        variant: "destructive",
      });
      return;
    }
    
    toggleSavedCourse(course.id);
    toast({
      title: isSaved ? "Curs eliminat" : "Curs salvat",
      description: isSaved 
        ? `Ai eliminat cursul "${course.title}" din lista de favorite.` 
        : `Ai salvat cursul "${course.title}" în lista de favorite.`,
    });
  };

  const handleLikeCourse = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a aprecia cursuri.",
        variant: "destructive",
      });
      return;
    }
    
    toggleLikedCourse(course.id);
    toast({
      title: isLiked ? "Apreciere retrasă" : "Curs apreciat",
      description: isLiked 
        ? `Nu mai apreciezi cursul "${course.title}".` 
        : `Apreciezi cursul "${course.title}".`,
    });
  };

  const handleShareCourse = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiat",
      description: `Link-ul către cursul "${course.title}" a fost copiat în clipboard.`,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center w-full">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleSaveCourse}
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-brand-600 text-brand-600' : ''}`} />
        <span>{isSaved ? 'Salvat' : 'Salvează'}</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleLikeCourse}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-brand-600 text-brand-600' : ''}`} />
        <span>{isLiked ? 'Apreciat' : 'Apreciază'}</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleShareCourse}
      >
        <Share className="h-4 w-4" />
        <span>Distribuie</span>
      </Button>
    </div>
  );
};

export default CourseActions;
