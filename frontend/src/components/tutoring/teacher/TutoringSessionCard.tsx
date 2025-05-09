
import React from 'react';
import { Calendar, Users } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash } from 'lucide-react';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';

interface TutoringSessionCardProps {
  session: TutoringSession;
  requests: TutoringRequest[];
  onView: (session: TutoringSession) => void;
  onEdit: (session: TutoringSession) => void;
  onDelete: (session: TutoringSession) => void;
}

const TutoringSessionCard: React.FC<TutoringSessionCardProps> = ({ 
  session, 
  requests, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card key={session.id} className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {session.subject}
          </CardTitle>
          {session.status === 'pending' && <Badge>În așteptare</Badge>}
          {session.status === 'approved' && <Badge variant="secondary">Aprobat</Badge>}
          {session.status === 'rejected' && <Badge variant="destructive">Respins</Badge>}
        </div>
        <CardDescription>
          {session.pricePerHour} RON/oră • {
            session.locationType === 'online' ? 'Online' :
            session.locationType === 'offline' ? 'În persoană' :
            'Online sau în persoană'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 text-sm text-muted-foreground flex-grow">
        <p className="line-clamp-3 mb-2">{session.description}</p>
        <div className="flex items-center mb-1">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Creat: {new Date(session.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span>Cereri: {
            requests.filter(r => r.sessionId === session.id).length
          }</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="outline"
          onClick={() => onView(session)}
        >
          Vezi detalii
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(session)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editează</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(session)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Șterge</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default TutoringSessionCard;
