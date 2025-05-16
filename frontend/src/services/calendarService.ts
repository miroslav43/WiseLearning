import { useNotifications } from '@/contexts/NotificationContext';
import { CalendarEvent } from '@/types/calendar';
import { apiClient } from '@/utils/apiClient';

// Get calendar events for the current user
export const getCurrentUserEvents = async (startDate?: Date, endDate?: Date) => {
  const params: Record<string, string> = {};
  
  if (startDate) {
    params.startDate = startDate.toISOString();
  }
  
  if (endDate) {
    params.endDate = endDate.toISOString();
  }
  
  return apiClient.get<CalendarEvent[]>('/calendar/events', params);
};

// Added for compatibility with existing components
export const fetchCalendarEvents = getCurrentUserEvents;

// Create a new calendar event
export const createEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
  return apiClient.post<CalendarEvent>('/calendar/events', event);
};

// Update a calendar event
export const updateEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
  return apiClient.put<CalendarEvent>(`/calendar/events/${eventId}`, eventData);
};

// Delete a calendar event
export const deleteEvent = async (eventId: string) => {
  return apiClient.delete<{ message: string }>(`/calendar/events/${eventId}`);
};

// Custom hook for using calendar service with notifications
export const useCalendarService = () => {
  const { addNotification } = useNotifications();
  
  const createEventWithNotification = async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    try {
      const newEvent = await createEvent(event);
      
      addNotification({
        title: 'Eveniment creat',
        message: 'Evenimentul a fost adăugat în calendar cu succes.',
        type: 'success'
      });
      
      return newEvent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la crearea evenimentului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const updateEventWithNotification = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await updateEvent(eventId, eventData);
      
      addNotification({
        title: 'Eveniment actualizat',
        message: 'Evenimentul a fost actualizat cu succes.',
        type: 'success'
      });
      
      return updatedEvent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la actualizarea evenimentului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const deleteEventWithNotification = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      
      addNotification({
        title: 'Eveniment șters',
        message: 'Evenimentul a fost șters cu succes.',
        type: 'success'
      });
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Eroare la ștergerea evenimentului';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  return {
    createEventWithNotification,
    updateEventWithNotification,
    deleteEventWithNotification
  };
};
