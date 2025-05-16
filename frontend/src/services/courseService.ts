import { Course, CourseFormData } from '@/types/course';
import { apiClient } from '@/utils/apiClient';

/**
 * Save a course (create or update)
 */
export const saveCourse = async (courseData: CourseFormData & { status: 'draft' | 'published' }) => {
  if (courseData.id) {
    // Update existing course
    return apiClient.put<Course>(`/courses/${courseData.id}`, courseData);
  } else {
    // Create new course
    return apiClient.post<{ message: string, courseId: string }>('/courses', courseData);
  }
};

/**
 * Fetch a course by ID
 */
export const fetchCourse = async (courseId: string) => {
  return apiClient.get<Course>(`/courses/${courseId}`);
};

/**
 * Fetch all published courses with optional filters
 */
export const fetchPublishedCourses = async (filters?: {
  subject?: string;
  search?: string;
  featured?: boolean;
}) => {
  return apiClient.get<Course[]>('/courses', filters as Record<string, string>);
};

/**
 * Fetch courses for a specific teacher
 */
export const fetchTeacherCourses = async (teacherId: string) => {
  return apiClient.get<Course[]>(`/courses/teacher/${teacherId}`);
};

/**
 * Fetch courses created by the current logged-in teacher
 */
export const fetchMyCourses = async () => {
  return apiClient.get<Course[]>('/courses/my/teaching');
};

/**
 * Fetch courses enrolled by the current logged-in student
 */
export const fetchMyEnrolledCourses = async () => {
  return apiClient.get<Course[]>('/courses/my/learning');
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: string) => {
  return apiClient.delete<{ message: string }>(`/courses/${courseId}`);
};
