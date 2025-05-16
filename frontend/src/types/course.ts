/**
 * Course model defining course structure for the platform
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  imageUrl?: string;
  videoUrl?: string;
  price: number;
  currency: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  teacherId: string;
  teacherName: string;
  rating?: number;
  reviewCount?: number;
  status: 'draft' | 'published' | 'archived' | 'removed';
  featured?: boolean;
  enrolledCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  lessons?: Lesson[];
}

/**
 * Form data for creating or updating a course
 */
export interface CourseFormData {
  id?: string;
  title: string;
  description: string;
  subject: string;
  imageUrl?: string;
  videoUrl?: string;
  price: number;
  currency: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
}

/**
 * Lesson model for course content
 */
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  order: number;
  durationMinutes: number;
  courseId: string;
  completed?: boolean;
}

/**
 * Enrollment status for a student in a course
 */
export interface CourseEnrollment {
  id: string;
  courseId: string;
  course?: Course;
  studentId: string;
  status: 'active' | 'completed' | 'paused' | 'refunded';
  progressPercentage: number;
  enrolledAt: Date | string;
  completedAt?: Date | string;
}

export type Subject =
  | 'computer-science'
  | 'romanian'
  | 'mathematics'
  | 'history'
  | 'biology'
  | 'geography'
  | 'physics'
  | 'chemistry'
  | 'english'
  | 'french'
  | 'other';

export type QuestionType = 'single' | 'multiple' | 'true-false' | 'order';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  courseTitle?: string;
  teacherName?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctOptions: number[];
  order?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
}

export interface UnitTest {
  id: string;
  name: string;
  testCode: string;
  expectedOutput?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  maxScore: number;
  allowFileUpload: boolean;
  allowedFileTypes?: string[];
  unitTests?: UnitTest[]; // New field for Computer Science assignments
}

export type ContentType = 'lesson' | 'quiz' | 'assignment';

export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}
