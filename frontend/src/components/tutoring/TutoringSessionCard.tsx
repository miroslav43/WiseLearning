
import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { getSubjectIcon, formatSubjectName } from '@/utils/subjectUtils';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, MapPin, Users } from "lucide-react"
import { TutoringSession } from '@/types/tutoring'
import { Subject } from '@/types/course';

interface TutoringSessionCardProps {
  session: TutoringSession;
  showDetails?: boolean;
  onSelect?: () => void;
}

const TutoringSessionCard: React.FC<TutoringSessionCardProps> = ({ 
  session, 
  showDetails = false,
  onSelect
}) => {
  // Now we can pass the string subject directly
  const SubjectIcon = getSubjectIcon(session.subject);
  
  // Extract necessary data from the availability for display
  const firstAvailability = session.availability && session.availability.length > 0 
    ? session.availability[0] 
    : null;

  // Helper to get readable day of week
  const getDayOfWeek = (day: number): string => {
    const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    return days[day];
  };
  
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <SubjectIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium line-clamp-2">{session.description || 'Sesiune de tutoriat'}</h3>
              <p className="text-sm text-muted-foreground">{formatSubjectName(session.subject)}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{session.pricePerHour} RON</Badge>
          </div>
          
          {showDetails && firstAvailability && (
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{getDayOfWeek(firstAvailability.dayOfWeek)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{firstAvailability.startTime} - {firstAvailability.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{session.locationType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Sesiune de tutoriat</span>
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={session.teacherAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session.teacherName)} 
                  alt={session.teacherName}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">{session.teacherName}</span>
              </div>
              
              {onSelect && (
                <Button 
                  size="sm" 
                  onClick={onSelect}
                  className="bg-[#13361C] hover:bg-[#13361C]/90 text-white"
                >
                  Selectează
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutoringSessionCard;
