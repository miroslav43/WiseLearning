
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { TutoringSession, TutoringRequest } from '@/types/tutoring';
import { useTutoringService } from '@/services/tutoringService';
import { TutoringSessionForm, TutoringSessionFormValues } from '@/components/tutoring/TutoringSessionForm';

// Import refactored components
import TutoringStats from '@/components/tutoring/teacher/TutoringStats';
import TutoringSessions from '@/components/tutoring/teacher/TutoringSessions';
import TutoringRequests from '@/components/tutoring/teacher/TutoringRequests';
import TutoringSessionDetails from '@/components/tutoring/teacher/TutoringSessionDetails';
import TutoringRequestDetails from '@/components/tutoring/teacher/TutoringRequestDetails';
import DeleteConfirmationDialog from '@/components/tutoring/teacher/DeleteConfirmationDialog';

const TeacherTutoringPage: React.FC = () => {
  const { user } = useAuth();
  const tutoringService = useTutoringService();
  
  // State management
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedSession, setSelectedSession] = useState<TutoringSession | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TutoringRequest | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Redirect non-teacher users
  if (!user || user.role !== 'teacher') {
    return <Navigate to="/" replace />;
  }
  
  useEffect(() => {
    const fetchSessionsAndRequests = () => {
      const teacherSessions = tutoringService.getTeacherTutoringSessions(user.id);
      const allRequests = tutoringService.getAllTutoringRequests();
      
      // Filter requests for this teacher's sessions
      const teacherRequests = allRequests.filter(request => 
        teacherSessions.some(session => session.id === request.sessionId)
      );
      
      setSessions(teacherSessions);
      setRequests(teacherRequests);
    };
    
    fetchSessionsAndRequests();
  }, [user.id]);
  
  // Session handlers
  const handleCreateSession = () => {
    setIsFormDialogOpen(true);
  };
  
  const handleSessionSubmit = (data: TutoringSessionFormValues) => {
    // Implementation for creating the session
    console.log("Form submitted with data:", data);
    
    // Here you would normally call your service to create the session
    // For now, let's simulate a successful creation
    handleSessionCreated();
  };
  
  const handleSessionCreated = () => {
    const teacherSessions = tutoringService.getTeacherTutoringSessions(user.id);
    setSessions(teacherSessions);
    setIsFormDialogOpen(false);
    
    toast({
      title: "Sesiune creată",
      description: "Sesiunea de tutoriat a fost creată cu succes și așteaptă aprobarea.",
    });
  };
  
  const handleSessionFormCancel = () => {
    setIsFormDialogOpen(false);
  };
  
  const handleSessionEdit = (session: TutoringSession) => {
    console.log("Edit session:", session);
    // Implement editing functionality
  };
  
  const handleSessionDelete = (session: TutoringSession) => {
    setSelectedSession(session);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedSession) {
      const success = tutoringService.deleteTutoringSession(selectedSession.id);
      
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
        setDeleteDialogOpen(false);
        
        toast({
          title: "Sesiune ștearsă",
          description: "Sesiunea de tutoriat a fost ștearsă.",
        });
      }
    }
  };
  
  const handleViewSession = (session: TutoringSession) => {
    setSelectedSession(session);
    setIsSessionDialogOpen(true);
  };
  
  // Request handlers
  const handleViewRequest = (request: TutoringRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };
  
  const handleAcceptRequest = (request: TutoringRequest) => {
    const updated = tutoringService.acceptRequest(request.id);
    
    if (updated) {
      setRequests(prev => 
        prev.map(r => r.id === updated.id ? updated : r)
      );
      setSelectedRequest(updated);
      
      toast({
        title: "Cerere acceptată",
        description: "Ați acceptat cererea de tutoriat.",
      });
    }
  };
  
  const handleRejectRequest = (request: TutoringRequest) => {
    const updated = tutoringService.rejectRequest(request.id);
    
    if (updated) {
      setRequests(prev => 
        prev.map(r => r.id === updated.id ? updated : r)
      );
      setSelectedRequest(updated);
      
      toast({
        title: "Cerere respinsă",
        description: "Ați respins cererea de tutoriat.",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestionează Tutoriatul</h1>
          <p className="text-muted-foreground">
            Creează și administrează sesiunile tale de tutoriat și cererile de la studenți
          </p>
        </div>
        <Button onClick={handleCreateSession} className="gap-2">
          <Plus className="h-4 w-4" /> Creează sesiune nouă
        </Button>
      </div>
      
      <TutoringStats sessions={sessions} requests={requests} />
      
      <Tabs defaultValue="sessions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="sessions">
            Sesiunile mele
            {sessions.length > 0 && (
              <Badge className="ml-2 bg-primary">{sessions.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Cereri studenți
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-primary">
                {requests.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="space-y-6">
          <TutoringSessions 
            sessions={sessions}
            requests={requests}
            onCreateSession={handleCreateSession}
            onViewSession={handleViewSession}
            onEditSession={handleSessionEdit}
            onDeleteSession={handleSessionDelete}
          />
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-6">
          <TutoringRequests 
            sessions={sessions}
            requests={requests}
            onViewRequest={handleViewRequest}
          />
        </TabsContent>
      </Tabs>
      
      {/* Session Details Dialog */}
      {selectedSession && (
        <TutoringSessionDetails
          isOpen={isSessionDialogOpen}
          onOpenChange={setIsSessionDialogOpen}
          session={selectedSession}
          requests={requests}
          onEdit={handleSessionEdit}
          onDelete={handleSessionDelete}
          onViewRequest={handleViewRequest}
        />
      )}
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <TutoringRequestDetails
          isOpen={isRequestDialogOpen}
          onOpenChange={setIsRequestDialogOpen}
          request={selectedRequest}
          sessions={sessions}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}
      
      {/* Create Session Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Creare sesiune de tutoriat</DialogTitle>
            <DialogDescription>
              Completează detaliile pentru o nouă sesiune de tutoriat
            </DialogDescription>
          </DialogHeader>
          
          <TutoringSessionForm 
            onSubmit={handleSessionSubmit}
            onSessionCreated={handleSessionCreated}
            onCancel={handleSessionFormCancel}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TeacherTutoringPage;
