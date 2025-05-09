
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SavedCoursesContextType {
  savedCourses: string[];
  likedCourses: string[];
  toggleSavedCourse: (courseId: string) => void;
  toggleLikedCourse: (courseId: string) => void;
  isSaved: (courseId: string) => boolean;
  isLiked: (courseId: string) => boolean;
}

const SavedCoursesContext = createContext<SavedCoursesContextType | undefined>(undefined);

export const SavedCoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [likedCourses, setLikedCourses] = useState<string[]>([]);

  // Load saved courses from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedData = localStorage.getItem(`saved-courses-${user.id}`);
      const likedData = localStorage.getItem(`liked-courses-${user.id}`);
      
      if (savedData) {
        setSavedCourses(JSON.parse(savedData));
      }
      
      if (likedData) {
        setLikedCourses(JSON.parse(likedData));
      }
    } else {
      setSavedCourses([]);
      setLikedCourses([]);
    }
  }, [isAuthenticated, user]);

  // Save to localStorage when saved/liked courses change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`saved-courses-${user.id}`, JSON.stringify(savedCourses));
      localStorage.setItem(`liked-courses-${user.id}`, JSON.stringify(likedCourses));
    }
  }, [savedCourses, likedCourses, isAuthenticated, user]);

  const toggleSavedCourse = (courseId: string) => {
    setSavedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleLikedCourse = (courseId: string) => {
    setLikedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const isSaved = (courseId: string) => savedCourses.includes(courseId);
  const isLiked = (courseId: string) => likedCourses.includes(courseId);

  return (
    <SavedCoursesContext.Provider value={{
      savedCourses,
      likedCourses,
      toggleSavedCourse,
      toggleLikedCourse,
      isSaved,
      isLiked
    }}>
      {children}
    </SavedCoursesContext.Provider>
  );
};

export const useSavedCourses = () => {
  const context = useContext(SavedCoursesContext);
  if (context === undefined) {
    throw new Error('useSavedCourses must be used within a SavedCoursesProvider');
  }
  return context;
};
