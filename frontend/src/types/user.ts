/**
 * User model for the system
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatarUrl?: string;
  bio?: string;
  subjects?: string[];
  experience?: number | string;  // Allow both number and string for flexibility
  points?: number;
  level?: number;
  achievements?: any[]; // Simplified for this example
  certificates?: Certificate[] | string[];  // Allow both Certificate[] and string[]
  createdAt?: Date | string;
  updatedAt?: Date | string;
  
  // Convenience getters for compatibility
  get name(): string; // Returns firstName + lastName
  get avatar(): string; // Returns avatarUrl
}

/**
 * Badge/achievement that can be awarded to users
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'tutoring' | string;
  category?: string;
  imageUrl: string;
}

/**
 * Certificate awarded to users for course/tutoring completion
 */
export interface Certificate {
  id: string;
  title: string;
  description?: string;
  recipientId: string;
  recipientName: string;
  issuerId: string;
  issuerName: string;
  courseId?: string;
  courseName?: string;
  tutoringId?: string;
  tutoringSubject?: string;
  badgeId?: string;
  badge?: Badge;
  imageUrl?: string;
  verificationCode: string;
  customMessage?: string;
  issuedAt: Date | string;
}

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data required for registration
 */
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  user: User;
  token: string;
}

export type UserRole = 'student' | 'teacher' | 'admin';

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'course_purchase' | 'referral' | 'achievement';
  description: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  pointsRewarded: number;
  completed: boolean;
  completedAt?: Date;
  icon?: string;
  category?: 'learning' | 'community' | 'mastery';
  progress?: number; // 0-100
}

export interface Student extends User {
  role: 'student';
  enrolledCourses: string[];
  completedLessons: string[];
  completedQuizzes: Record<string, number>; // quizId -> score
  completedAssignments: string[];
}

export interface Teacher extends User {
  role: 'teacher';
  courses: string[];
  specialization: string[];
  rating: number;
  students: number;
  education?: string;
  experience?: string;
  schedule?: Array<{day: string, hours: string}>;
  certificates?: string[];
  availability?: {
    days: number[]; // 0-6 for Sunday-Saturday
    startTime: string; // Format: "HH:MM" (24-hour)
    endTime: string; // Format: "HH:MM" (24-hour)
  }[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}
