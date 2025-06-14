import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTutoringService } from "@/services/tutoringService";
import { TutoringSession, TutoringSessionStatus } from "@/types/tutoring";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { CalendarIcon, Edit, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusMap: Record<
  TutoringSessionStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "În așteptare",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  approved: {
    label: "Aprobat",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Respins",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  confirmed: {
    label: "Confirmat",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Finalizat",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  cancelled: {
    label: "Anulat",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const TeacherTutoringManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getMyTutoringSessions, deleteTutoringSession } = useTutoringService();
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard against non-teachers accessing this page
    if (user && user.role !== "teacher") {
      navigate("/");
      toast({
        title: "Acces restricționat",
        description: "Această pagină este disponibilă doar pentru profesori.",
        variant: "destructive",
      });
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Use the correct function to fetch teacher sessions
        const teacherSessions = await getMyTutoringSessions();
        setSessions(teacherSessions);
      } catch (error) {
        console.error("Failed to fetch tutoring sessions:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca anunțurile de meditații. Încearcă din nou mai târziu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessions();
    }
  }, [user, navigate, toast, getMyTutoringSessions]);

  const getFilteredSessions = () => {
    if (activeTab === "all") {
      return sessions;
    }
    return sessions.filter((session) => session.status === activeTab);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteTutoringSession(sessionId);
      setSessions(sessions.filter((session) => session.id !== sessionId));
      toast({
        title: "Anunț șters",
        description: "Anunțul de meditații a fost șters cu succes.",
      });
    } catch (error) {
      console.error("Failed to delete tutoring session:", error);
      toast({
        title: "Eroare",
        description:
          "A apărut o eroare la ștergerea anunțului. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    }
  };

  const getStatusCount = (status: TutoringSessionStatus | "all") => {
    if (status === "all") {
      return sessions.length;
    }
    return sessions.filter((s) => s.status === status).length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-xl text-muted-foreground">
            Se încarcă anunțurile de meditații...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Anunțurile mele de meditații
          </h1>
          <p className="text-muted-foreground">
            Gestionează anunțurile tale de meditații și vizualizează cererile
            primite.
          </p>
        </div>

        <Button
          onClick={() => navigate("/teacher/tutoring/create")}
          className="bg-brand-500 hover:bg-brand-600 self-start"
        >
          <Plus className="h-4 w-4 mr-2" /> Adaugă anunț nou
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {getStatusCount("all")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Total anunțuri</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {getStatusCount("approved")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">Anunțuri active</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {getStatusCount("pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-600">În așteptare</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {getStatusCount("confirmed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600">Sesiuni confirmate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista anunțurilor de meditații</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full max-w-md">
              <TabsTrigger value="all">
                Toate ({getStatusCount("all")})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Active ({getStatusCount("approved")})
              </TabsTrigger>
              <TabsTrigger value="pending">
                În așteptare ({getStatusCount("pending")})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmate ({getStatusCount("confirmed")})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {getFilteredSessions().length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Materie</TableHead>
                        <TableHead>Preț (RON/oră)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data creării</TableHead>
                        <TableHead className="text-right">Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredSessions().map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">
                            {session.subject}
                          </TableCell>
                          <TableCell>{session.pricePerHour} RON</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusMap[session.status].color}
                            >
                              {statusMap[session.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDistanceToNow(
                                new Date(session.createdAt),
                                { addSuffix: true, locale: ro }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/teacher/tutoring/edit/${session.id}`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Ești sigur?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Această acțiune nu poate fi anulată.
                                      Anunțul de meditații va fi șters
                                      definitiv.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Anulează
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteSession(session.id)
                                      }
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Șterge
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-4">
                    Nu ai niciun anunț de meditații{" "}
                    {activeTab !== "all"
                      ? `cu status "${
                          statusMap[activeTab as TutoringSessionStatus].label
                        }"`
                      : ""}
                    .
                  </p>
                  <Button
                    onClick={() => navigate("/teacher/tutoring/create")}
                    className="bg-brand-500 hover:bg-brand-600"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adaugă primul anunț
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherTutoringManagePage;
