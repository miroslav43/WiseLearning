
import React from 'react';
import { format, isSameDay, isValid } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { BookOpen, MessageSquare, FileText, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgendaViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ events, onEventClick }) => {
  // Filter invalid events
  const validEvents = events.filter(event => {
    try {
      const eventDate = new Date(event.startTime);
      return isValid(eventDate);
    } catch (error) {
      console.error('Invalid event date:', event);
      return false;
    }
  });
  
  // Group events by date
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  
  validEvents.forEach(event => {
    try {
      const eventDate = new Date(event.startTime);
      if (!isValid(eventDate)) return;
      
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }
      groupedEvents[dateKey].push(event);
    } catch (error) {
      console.error('Error grouping event:', error);
    }
  });

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'tutoring':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'assignment':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'course':
        return <Badge variant="secondary">Curs</Badge>;
      case 'tutoring':
        return <Badge variant="default">Meditație</Badge>;
      case 'assignment':
        return <Badge variant="outline">Temă</Badge>;
      default:
        return <Badge variant="secondary">Eveniment</Badge>;
    }
  };

  const formatTimeForEvent = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Oră invalidă';
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Oră invalidă';
    }
  };

  if (validEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Niciun eveniment programat</h3>
        <p className="text-muted-foreground mt-2">Nu ai evenimente programate în perioada selectată.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(dateKey => {
        try {
          const date = new Date(dateKey);
          if (!isValid(date)) return null;
          
          const isToday = isSameDay(date, new Date());
          
          return (
            <div key={dateKey} className="space-y-2">
              <div className={cn(
                "flex items-center gap-2 font-medium",
                isToday && "text-brand-800"
              )}>
                <Calendar className="h-4 w-4" />
                <span>{format(date, 'EEEE, d MMMM yyyy')}</span>
                {isToday && <Badge variant="default" className="ml-2">Astăzi</Badge>}
              </div>
              
              <div className="space-y-2">
                {groupedEvents[dateKey].map(event => (
                  <Card 
                    key={event.id} 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getEventIcon(event.type)}
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getEventBadge(event.type)}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{formatTimeForEvent(event.startTime)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering date group:', error);
          return null;
        }
      })}
    </div>
  );
};

export default AgendaView;
