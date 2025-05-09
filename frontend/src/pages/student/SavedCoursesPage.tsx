
import React, { useEffect, useState } from 'react';
import { useSavedCourses } from '@/contexts/SavedCoursesContext';
import { useAuth } from '@/contexts/AuthContext';
import CourseCard from '@/components/courses/CourseCard';
import { Course } from '@/types/course';
import { mockCourses } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SavedCoursesPage: React.FC = () => {
  const { savedCourses, likedCourses } = useSavedCourses();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [savedCoursesList, setSavedCoursesList] = useState<Course[]>([]);
  const [likedCoursesList, setLikedCoursesList] = useState<Course[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // In a real app, this would be an API call
    const fetchSavedCourses = () => {
      const saved = mockCourses.filter(course => savedCourses.includes(course.id));
      const liked = mockCourses.filter(course => likedCourses.includes(course.id));
      
      setSavedCoursesList(saved);
      setLikedCoursesList(liked);
    };

    fetchSavedCourses();
  }, [savedCourses, likedCourses, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cursurile mele salvate</h1>
      
      <Tabs defaultValue="saved" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Cursuri salvate ({savedCoursesList.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Cursuri apreciate ({likedCoursesList.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved">
          {savedCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCoursesList.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Bookmark className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold">Nu ai cursuri salvate</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Salvează cursurile care te interesează pentru a le accesa mai ușor mai târziu.
              </p>
              <Button onClick={() => navigate('/courses')} className="mt-4">
                Explorează cursuri
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liked">
          {likedCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedCoursesList.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Heart className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold">Nu ai cursuri apreciate</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Apreciază cursurile care ți-au plăcut pentru a le accesa mai ușor mai târziu.
              </p>
              <Button onClick={() => navigate('/courses')} className="mt-4">
                Explorează cursuri
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedCoursesPage;
