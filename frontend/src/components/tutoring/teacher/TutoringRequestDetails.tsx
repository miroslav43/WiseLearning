
import React from 'react';
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
import { CheckCircle, XCircle } from 'lucide-react';
import { TutoringRequest, TutoringSession } from '@/types/tutoring';

interface TutoringRequestDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: TutoringRequest;
  sessions: TutoringSession[];
  onAccept: (request: TutoringRequest) => void;
  onReject: (request: TutoringRequest) => void;
}

const TutoringRequestDetails: React.FC<TutoringRequestDetailsProps> = ({
  isOpen,
  onOpenChange,
  request,
  sessions,
  onAccept,
  onReject
}) => {
  const session = sessions.find(s => s.id === request.sessionId);
  
  // Format preferred dates for display
  const formatPreferredDates = (dates: Date[]) => {
    if (!dates || dates.length === 0) return 'Nicio dată specificată';
    
    return dates.map(date => 
      new Date(date).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    ).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalii cerere</span>
            {request.status === 'pending' && <Badge>În așteptare</Badge>}
            {request.status === 'accepted' && <Badge variant="secondary">Acceptat</Badge>}
            {request.status === 'rejected' && <Badge variant="destructive">Respins</Badge>}
          </DialogTitle>
          <DialogDescription>
            Cerere pentru {session?.subject || 'sesiune necunoscută'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.studentAvatar} alt={request.studentName} />
              <AvatarFallback>{request.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{request.studentName}</p>
              <p className="text-sm text-muted-foreground">{request.studentId}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Mesaj</h3>
            <ScrollArea className="h-24 rounded-md border p-4">
              <p>{request.message}</p>
            </ScrollArea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Disponibilitate preferată</h3>
              <p>{formatPreferredDates(request.preferredDates)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Data cererii</h3>
              <p>{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {request.status === 'pending' && (
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onReject(request);
                }}
              >
                <XCircle className="mr-2 h-4 w-4" /> Respinge
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  onAccept(request);
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Acceptă
              </Button>
            </div>
          )}
          {request.status !== 'pending' && (
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Închide
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringRequestDetails;
