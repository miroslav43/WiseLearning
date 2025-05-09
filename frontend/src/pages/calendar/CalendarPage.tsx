
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Calendar from '@/components/calendar/Calendar';
import EventDetailsDialog from '@/components/calendar/EventDetailsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@/types/calendar';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on page load and when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Calendar</h1>
          <p>Trebuie să fii autentificat pentru a accesa această pagină.</p>
        </div>
      </div>
    );
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Calendarul meu</h1>
      
      <Tabs defaultValue="month" className="space-y-6 max-w-6xl mx-auto">
        <TabsList className="mx-auto flex justify-center">
          <TabsTrigger value="month">Lună</TabsTrigger>
          <TabsTrigger value="week">Săptămână</TabsTrigger>
          <TabsTrigger value="agenda">Agendă</TabsTrigger>
        </TabsList>
        
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Calendar</CardTitle>
            <CardDescription className="text-center">
              Vizualizează cursurile, meditațiile și termenele pentru teme.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="month" className="mt-0">
              <Calendar 
                view="month" 
                onEventClick={handleEventClick}
              />
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              <Calendar 
                view="week" 
                onEventClick={handleEventClick}
              />
            </TabsContent>
            
            <TabsContent value="agenda" className="mt-0">
              <Calendar 
                view="agenda" 
                onEventClick={handleEventClick}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      {selectedEvent && (
        <EventDetailsDialog 
          event={selectedEvent}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
};

export default CalendarPage;
