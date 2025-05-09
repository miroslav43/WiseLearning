
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isToday, isValid } from 'date-fns';
import { Calendar as CalendarIcon, BookOpen, MessageSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';
import { fetchCalendarEvents } from '@/services/calendarService';
import AgendaView from './AgendaView';

interface CalendarProps {
  view: 'month' | 'week' | 'agenda';
  onEventClick: (event: CalendarEvent) => void;
}

const Calendar: React.FC<CalendarProps> = ({ view, onEventClick }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Determine range based on view
        let start: Date, end: Date;
        if (view === 'month') {
          start = startOfMonth(currentDate);
          end = endOfMonth(currentDate);
        } else {
          start = startOfWeek(currentDate, { weekStartsOn: 1 });
          end = endOfWeek(currentDate, { weekStartsOn: 1 });
        }
        
        const eventsData = await fetchCalendarEvents(user.id, start, end);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load calendar events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [user, currentDate, view]);

  const getDayEvents = (day: Date) => {
    if (!isValid(day)) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isValid(eventDate) && isSameDay(eventDate, day);
    });
  };

  const renderDayCell = (day: Date) => {
    if (!isValid(day)) {
      console.warn('Invalid date received in renderDayCell:', day);
      return (
        <div className="h-full w-full flex flex-col">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground">
            ?
          </div>
        </div>
      );
    }
    
    const dayEvents = getDayEvents(day);
    const hasCourse = dayEvents.some(e => e.type === 'course');
    const hasTutoring = dayEvents.some(e => e.type === 'tutoring');
    const hasAssignment = dayEvents.some(e => e.type === 'assignment');
    
    return (
      <div className="h-full w-full flex flex-col">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center", 
          isToday(day) && "bg-brand-800 text-white",
          !isToday(day) && !isSameMonth(day, currentDate) && "text-muted-foreground opacity-50"
        )}>
          {format(day, 'd')}
        </div>
        {dayEvents.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {hasCourse && (
              <div className="h-2 w-2 rounded-full bg-blue-500" title="Course"></div>
            )}
            {hasTutoring && (
              <div className="h-2 w-2 rounded-full bg-green-500" title="Tutoring"></div>
            )}
            {hasAssignment && (
              <div className="h-2 w-2 rounded-full bg-amber-500" title="Assignment"></div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleDayClick = (day: Date) => {
    if (!isValid(day)) return;
    
    const dayEvents = getDayEvents(day);
    if (dayEvents.length === 1) {
      onEventClick(dayEvents[0]);
    } else if (dayEvents.length > 1) {
      // We could show a small popover with all events for the day
      // For now, just clicking the first one
      onEventClick(dayEvents[0]);
    }
  };

  // Render agenda view if selected
  if (view === 'agenda') {
    return <AgendaView events={events} onEventClick={onEventClick} />;
  }

  return (
    <div className="space-y-6 mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Cursuri</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Meditații</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span>Teme</span>
          </Badge>
        </div>
      </div>

      <CalendarPrimitive
        mode="default"
        onDayClick={handleDayClick}
        selected={undefined}
        month={currentDate}
        onMonthChange={setCurrentDate}
        className="rounded-md border shadow-sm max-w-none mx-auto"
        components={{
          Day: ({ date }) => renderDayCell(date)
        }}
      />
    </div>
  );
};

export default Calendar;
