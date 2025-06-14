import { useCourse } from "@/hooks/useCourse";
import { Course, Lesson } from "@/types/course";
import React, { createContext, ReactNode, useContext } from "react";

interface CourseContextType {
  course: Course | null;
  isLoading: boolean;
  error: Error | null;
  expandedTopics: { [key: string]: boolean };
  toggleTopic: (topicId: string) => void;
  formatDuration: (minutes: number) => string;
  getFirstLesson: () => Lesson | null;
  firstLessonId: string | null;
  totalLessons: number;
  totalDuration: number;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  courseId: string | undefined;
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  courseId,
  children,
}) => {
  const courseData = useCourse(courseId);

  return (
    <CourseContext.Provider value={courseData}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);

  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }

  return context;
};
