
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TutoringRequest, TutoringSession } from '@/types/tutoring';

interface TutoringRequestCardProps {
  request: TutoringRequest;
  sessions: TutoringSession[];
  onView: (request: TutoringRequest) => void;
}

const TutoringRequestCard: React.FC<TutoringRequestCardProps> = ({ 
  request, 
  sessions, 
  onView 
}) => {
  // Format preferred dates for display
  const formatPreferredDates = (dates: Date[]) => {
    if (!dates || dates.length === 0) return 'Nicio dată specificată';
    
    const formattedDate = new Date(dates[0]).toLocaleDateString();
    return dates.length > 1 
      ? `${formattedDate} și încă ${dates.length - 1}`
      : formattedDate;
  };

  return (
    <Card key={request.id} className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={request.studentAvatar} alt={request.studentName} />
              <AvatarFallback>{request.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{request.studentName}</CardTitle>
              <CardDescription className="text-xs">{request.studentId}</CardDescription>
            </div>
          </div>
          {request.status === 'pending' && <Badge>În așteptare</Badge>}
          {request.status === 'accepted' && <Badge variant="secondary">Acceptat</Badge>}
          {request.status === 'rejected' && <Badge variant="destructive">Respins</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 text-sm text-muted-foreground flex-grow">
        <p className="font-medium mb-1">
          Pentru: {sessions.find(s => s.id === request.sessionId)?.subject || 'Sesiune necunoscută'}
        </p>
        <p className="line-clamp-2 mb-2">{request.message}</p>
        <div className="flex items-center mb-1">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Data: {new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>Disponibilitate: {formatPreferredDates(request.preferredDates)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => onView(request)}
        >
          Vezi detalii
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TutoringRequestCard;
