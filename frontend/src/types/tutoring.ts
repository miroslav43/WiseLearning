/**
 * Status of a tutoring session
 */
export type TutoringSessionStatus = 'pending' | 'approved' | 'rejected' | 'archived' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Location type for tutoring sessions
 */
export type TutoringLocationType = 'online' | 'offline' | 'both';

/**
 * Status of a tutoring request
 */
export type TutoringRequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled';

/**
 * Availability slot for tutoring sessions
 */
export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/**
 * Tutoring session model
 */
export interface TutoringSession {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  subject: string;
  description: string;
  hourlyRate: number;
  pricePerHour: number; // Alias for hourlyRate for compatibility
  currency: string;
  availability: AvailabilitySlot[];
  status: TutoringSessionStatus;
  location?: string;
  locationType: TutoringLocationType; // No longer optional as it's used in components
  isOnline: boolean;
  language: string;
  maxStudents?: number;
  tags?: string[];
  rating?: number; // Added as it's used in components
  reviews?: TutoringReview[]; // Added as it's used in components
  createdAt: string;
  updatedAt: string;
}

/**
 * Preferred date for a tutoring request
 */
export interface PreferredDate {
  date: string;
  startTime: string;
  endTime: string;
}

/**
 * Tutoring request from a student to a teacher
 */
export interface TutoringRequest {
  id: string;
  sessionId: string;
  session?: TutoringSession;
  studentId: string;
  studentName: string;
  studentAvatar?: string; // Added as it's used in components
  message: string;
  preferredDates: PreferredDate[];
  status: TutoringRequestStatus;
  confirmedDate?: string;
  confirmedStartTime?: string;
  confirmedEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Message in a tutoring conversation
 */
export interface TutoringMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  content: string;
  read: boolean;
  createdAt: string;
}

/**
 * Review for a tutoring session
 */
export interface TutoringReview {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string; // Added as it might be useful
  rating: number;
  comment: string;
  createdAt: string;
}
