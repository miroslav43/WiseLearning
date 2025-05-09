
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TutoringSession, 
  TutoringRequest, 
  TutoringMessage 
} from '@/types/tutoring';
import { Textarea } from '@/components/ui/textarea';
import { useTutoringService } from '@/services/tutoringService';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const StudentTutoringPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const tutoringService = useTutoringService();
  
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [sessions, setSessions] = useState<{[key: string]: TutoringSession}>({});
  const [selectedRequest, setSelectedRequest] = useState<TutoringRequest | null>(null);
  
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messages, setMessages] = useState<TutoringMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Redirect if not a student
  useEffect(() => {
    if (user && user.role !== 'student') {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Load student's requests and associated sessions
  useEffect(() => {
    if (user) {
      const studentRequests = tutoringService.getTutoringRequestsByStudentId(user.id);
      setRequests(studentRequests);
      
      // Fetch associated sessions
      const sessionsMap: {[key: string]: TutoringSession} = {};
      studentRequests.forEach(request => {
        const session = tutoringService.getTutoringSessionById(request.sessionId);
        if (session) {
          sessionsMap[session.id] = session;
        }
      });
      
      setSessions(sessionsMap);
    }
  }, [user]);
  
  // Load messages when a request is selected
  useEffect(() => {
    if (selectedRequest) {
      const requestMessages = tutoringService.getTutoringMessagesByRequestId(selectedRequest.id);
      setMessages(requestMessages);
      
      if (user) {
        tutoringService.markRequestMessagesAsRead(selectedRequest.id, user.id);
      }
    }
  }, [selectedRequest]);
  
  const handleViewMessages = (request: TutoringRequest) => {
    setSelectedRequest(request);
    setIsMessageDialogOpen(true);
  };
  
  const handleSendMessage = () => {
    if (!user || !selectedRequest || !newMessage.trim()) return;
    
    const message = tutoringService.createTutoringMessage({
      requestId: selectedRequest.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'student',
      message: newMessage,
    });
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Trebuie să fii autentificat ca student pentru a accesa această pagină.</p>
      </div>
    );
  }
  
  const pendingRequests = requests.filter(request => request.status === 'pending');
  const acceptedRequests = requests.filter(request => request.status === 'accepted');
  const rejectedRequests = requests.filter(request => request.status === 'rejected');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sesiunile mele de tutoriat</h1>
          <p className="text-muted-foreground">
            Gestionează cererile tale de tutoriat și comunicarea cu profesorii
          </p>
        </div>
        <Button asChild>
          <Link to="/tutoring">Descoperă mai multe sesiuni</Link>
        </Button>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Alert>
            <AlertTitle>Nu ai nicio cerere de tutoriat</AlertTitle>
            <AlertDescription>
              Explorează sesiunile disponibile și contactează un profesor pentru a începe.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-6">
            <Link to="/tutoring">Caută sesiuni de tutoriat</Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">În așteptare ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="accepted">Acceptate ({acceptedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Respinse ({rejectedRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nu ai cereri în așteptare.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map(request => {
                  const session = sessions[request.sessionId];
                  return (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{session?.subject || 'Sesiune necunoscută'}</CardTitle>
                          <Badge>În așteptare</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={session?.teacherAvatar} alt={session?.teacherName} />
                            <AvatarFallback>{session?.teacherName?.substring(0, 2).toUpperCase() || 'TC'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{session?.teacherName || 'Profesor'}</p>
                            <p className="text-xs text-muted-foreground">
                              {session?.pricePerHour ? `${session.pricePerHour} RON / oră` : 'Preț nedisponibil'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">Mesajul tău:</p>
                          <p className="text-muted-foreground">{request.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Trimis: {format(new Date(request.createdAt), 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2"
                          onClick={() => handleViewMessages(request)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Vezi conversația
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted" className="space-y-6">
            {acceptedRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nu ai cereri acceptate.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acceptedRequests.map(request => {
                  const session = sessions[request.sessionId];
                  return (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{session?.subject || 'Sesiune necunoscută'}</CardTitle>
                          <Badge variant="secondary">Acceptat</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={session?.teacherAvatar} alt={session?.teacherName} />
                            <AvatarFallback>{session?.teacherName?.substring(0, 2).toUpperCase() || 'TC'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{session?.teacherName || 'Profesor'}</p>
                            <p className="text-xs text-muted-foreground">
                              {session?.pricePerHour ? `${session.pricePerHour} RON / oră` : 'Preț nedisponibil'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleViewMessages(request)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Mesaje cu profesorul
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-6">
            {rejectedRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nu ai cereri respinse.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rejectedRequests.map(request => {
                  const session = sessions[request.sessionId];
                  return (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{session?.subject || 'Sesiune necunoscută'}</CardTitle>
                          <Badge variant="destructive">Respins</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={session?.teacherAvatar} alt={session?.teacherName} />
                            <AvatarFallback>{session?.teacherName?.substring(0, 2).toUpperCase() || 'TC'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{session?.teacherName || 'Profesor'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">Mesajul tău:</p>
                          <p className="text-muted-foreground">{request.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Trimis: {format(new Date(request.createdAt), 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewMessages(request)}
                        >
                          Vezi detalii
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Message Dialog */}
      {selectedRequest && (
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>
                  Conversație cu{' '}
                  {sessions[selectedRequest.sessionId]?.teacherName || 'Profesor'}
                </span>
                {selectedRequest.status === 'pending' && (
                  <Badge>În așteptare</Badge>
                )}
                {selectedRequest.status === 'accepted' && (
                  <Badge variant="secondary">Acceptat</Badge>
                )}
                {selectedRequest.status === 'rejected' && (
                  <Badge variant="destructive">Respins</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col h-full">
              {/* Request details */}
              <div className="bg-muted/30 p-4 rounded-md mb-4">
                <h3 className="font-medium">
                  Sesiune: {sessions[selectedRequest.sessionId]?.subject || 'Sesiune necunoscută'}
                </h3>
                <p className="text-sm mt-2">
                  <span className="font-medium">Mesajul tău inițial:</span> {selectedRequest.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Trimis: {format(new Date(selectedRequest.createdAt), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
              
              {/* Messages */}
              <div className="flex-grow overflow-y-auto mb-4 max-h-[30vh] space-y-4 px-1">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Nu există mesaje încă. Așteptăm răspunsul profesorului.
                  </p>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderRole === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderRole === 'student' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderRole === 'student' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {format(new Date(message.createdAt), 'dd.MM.yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Message input */}
              <div className="flex gap-2 mt-auto">
                <Textarea
                  placeholder="Scrie un mesaj..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-grow resize-none"
                  rows={3}
                  disabled={selectedRequest.status === 'rejected'}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || selectedRequest.status === 'rejected'}
                  className="self-end"
                >
                  Trimite
                </Button>
              </div>
              
              {selectedRequest.status === 'rejected' && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Nu poți trimite mesaje pentru o cerere respinsă.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentTutoringPage;
