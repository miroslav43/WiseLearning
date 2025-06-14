/**
 * Course model defining course structure for the platform
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  image?: string;
  videoUrl?: string;
  price: number;
  pointsPrice: number;
  status: 'draft' | 'published' | 'archived' | 'rejected';
  featured?: boolean;
  students: number;
  rating?: number;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  teacher?: {
    id: string;
    name: string;
    avatar?: string;
    teacherProfile?: {
      specialization: string[];
      rating?: number;
      students: number;
      education?: string;
      experience?: string;
      certificates: string[];
    }
  };
  topics?: Topic[];
  reviews?: Review[];
  
  // Computed properties (frontend only)
  teacherName?: string;
  teacherAvatar?: string;
}

/**
 * Form data for creating or updating a course
 */
export interface CourseFormData {
  id?: string;
  title: string;
  description: string;
  subject: string;
  image?: string;
  videoUrl?: string;
  price: number;
  pointsPrice: number;
  status?: 'draft' | 'published' | 'archived' | 'rejected';
  topics?: Partial<Topic>[];
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
  orderIndex: number;
  duration?: number;
  topicId: string;
  // Relations
  quiz?: Quiz;
  assignment?: Assignment;
  // Computed properties (frontend only)
  completed?: boolean;
}

/**
 * Enrollment status for a student in a course
 */
export interface CourseEnrollment {
  id: string;
  courseId: string;
  course?: Course;
  userId: string;
  createdAt: string;
  completedAt?: string;
  progress?: number;
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

export type QuestionType = 'single' | 'multiple' | 'true_false' | 'order';

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  }
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[];
  orderIndex: number;
  points: number;
  quizId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number; // in minutes
  lessonId: string;
  questions: Question[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxPoints: number;
  lessonId: string;
  allowAttachments: boolean;
  allowedFileTypes?: string[];
}

export type LessonType = 'lesson' | 'quiz' | 'assignment';

export interface Topic {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  courseId: string;
  // Relations
  lessons: Lesson[];
}
