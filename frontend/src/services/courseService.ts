
import { CourseFormData } from '@/types/course';
import { v4 as uuidv4 } from 'uuid';

// Mock API function that would typically call the backend
export const saveCourse = async (courseData: CourseFormData & { status: 'draft' | 'published' }) => {
  // This is a mock implementation
  console.log('Saving course:', courseData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock response
  return {
    id: uuidv4(),
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to fetch a course by ID (mock)
export const fetchCourse = async (courseId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a mock course
  return {
    id: courseId,
    title: 'Mock Course',
    description: 'This is a mock course returned from the API',
    subject: 'computer-science' as const,
    image: 'https://placehold.co/600x400',
    price: 299,
    topics: [],
    status: 'draft' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to fetch all courses for a teacher (mock)
export const fetchTeacherCourses = async (teacherId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock courses
  return Array(5).fill(null).map((_, index) => ({
    id: uuidv4(),
    title: `Mock Course ${index + 1}`,
    description: 'This is a mock course returned from the API',
    subject: 'computer-science' as const,
    image: 'https://placehold.co/600x400',
    price: 199 + index * 50,
    topics: [],
    status: index % 3 === 0 ? 'published' : 'draft' as 'published' | 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};
