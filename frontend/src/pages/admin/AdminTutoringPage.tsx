import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringService } from "@/services/tutoringService";
import { TutoringSession, TutoringSessionStatus } from "@/types/tutoring";
import { Check, Clock, DollarSign, SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminTutoringPage: React.FC = () => {
  const { user } = useAuth();
  const tutoringService = useTutoringService();

  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TutoringSession[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] =
    useState<TutoringSession | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const allSessions = await tutoringService.getAllTutoringSessions();
        setSessions(allSessions);
        setFilteredSessions(allSessions);
      } catch (error) {
        console.error("Failed to fetch tutoring sessions:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca sesiunile de tutoriat. Încearcă din nou mai târziu.",
          variant: "destructive",
        });
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSessions(sessions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = sessions.filter(
        (session) =>
          session.subject.toLowerCase().includes(term) ||
          session.teacherName.toLowerCase().includes(term) ||
          session.description.toLowerCase().includes(term)
      );
      setFilteredSessions(filtered);
    }
  }, [searchTerm, sessions]);

  const handleViewDetails = (session: TutoringSession) => {
    setSelectedSession(session);
    setIsDetailsOpen(true);
  };

  const handleStatus = async (
    session: TutoringSession,
    status: TutoringSessionStatus
  ) => {
    try {
      const updated = await tutoringService.updateTutoringSessionStatus(
        session.id,
        status
      );

      setSessions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      setSelectedSession(updated);

      if (status === "approved") {
        await tutoringService.approveSessionWithNotification(session.id);
      } else if (status === "rejected") {
        await tutoringService.rejectSessionWithNotification(session.id);
      }

      toast({
        title: status === "approved" ? "Sesiune aprobată" : "Sesiune respinsă",
        description: `Sesiunea "${session.subject}" a fost ${
          status === "approved" ? "aprobată" : "respinsă"
        }.`,
      });
    } catch (error) {
      console.error(`Failed to ${status} tutoring session:`, error);
      toast({
        title: "Eroare",
        description: `Nu am putut ${
          status === "approved" ? "aproba" : "respinge"
        } sesiunea. Încearcă din nou mai târziu.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (session: TutoringSession) => {
    setSelectedSession(session);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSession) {
      try {
        await tutoringService.deleteTutoringSession(selectedSession.id);

        setSessions((prev) => prev.filter((s) => s.id !== selectedSession.id));
        setFilteredSessions((prev) =>
          prev.filter((s) => s.id !== selectedSession.id)
        );
        setIsDetailsOpen(false);
        setDeleteConfirmOpen(false);

        toast({
          title: "Sesiune ștearsă",
          description: `Sesiunea "${selectedSession.subject}" a fost ștearsă.`,
        });
      } catch (error) {
        console.error("Failed to delete tutoring session:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut șterge sesiunea. Încearcă din nou mai târziu.",
          variant: "destructive",
        });
      }
    }
  };

  const pendingSessions = filteredSessions.filter(
    (s) => s.status === "pending"
  );
  const approvedSessions = filteredSessions.filter(
    (s) => s.status === "approved"
  );
  const rejectedSessions = filteredSessions.filter(
    (s) => s.status === "rejected"
  );

  // Helper to format availability for display
  const formatAvailability = (session: TutoringSession) => {
    if (!session.availability || !session.availability.length)
      return "Nu este specificată";

    const days = [
      "Duminică",
      "Luni",
      "Marți",
      "Miercuri",
      "Joi",
      "Vineri",
      "Sâmbătă",
    ];

    return session.availability
      .map((slot) => {
        const day = days[slot.dayOfWeek];
        return `${day} ${slot.startTime}-${slot.endTime}`;
      })
      .join("; ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Administrare Tutoriat</h1>
          <p className="text-muted-foreground">
            Gestionează sesiunile de tutoriat și cererile de la profesori
          </p>
        </div>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Caută după subiect, profesor sau descriere..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">În așteptare</CardTitle>
            <CardDescription>Sesiuni care așteaptă aprobarea</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">{pendingSessions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aprobate</CardTitle>
            <CardDescription>Sesiuni active pe platformă</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">{approvedSessions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Respinse</CardTitle>
            <CardDescription>Sesiuni care au fost respinse</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">{rejectedSessions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="pending">
            În așteptare
            {pendingSessions.length > 0 && (
              <Badge className="ml-2 bg-primary">
                {pendingSessions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Aprobate</TabsTrigger>
          <TabsTrigger value="rejected">Respinse</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            {filteredSessions.filter((s) => s.status === status).length ===
            0 ? (
              <p className="text-center text-muted-foreground py-12">
                Nu există sesiuni{" "}
                {status === "pending"
                  ? "în așteptare"
                  : status === "approved"
                  ? "aprobate"
                  : "respinse"}
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions
                  .filter((session) => session.status === status)
                  .map((session) => (
                    <Card key={session.id} className="h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {session.subject}
                          </CardTitle>
                          {status === "pending" && <Badge>În așteptare</Badge>}
                          {status === "approved" && (
                            <Badge variant="secondary">Aprobat</Badge>
                          )}
                          {status === "rejected" && (
                            <Badge variant="destructive">Respins</Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-2 space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={session.teacherAvatar}
                              alt={session.teacherName}
                            />
                            <AvatarFallback>
                              {session.teacherName
                                ? session.teacherName
                                    .substring(0, 2)
                                    .toUpperCase()
                                : "??"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {session.teacherName}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-2 text-sm text-muted-foreground flex-grow">
                        <p className="line-clamp-2 mb-2">
                          {session.description}
                        </p>
                        <div className="flex items-center mb-1">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{session.pricePerHour} RON/oră</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            Creat:{" "}
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => handleViewDetails(session)}
                        >
                          Vezi detalii
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Session Details Dialog */}
      {selectedSession && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Detalii sesiune de tutoriat</span>
                {selectedSession.status === "pending" && (
                  <Badge>În așteptare</Badge>
                )}
                {selectedSession.status === "approved" && (
                  <Badge variant="secondary">Aprobat</Badge>
                )}
                {selectedSession.status === "rejected" && (
                  <Badge variant="destructive">Respins</Badge>
                )}
              </DialogTitle>
              <DialogDescription>ID: {selectedSession.id}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Profesor</h3>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={selectedSession.teacherAvatar}
                      alt={selectedSession.teacherName}
                    />
                    <AvatarFallback>
                      {selectedSession.teacherName
                        ? selectedSession.teacherName
                            .substring(0, 2)
                            .toUpperCase()
                        : "??"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedSession.teacherName}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Subiect</h3>
                <p>{selectedSession.subject}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tip locație</h3>
                <p>
                  {selectedSession.locationType === "online"
                    ? "Online"
                    : selectedSession.locationType === "offline"
                    ? "În persoană"
                    : "Ambele"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Preț pe oră</h3>
                <p>{selectedSession.pricePerHour} RON</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Creat la</h3>
                <p>{new Date(selectedSession.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Ultima actualizare</h3>
                <p>{new Date(selectedSession.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Descriere</h3>
                <ScrollArea className="h-24 rounded-md border p-4">
                  <p>{selectedSession.description}</p>
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Disponibilitate</h3>
                <p>{formatAvailability(selectedSession)}</p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedSession)}
              >
                Șterge
              </Button>

              <div className="space-x-2">
                {selectedSession.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatus(selectedSession, "rejected")}
                    >
                      <X className="mr-2 h-4 w-4" /> Respinge
                    </Button>
                    <Button
                      onClick={() => handleStatus(selectedSession, "approved")}
                    >
                      <Check className="mr-2 h-4 w-4" /> Aprobă
                    </Button>
                  </>
                )}

                {selectedSession.status === "approved" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatus(selectedSession, "rejected")}
                  >
                    <X className="mr-2 h-4 w-4" /> Suspendă
                  </Button>
                )}

                {selectedSession.status === "rejected" && (
                  <Button
                    onClick={() => handleStatus(selectedSession, "approved")}
                  >
                    <Check className="mr-2 h-4 w-4" /> Reactivează
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această sesiune de tutoriat? Această
              acțiune este ireversibilă și va șterge toate cererile și mesajele
              asociate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Șterge definitiv
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTutoringPage;
