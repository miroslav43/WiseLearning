
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  points: number;
  pointsHistory: PointsTransaction[];
  referralCode?: string;
  referredBy?: string;
  achievements: Achievement[];
  certificates: Certificate[];
}

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

export interface Certificate {
  id: string;
  userId: string;
  title: string;
  issueDate: Date;
  type: 'course' | 'tutoring';
  courseId?: string;
  courseName?: string;
  tutoringId?: string;
  tutoringSubject?: string;
  teacherId: string;
  teacherName: string;
  customMessage?: string;
  imageUrl?: string;
  badgeId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: 'course' | 'tutoring' | 'achievement';
  category?: string;
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
