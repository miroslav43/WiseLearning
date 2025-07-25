import TutoringReviews from "@/components/tutoring/TutoringReviews";
import TutoringSessionCard from "@/components/tutoring/TutoringSessionCard";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTutoringService } from "@/services/tutoringService";
import { TutoringSession } from "@/types/tutoring";
import { BookOpen, Check, Clock, Edit, Medal, Star, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const TeacherProfilePage: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tutoringService = useTutoringService();
  const [teacher, setTeacher] = useState<any>(null);
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);

        // Fetch sessions for this teacher
        const allSessions = await tutoringService.getApprovedTutoringSessions();
        const teacherSessions = allSessions.filter(
          (session) => session.teacherId === teacherId
        );

        if (teacherSessions.length > 0) {
          // In a real app with a complete API, you would fetch the teacher profile separately
          // For now, we'll use the session data to create a teacher profile
          const session = teacherSessions[0];

          // Create a teacher object based on the session
          setTeacher({
            id: session.teacherId,
            name: session.teacherName,
            avatar: session.teacherAvatar,
            bio: "Profesor dedicat cu experiență vastă în predarea materiilor. Specializat în a ajuta elevii să atingă excelența academică prin metode de predare adaptate fiecărui student.",
            specializations: [session.subject],
            experience: "10+ ani experiență în educație",
            education:
              "Universitatea București, Facultatea de Matematică și Informatică",
            reviewCount: 87,
            rating: 4.8,
            completedSessions: 124,
            students: 45,
            schedule: [
              { day: "Luni", hours: "14:00 - 20:00" },
              { day: "Marți", hours: "14:00 - 20:00" },
              { day: "Miercuri", hours: "16:00 - 21:00" },
              { day: "Joi", hours: "14:00 - 20:00" },
              { day: "Vineri", hours: "15:00 - 19:00" },
            ],
            certificates: [
              "Diplomă de Excelență în Educație",
              "Certificat de Metodologie Didactică",
            ],
          });

          setSessions(teacherSessions);
        }

        // Check if this is the user's own profile
        if (user && user.id === teacherId) {
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error("Failed to fetch teacher profile:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca profilul profesorului. Încearcă din nou mai târziu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId, tutoringService, user, refreshKey, toast]);

  const handleRefreshReviews = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-xl text-muted-foreground">
            Se încarcă profilul profesorului...
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Profesor negăsit</h1>
          <p className="text-muted-foreground mb-6">
            Profesorul căutat nu a fost găsit sau nu mai este activ.
          </p>
          <Button asChild>
            <Link to="/tutoring">Înapoi la tutoriat</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get reviews for this teacher (in a real app, this would come from an API)
  // For now, we'll create mock reviews data
  const reviews = [
    {
      id: "1",
      sessionId: "session1",
      studentId: "student1",
      studentName: "Elev 1",
      teacherName: teacher.name,
      rating: 5,
      comment:
        "Un profesor excelent care explică foarte clar. Am înțeles mult mai bine materia și am reușit să-mi îmbunătățesc rezultatele.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
      id: "2",
      sessionId: "session2",
      studentId: "student2",
      studentName: "Elev 2",
      teacherName: teacher.name,
      rating: 4.5,
      comment:
        "Metoda de predare este extraordinară. Recomand cu încredere oricui are nevoie de ajutor în înțelegerea acestui subiect.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
    {
      id: "3",
      sessionId: "session3",
      studentId: "student3",
      studentName: "Elev 3",
      teacherName: teacher.name,
      rating: 4,
      comment:
        "Sesiunile au fost foarte productive și bine structurate. Profesorul are multă răbdare și explică până când înțelegi perfect.",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/tutoring"
          className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          &larr; Înapoi la lista de tutoriate
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Teacher Profile Sidebar */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-brand-500">
            <CardHeader className="text-center pb-2">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-brand-100">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback className="text-2xl bg-brand-500 text-white">
                  {teacher.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{teacher.name}</CardTitle>
              <CardDescription className="text-md mt-1">
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  <Star className="fill-amber-500 h-4 w-4" />
                  <span className="font-semibold">{teacher.rating}</span>
                  <span className="text-gray-500">
                    ({teacher.reviewCount} recenzii)
                  </span>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-600" />
                  <span className="text-sm">{teacher.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="h-4 w-4 text-brand-600" />
                  <span className="text-sm">{teacher.education}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" />
                  <span className="text-sm">
                    {teacher.students} elevi ajutați
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-600" />
                  <span className="text-sm">
                    {teacher.completedSessions} sesiuni finalizate
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Specializări</h3>
                <div className="flex flex-wrap gap-1">
                  {teacher.specializations.map(
                    (spec: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-brand-100 text-brand-700 border-brand-200"
                      >
                        {spec}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Program disponibil</h3>
                <div className="text-sm space-y-1">
                  {teacher.schedule.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{item.day}:</span>
                      <span>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Certificări</h3>
                <div className="space-y-1">
                  {teacher.certificates.map((cert: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              {isOwnProfile ? (
                <Button
                  className="w-full flex items-center gap-2"
                  onClick={() => navigate("/teacher/profile/edit")}
                >
                  <Edit className="h-4 w-4" />
                  Editează profilul
                </Button>
              ) : (
                <Button className="w-full bg-brand-500 hover:bg-brand-600">
                  Contactează profesorul
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Teacher Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">Despre</TabsTrigger>
              <TabsTrigger value="sessions">Sesiuni</TabsTrigger>
              <TabsTrigger value="reviews">Recenzii</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Despre mine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {teacher.bio}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Abordare educațională</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-medium text-lg mb-2 text-brand-600">
                        Metodologie personalizată
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Adaptez metoda de predare la stilul de învățare al
                        fiecărui elev, folosind exemple practice și exerciții
                        interactive.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-medium text-lg mb-2 text-brand-600">
                        Accent pe înțelegere profundă
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Nu mă concentrez doar pe memorare, ci pe înțelegerea
                        conceptelor și aplicarea lor în situații reale.
                      </p>
                    </div>

                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-medium text-lg mb-2 text-brand-600">
                        Feedback constant
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ofer feedback detaliat după fiecare sesiune și urmăresc
                        progresul elevului pentru a adapta planul educațional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Sesiuni disponibile
              </h2>

              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions.map((session) => (
                    <TutoringSessionCard
                      key={session.id}
                      session={session}
                      showDetails={true}
                      onSelect={() =>
                        (window.location.href = `/tutoring?session=${session.id}`)
                      }
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">
                      Acest profesor nu are sesiuni disponibile momentan.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Recenzii de la elevi
              </h2>

              <TutoringReviews
                sessionId={"teacher_" + teacherId}
                teacherName={teacher.name}
                rating={teacher.rating}
                reviews={reviews}
                onRefreshReviews={handleRefreshReviews}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
