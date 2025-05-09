
export type TutoringSessionStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'completed' | 'cancelled';
export type TutoringRequestStatus = 'pending' | 'accepted' | 'rejected';
export type TutoringLocationType = 'online' | 'offline' | 'both';

export interface TutoringAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
}

export interface TutoringReview {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  teacherName?: string; // Added to match what's used in ReviewManagement.tsx
  userName?: string; // Added for compatibility with ReviewList.tsx
  userAvatar?: string; // Added for compatibility with ReviewList.tsx
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface TutoringSession {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  studentName?: string;
  subject: string;
  description: string;
  availability: TutoringAvailability[];
  locationType: TutoringLocationType;
  pricePerHour: number;
  price?: number;
  status: TutoringSessionStatus;
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  scheduledAt?: Date;
  notes?: string;
  meetingLink?: string;
  reviews?: TutoringReview[];
  rating?: number; // Average rating
  featured?: boolean; // Whether this tutoring is featured
  maxStudents?: number; // For group tutoring sessions
  prerequisites?: string[]; // Skills or knowledge needed
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags?: string[]; // Additional tags for filtering
}

export interface TutoringRequest {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  message: string;
  preferredDates: Date[];
  status: TutoringRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutoringMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  message: string;
  read: boolean;
  createdAt: Date;
}
