import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyEnrolledCourses } from "@/services/courseService";
import { Clock, Loader2, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type CourseWithProgress = {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  teacher: string;
  lastAccessed?: Date;
  completedDate?: Date;
};

const StudentCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCourses, setActiveCourses] = useState<CourseWithProgress[]>([]);
  const [completedCourses, setCompletedCourses] = useState<
    CourseWithProgress[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user || user.role !== "student") return;

      setIsLoading(true);
      setError(null);

      try {
        const coursesData = await fetchMyEnrolledCourses();

        // Transform the data and separate into active/completed
        // This assumes the API returns progress information
        const active: CourseWithProgress[] = [];
        const completed: CourseWithProgress[] = [];

        coursesData.forEach((course) => {
          // You'll need to adjust this based on your actual API response
          const courseWithProgress = {
            id: course.id,
            title: course.title,
            description: course.description || "",
            image:
              course.image ||
              "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
            progress: course.progress || 0,
            teacher: course.teacherName || "Unknown Teacher",
            lastAccessed: course.lastAccessed
              ? new Date(course.lastAccessed)
              : undefined,
            completedDate: course.completedDate
              ? new Date(course.completedDate)
              : undefined,
          };

          if (courseWithProgress.progress >= 100) {
            completed.push(courseWithProgress);
          } else {
            active.push(courseWithProgress);
          }
        });

        setActiveCourses(active);
        setCompletedCourses(completed);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
        setError(
          "Nu am putut încărca cursurile tale. Te rugăm să încerci din nou."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (!user || user.role !== "student") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cursurile mele</h1>
          <p>
            Trebuie să fii autentificat ca student pentru a accesa această
            pagină.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <span className="ml-2">Se încarcă cursurile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Cursurile mele</h1>

      <Tabs defaultValue="active" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="active">Cursuri active</TabsTrigger>
          <TabsTrigger value="completed">Cursuri finalizate</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progres</span>
                      <span className="text-sm font-medium">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Accesat recent:{" "}
                    {course.lastAccessed?.toLocaleDateString() || "N/A"}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full gap-2">
                    <Link to={`/courses/${course.id}`}>
                      <PlayCircle className="h-4 w-4" />
                      <span>Continuă cursul</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {activeCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nu ești înscris la niciun curs
              </h3>
              <p className="text-muted-foreground mb-6">
                Înscrie-te la cursuri pentru a începe să înveți
              </p>
              <Button asChild>
                <Link to="/courses">Explorează cursuri</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Finalizat</span>
                      <span className="text-sm font-medium">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress
                      value={course.progress}
                      className="h-2 bg-green-100"
                    />
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Finalizat în:{" "}
                    {course.completedDate?.toLocaleDateString() || "N/A"}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link to={`/courses/${course.id}`}>
                      <span>Revizuiește cursul</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {completedCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nu ai finalizat niciun curs încă
              </h3>
              <p className="text-muted-foreground mb-6">
                Continuă să înveți pentru a finaliza cursurile
              </p>
              <Button asChild variant="outline">
                <Link to="/my-courses">Vezi cursurile active</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCoursesPage;
