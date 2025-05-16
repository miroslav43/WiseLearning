/**
 * Status of a tutoring session
 */
export type TutoringSessionStatus = 'pending' | 'approved' | 'rejected' | 'archived';

/**
 * Status of a tutoring request
 */
export type TutoringRequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled';

/**
 * Tutoring session model
 */
export interface TutoringSession {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  description: string;
  hourlyRate: number;
  currency: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  status: TutoringSessionStatus;
  location?: string;
  isOnline: boolean;
  language: string;
  maxStudents?: number;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
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
  message: string;
  preferredDates: {
    date: Date | string;
    startTime: string;
    endTime: string;
  }[];
  status: TutoringRequestStatus;
  confirmedDate?: Date | string;
  confirmedStartTime?: string;
  confirmedEndTime?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  createdAt: Date | string;
}

/**
 * Review for a tutoring session
 */
export interface TutoringReview {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}
