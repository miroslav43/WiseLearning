import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/apiClient";
import {
  BarChart,
  BookOpen,
  FileText,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CourseStats {
  id: string;
  title: string;
  students: number;
  activeWeek: number;
  totalWeeks: number;
  completionRate: number;
}

interface DashboardStats {
  coursesCount: number;
  studentsCount: number;
  assignmentsCount: number;
  reviewsCount: number;
}

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    coursesCount: 0,
    studentsCount: 0,
    assignmentsCount: 0,
    reviewsCount: 0,
  });
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip the API calls if user is not a teacher
    if (!user || user.role !== "teacher") return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be separate API calls
        // Here we'll use Promise.all to fetch all data in parallel
        const [
          statsResponse,
          coursesResponse,
          activitiesResponse,
          reviewsResponse,
        ] = await Promise.all([
          apiClient.get<DashboardStats>("/users/teacher/dashboard/stats"),
          apiClient.get<CourseStats[]>("/users/teacher/dashboard/courses"),
          apiClient.get<any[]>("/users/teacher/dashboard/activities"),
          apiClient.get<any[]>("/users/teacher/dashboard/reviews"),
        ]);

        setStats(statsResponse);
        setCourseStats(coursesResponse);
        setRecentActivities(activitiesResponse);
        setRecentReviews(reviewsResponse);
      } catch (error) {
        console.error("Failed to fetch teacher dashboard data:", error);
        toast({
          title: "Eroare",
          description:
            "Nu am putut încărca datele pentru tabloul de bord. Încearcă din nou mai târziu.",
          variant: "destructive",
        });

        // Fallback to mock data if API fails
        setStats({
          coursesCount: 5,
          studentsCount: 127,
          assignmentsCount: 12,
          reviewsCount: 32,
        });
        setCourseStats([
          {
            id: "1",
            title: "Informatică: Algoritmi",
            students: 45,
            activeWeek: 8,
            totalWeeks: 12,
            completionRate: 66,
          },
          {
            id: "2",
            title: "Informatică: Baze de date",
            students: 32,
            activeWeek: 4,
            totalWeeks: 10,
            completionRate: 40,
          },
          {
            id: "3",
            title: "Programare web",
            students: 28,
            activeWeek: 3,
            totalWeeks: 8,
            completionRate: 37,
          },
        ]);
        // Mock activities and reviews will remain empty arrays
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  if (!user || user.role !== "teacher") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tablou de bord profesor</h1>
          <p>
            Trebuie să fii autentificat ca profesor pentru a accesa această
            pagină.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600 mr-2" />
          <span>Se încarcă tabloul de bord...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tablou de bord</h1>
        <Button asChild className="gap-2">
          <Link to="/my-courses/create">
            <Plus className="h-4 w-4" />
            <span>Curs nou</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursuri active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.coursesCount}</div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Studenți înscriși
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.studentsCount}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Teme active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.assignmentsCount}</div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recenzii primite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.reviewsCount}</div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Statistici cursuri</CardTitle>
          <CardDescription>
            Progresul studenților pe cursurile tale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {courseStats.length > 0 ? (
              courseStats.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{course.title}</h3>
                      <div className="text-xs text-muted-foreground">
                        Săptămâna {course.activeWeek} din {course.totalWeeks} |{" "}
                        {course.students} studenți
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {course.completionRate}%
                    </span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nu ai niciun curs activ momentan.
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button asChild variant="outline">
                <Link to="/my-courses/manage">Vezi toate cursurile</Link>
              </Button>
              <Button asChild>
                <Link to="/my-courses/create">Adaugă curs nou</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Activitate recentă</CardTitle>
            <CardDescription>
              Ultimele activități din cursurile tale
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border-l-4 border-${activity.color}-500 pl-4 py-2`}
                  >
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nu există activități recente.
              </div>
            )}
            <Button asChild variant="link" className="px-0 mt-4">
              <Link to="/my-students">Vezi toți studenții</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recenzii recente</CardTitle>
            <CardDescription>Feedback-ul primit de la studenți</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-2">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <p className="text-sm font-medium">{review.courseName}</p>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {review.studentName || "Student necunoscut"} •{" "}
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nu ai primit încă recenzii.
              </div>
            )}
            <Button asChild variant="link" className="px-0 mt-4">
              <Link to="/teacher/reviews">Vezi toate recenziile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
