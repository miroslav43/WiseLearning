
export type CalendarEventType = 'course' | 'tutoring' | 'assignment';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: CalendarEventType;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  
  // Course specific properties
  courseId?: string;
  lessonId?: string;
  
  // Tutoring specific properties
  teacherId?: string;
  teacherName?: string;
  studentId?: string;
  studentName?: string;
  location?: string;
}
