
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Mail, Star, User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TutoringSession } from '@/types/tutoring';
import TutorAvailabilityCalendar from './TutorAvailabilityCalendar';
import TutoringReviews from './TutoringReviews';

interface TutorProfileModalProps {
  session: TutoringSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: () => void;
}

const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  session,
  open,
  onOpenChange,
  onContact
}) => {
  const [activeTab, setActiveTab] = useState<string>('about');
  
  // Format day of week for display
  const getDayOfWeek = (day: number): string => {
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    return days[day];
  };
  
  // Format location type for display
  const formatLocationType = (type: string) => {
    switch(type) {
      case 'online': return 'Online';
      case 'offline': return 'În persoană';
      case 'both': return 'Online & În persoană';
      default: return type;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar */}
          <div className="bg-[#13361C] text-white p-6 flex flex-col">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-white text-xl font-bold">
                Detalii profesor
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-6">
              <Avatar className="h-24 w-24 border-4 border-white/10">
                <AvatarImage 
                  src={session.teacherAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.teacherName)}&background=ffffff&color=13361C`} 
                  alt={session.teacherName}
                />
                <AvatarFallback className="bg-white/10">
                  {session.teacherName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{session.teacherName}</h2>
              <p className="text-white/80">{session.subject}</p>
              
              {session.rating && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{session.rating.toFixed(1)}</span>
                  <span className="text-white/70 text-sm">
                    ({session.reviews?.length || 0} recenzii)
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-4 mt-4 flex-grow">
              <div className="flex items-center gap-3">
                <Badge className="bg-white text-[#13361C]">
                  {session.pricePerHour} RON/oră
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {formatLocationType(session.locationType)}
                </Badge>
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="space-y-3">
                <h3 className="font-semibold text-white/90">Disponibilitate</h3>
                {session.availability && session.availability.length > 0 ? (
                  <div className="space-y-2">
                    {session.availability.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-white/70" />
                        <span>{getDayOfWeek(slot.dayOfWeek)}</span>
                        <Clock className="h-4 w-4 ml-2 text-white/70" />
                        <span>{slot.startTime}-{slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 text-sm">
                    Nu este specificată disponibilitatea.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-white text-[#13361C] hover:bg-white/90" 
                onClick={onContact}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contactează profesor
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-2 overflow-hidden flex flex-col max-h-[80vh]">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="px-6 pt-6 border-b">
                <TabsList className="grid grid-cols-3 w-full mb-2">
                  <TabsTrigger value="about">Despre</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="reviews">Recenzii</TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="flex-grow px-6 py-4">
                <TabsContent value="about" className="mt-0 h-full">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Despre sesiune</h3>
                      <p className="text-gray-700">{session.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">De ce să alegi această sesiune</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <User className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Profesor cu experiență în predarea {session.subject}
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <Clock className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Flexibilitate în programarea sesiunilor, conform disponibilității tale
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="bg-[#13361C]/10 p-1 rounded-full mt-0.5">
                            <MapPin className="h-4 w-4 text-[#13361C]" />
                          </div>
                          <div className="text-gray-700">
                            Sesiuni {formatLocationType(session.locationType).toLowerCase()} pentru confort maxim
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar" className="mt-0 h-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Disponibilitate săptămânală</h3>
                    <p className="text-gray-600 mb-4">
                      Vizualizează disponibilitatea profesorului și alege intervalul care ți se potrivește.
                    </p>
                    
                    <TutorAvailabilityCalendar availability={session.availability || []} />
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Notă:</h4>
                      <p className="text-sm text-gray-600">
                        După ce trimiți o cerere de tutoriat, vei putea discuta direct cu profesorul pentru a stabili data și ora exactă a sesiunii.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-0 h-full">
                  <TutoringReviews
                    sessionId={session.id}
                    teacherName={session.teacherName}
                    rating={session.rating || 0}
                    reviews={session.reviews || []}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorProfileModal;
