
import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TutoringSession } from '@/types/tutoring';
import { getSubjectIcon, formatSubjectName } from '@/utils/subjectUtils';

interface TutorCardProps {
  session: TutoringSession;
  onViewProfile: () => void;
  onContact: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ 
  session, 
  onViewProfile, 
  onContact 
}) => {
  // Use getSubjectIcon with the string subject - it's now updated to handle both string and Subject type
  const SubjectIcon = getSubjectIcon(session.subject);
  
  // Calculate how many days per week the tutor is available
  const availabilityDays = session.availability 
    ? [...new Set(session.availability.map(a => a.dayOfWeek))].length 
    : 0;
  
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
    <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-200 hover:border-[#13361C]/20">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-[#13361C]/90 to-[#212717]/80"></div>
        <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-white shadow-sm">
          <AvatarImage 
            src={session.teacherAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.teacherName)}&background=13361C&color=fff`} 
            alt={session.teacherName} 
          />
          <AvatarFallback className="bg-[#13361C]/10 text-[#13361C]">
            {session.teacherName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute top-4 right-4 bg-white text-[#13361C]">
          {session.pricePerHour} RON/oră
        </Badge>
      </div>
      
      <CardContent className="pt-10 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{session.teacherName}</h3>
            <p className="text-[#13361C] font-medium">{formatSubjectName(session.subject)}</p>
          </div>
          {session.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{session.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {session.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{availabilityDays} zile/săptămână</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <MapPin className="h-3 w-3" />
            <span>{formatLocationType(session.locationType)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-[#13361C]" 
          onClick={onViewProfile}
        >
          Vezi profil
        </Button>
        <Button 
          className="flex-1 bg-[#13361C] hover:bg-[#13361C]/90 text-white" 
          onClick={onContact}
        >
          Contactează
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
