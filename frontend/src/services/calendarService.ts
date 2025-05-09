
import { CalendarEvent } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addHours, setHours, startOfDay, format, isValid } from 'date-fns';

// Mock function to generate calendar events
export const fetchCalendarEvents = async (
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<CalendarEvent[]> => {
  // This would typically be an API call to fetch events from the backend
  // For now, we'll generate mock data
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const events: CalendarEvent[] = [];
  
  // Validate input dates
  if (!isValid(startDate) || !isValid(endDate)) {
    console.error('Invalid date range provided to fetchCalendarEvents', { startDate, endDate });
    return [];
  }
  
  // Add some mock course events
  const courseStartDate = startOfDay(new Date());
  events.push({
    id: uuidv4(),
    title: 'Informatică: Algoritmi',
    description: 'Curs săptămânal de algoritmi avansați',
    type: 'course',
    startTime: setHours(courseStartDate, 10).toISOString(),
    endTime: setHours(courseStartDate, 12).toISOString(),
    courseId: '1',
    lessonId: '101'
  });
  
  events.push({
    id: uuidv4(),
    title: 'Matematică: Analiză',
    description: 'Sesiune de recapitulare pentru examen',
    type: 'course',
    startTime: setHours(addDays(courseStartDate, 2), 14).toISOString(),
    endTime: setHours(addDays(courseStartDate, 2), 16).toISOString(),
    courseId: '3',
    lessonId: '305'
  });
  
  // Add some tutoring sessions
  const tutoringStartDate = addDays(startOfDay(new Date()), 1);
  events.push({
    id: uuidv4(),
    title: 'Meditație Informatică',
    description: 'Sesiune one-on-one cu Prof. Maria Popescu',
    type: 'tutoring',
    startTime: setHours(tutoringStartDate, 15).toISOString(),
    endTime: setHours(tutoringStartDate, 16).toISOString(),
    teacherName: 'Prof. Maria Popescu',
    location: 'Online (Google Meet)'
  });
  
  events.push({
    id: uuidv4(),
    title: 'Meditație Limba Română',
    description: 'Pregătire pentru eseu argumentativ',
    type: 'tutoring',
    startTime: setHours(addDays(tutoringStartDate, 3), 17).toISOString(),
    endTime: setHours(addDays(tutoringStartDate, 3), 18).toISOString(),
    teacherName: 'Prof. Ion Ionescu',
    location: 'Online (Zoom)'
  });
  
  // Add some assignment deadlines
  const assignmentDate = addDays(startOfDay(new Date()), 4);
  events.push({
    id: uuidv4(),
    title: 'Algoritmi grafuri - tema 3',
    description: 'Termen limită pentru implementarea algoritmilor de parcurgere',
    type: 'assignment',
    startTime: startOfDay(assignmentDate).toISOString(),
    endTime: setHours(assignmentDate, 23).toISOString(),
    courseId: '1'
  });
  
  events.push({
    id: uuidv4(),
    title: 'Eseul argumentativ',
    description: 'Data limită pentru eseu despre tema naturii în opera lui Mihai Eminescu',
    type: 'assignment',
    startTime: startOfDay(addDays(assignmentDate, 3)).toISOString(),
    endTime: setHours(addDays(assignmentDate, 3), 23).toISOString(),
    courseId: '2'
  });
  
  // Filter events based on the date range
  return events.filter(event => {
    try {
      const eventStart = new Date(event.startTime);
      if (!isValid(eventStart)) {
        console.warn('Invalid event start time:', event.startTime);
        return false;
      }
      return eventStart >= startDate && eventStart <= endDate;
    } catch (error) {
      console.error('Error filtering event:', error);
      return false;
    }
  });
};
