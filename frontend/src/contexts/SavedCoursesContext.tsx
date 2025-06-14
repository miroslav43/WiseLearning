import {
  toggleLikedCourse as apiToggleLikedCourse,
  toggleSavedCourse as apiToggleSavedCourse,
  fetchLikedCourses,
  fetchSavedCourses,
} from "@/services/courseService";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface SavedCoursesContextType {
  savedCourses: string[];
  likedCourses: string[];
  toggleSavedCourse: (courseId: string) => void;
  toggleLikedCourse: (courseId: string) => void;
  isSaved: (courseId: string) => boolean;
  isLiked: (courseId: string) => boolean;
  refreshSavedCourses: () => void;
}

const SavedCoursesContext = createContext<SavedCoursesContextType | undefined>(
  undefined
);

export const SavedCoursesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [likedCourses, setLikedCourses] = useState<string[]>([]);

  // Load saved and liked courses from API when user changes
  const loadCoursesFromAPI = async () => {
    if (!isAuthenticated || !user) {
      setSavedCourses([]);
      setLikedCourses([]);
      return;
    }

    try {
      // Try to fetch from API
      const [savedResponse, likedResponse] = await Promise.allSettled([
        fetchSavedCourses(),
        fetchLikedCourses(),
      ]);

      if (savedResponse.status === "fulfilled") {
        const savedCourseIds = savedResponse.value.map((course) => course.id);
        setSavedCourses(savedCourseIds);
      } else {
        // Fallback to localStorage if API fails
        const savedData = localStorage.getItem(`saved-courses-${user.id}`);
        if (savedData) {
          setSavedCourses(JSON.parse(savedData));
        }
      }

      if (likedResponse.status === "fulfilled") {
        const likedCourseIds = likedResponse.value.map((course) => course.id);
        setLikedCourses(likedCourseIds);
      } else {
        // Fallback to localStorage if API fails
        const likedData = localStorage.getItem(`liked-courses-${user.id}`);
        if (likedData) {
          setLikedCourses(JSON.parse(likedData));
        }
      }
    } catch (error) {
      console.error(
        "Error loading courses from API, using localStorage:",
        error
      );

      // Fallback to localStorage
      const savedData = localStorage.getItem(`saved-courses-${user.id}`);
      const likedData = localStorage.getItem(`liked-courses-${user.id}`);

      if (savedData) {
        setSavedCourses(JSON.parse(savedData));
      }

      if (likedData) {
        setLikedCourses(JSON.parse(likedData));
      }
    }
  };

  useEffect(() => {
    loadCoursesFromAPI();
  }, [isAuthenticated, user]);

  // Save to localStorage as backup when saved/liked courses change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(
        `saved-courses-${user.id}`,
        JSON.stringify(savedCourses)
      );
      localStorage.setItem(
        `liked-courses-${user.id}`,
        JSON.stringify(likedCourses)
      );
    }
  }, [savedCourses, likedCourses, isAuthenticated, user]);

  const toggleSavedCourse = async (courseId: string) => {
    if (!isAuthenticated) return;

    try {
      // Call API first
      const response = await apiToggleSavedCourse(courseId);

      // Update local state based on API response
      if (response.saved) {
        setSavedCourses((prev) => [...prev, courseId]);
      } else {
        setSavedCourses((prev) => prev.filter((id) => id !== courseId));
      }
    } catch (error) {
      console.error(
        "Error toggling saved course via API, using localStorage:",
        error
      );

      // Fallback to local state change
      setSavedCourses((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    }
  };

  const toggleLikedCourse = async (courseId: string) => {
    if (!isAuthenticated) return;

    try {
      // Call API first
      const response = await apiToggleLikedCourse(courseId);

      // Update local state based on API response
      if (response.liked) {
        setLikedCourses((prev) => [...prev, courseId]);
      } else {
        setLikedCourses((prev) => prev.filter((id) => id !== courseId));
      }
    } catch (error) {
      console.error(
        "Error toggling liked course via API, using localStorage:",
        error
      );

      // Fallback to local state change
      setLikedCourses((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    }
  };

  const isSaved = (courseId: string) => savedCourses.includes(courseId);
  const isLiked = (courseId: string) => likedCourses.includes(courseId);

  return (
    <SavedCoursesContext.Provider
      value={{
        savedCourses,
        likedCourses,
        toggleSavedCourse,
        toggleLikedCourse,
        isSaved,
        isLiked,
        refreshSavedCourses: loadCoursesFromAPI,
      }}
    >
      {children}
    </SavedCoursesContext.Provider>
  );
};

export const useSavedCourses = () => {
  const context = useContext(SavedCoursesContext);
  if (context === undefined) {
    throw new Error(
      "useSavedCourses must be used within a SavedCoursesProvider"
    );
  }
  return context;
};
