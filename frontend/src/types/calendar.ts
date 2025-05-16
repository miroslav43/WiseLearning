/**
 * Calendar event model
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  location?: string;
  isAllDay: boolean;
  type: 'course' | 'tutoring' | 'personal' | 'meeting' | string;
  userId: string;
  courseId?: string;
  tutoringId?: string;
  color?: string;
  createdAt?: Date | string;
}
