
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

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
  duration: number; // in minutes
  order: number;
  type: ContentType;
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  image: string;
  price: number;
  pointsPrice: number; // New field for points-based pricing
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  topics: Topic[];
  students: number;
  rating: number;
  reviews: Review[];
  status: 'draft' | 'published' | 'archived' | 'rejected';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseFormData {
  title: string;
  description: string;
  subject: Subject;
  image: string;
  price: number;
  topics: {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    order: number;
  }[];
}
