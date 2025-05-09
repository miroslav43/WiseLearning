
import React from 'react';
import { format, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/types/calendar';
import { Clock, MapPin, User, BookOpen, MessageSquare, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventDetailsDialogProps {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ 
  event, 
  open, 
  onOpenChange 
}) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'tutoring':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'assignment':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventBadge = () => {
    switch (event.type) {
      case 'course':
        return <Badge variant="secondary">Curs</Badge>;
      case 'tutoring':
        return <Badge>Meditație</Badge>;
      case 'assignment':
        return <Badge variant="outline">Temă</Badge>;
      default:
        return <Badge variant="secondary">Eveniment</Badge>;
    }
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!isValid(date)) {
        return 'Data invalidă';
      }
      return format(date, 'EEEE, d MMMM yyyy, HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data invalidă';
    }
  };

  const getActionButton = () => {
    switch (event.type) {
      case 'course':
        return (
          <Button asChild>
            <Link to={`/courses/${event.courseId}/lessons/${event.lessonId || ''}`}>
              Accesează cursul
            </Link>
          </Button>
        );
      case 'tutoring':
        return (
          <Button asChild>
            <Link to={`/my-tutoring${event.teacherId ? '/manage' : ''}`}>
              {event.teacherId ? 'Gestionează meditația' : 'Vezi meditația'}
            </Link>
          </Button>
        );
      case 'assignment':
        if (event.endTime) {
          const endDate = new Date(event.endTime);
          if (isValid(endDate) && endDate > new Date()) {
            return (
              <Button asChild>
                <Link to={`/my-assignments`}>
                  Încarcă tema
                </Link>
              </Button>
            );
          }
        }
        return (
          <Button asChild>
            <Link to={`/my-assignments`}>
              Vezi feedback
            </Link>
          </Button>
        );
      default:
        return (
          <Button onClick={() => onOpenChange(false)}>
            Închide
          </Button>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getEventIcon()}
            <span>{event.title}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>{event.description}</span>
            {getEventBadge()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatEventDate(event.startTime)}
                {event.endTime && isValid(new Date(event.endTime)) && ` - ${format(new Date(event.endTime), 'HH:mm')}`}
              </span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.teacherName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{event.teacherName}</span>
              </div>
            )}
          </div>
          
          {event.type === 'assignment' && event.endTime && (() => {
            try {
              const endDate = new Date(event.endTime);
              if (isValid(endDate) && endDate > new Date()) {
                return (
                  <div className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                    <p className="font-medium">Termen limită: {formatEventDate(event.endTime)}</p>
                  </div>
                );
              }
              return null;
            } catch {
              return null;
            }
          })()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Închide
          </Button>
          {getActionButton()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
