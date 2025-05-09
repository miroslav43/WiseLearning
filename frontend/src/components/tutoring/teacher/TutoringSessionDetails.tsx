
import React from 'react';
import { Calendar } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash } from 'lucide-react';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';

interface TutoringSessionDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  session: TutoringSession;
  requests: TutoringRequest[];
  onEdit: (session: TutoringSession) => void;
  onDelete: (session: TutoringSession) => void;
  onViewRequest: (request: TutoringRequest) => void;
}

const TutoringSessionDetails: React.FC<TutoringSessionDetailsProps> = ({
  isOpen,
  onOpenChange,
  session,
  requests,
  onEdit,
  onDelete,
  onViewRequest
}) => {
  const sessionRequests = requests.filter(r => r.sessionId === session.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalii sesiune</span>
            {session.status === 'pending' && <Badge>În așteptare</Badge>}
            {session.status === 'approved' && <Badge variant="secondary">Aprobat</Badge>}
            {session.status === 'rejected' && <Badge variant="destructive">Respins</Badge>}
          </DialogTitle>
          <DialogDescription>
            {session.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Subiect</h3>
            <p className="text-lg font-semibold">{session.subject}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Preț pe oră</h3>
              <p>{session.pricePerHour} RON</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Tip locație</h3>
              <p>{
                session.locationType === 'online' ? 'Online' :
                session.locationType === 'offline' ? 'În persoană' :
                'Online sau în persoană'
              }</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <p>{
                session.status === 'pending' ? 'În așteptare' :
                session.status === 'approved' ? 'Aprobat' :
                'Respins'
              }</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Descriere</h3>
            <ScrollArea className="h-24 rounded-md border p-4">
              <p>{session.description}</p>
            </ScrollArea>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Disponibilitate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {session.availability && session.availability.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 border rounded-md p-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'][slot.dayOfWeek]} {slot.startTime}-{slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Cereri primite</h3>
            {sessionRequests.length === 0 ? (
              <p className="text-muted-foreground">Nu există cereri pentru această sesiune</p>
            ) : (
              <div className="space-y-2">
                {sessionRequests.map(request => (
                  <div key={request.id} className="flex justify-between items-center border rounded-md p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.studentAvatar} alt={request.studentName} />
                        <AvatarFallback>{request.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.studentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.preferredDates && request.preferredDates.length > 0 
                            ? new Date(request.preferredDates[0]).toLocaleDateString() 
                            : 'Nicio dată preferată'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && <Badge>În așteptare</Badge>}
                      {request.status === 'accepted' && <Badge variant="secondary">Acceptat</Badge>}
                      {request.status === 'rejected' && <Badge variant="destructive">Respins</Badge>}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewRequest(request)}
                      >
                        Vezi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onEdit(session)}
            >
              <Edit className="mr-2 h-4 w-4" /> Editează
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onDelete(session);
              }}
            >
              <Trash className="mr-2 h-4 w-4" /> Șterge
            </Button>
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Închide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringSessionDetails;
