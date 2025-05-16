import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { deleteCourse, fetchMyCourses } from "@/services/courseService";
import { Course } from "@/types/course";
import {
  BarChart,
  Calendar,
  Clock,
  Eye,
  FileText,
  Link,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user || user.role !== "teacher") return;

      setIsLoading(true);
      setError(null);
      try {
        const coursesData = await fetchMyCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(
          "Nu am putut încărca cursurile tale. Te rugăm să încerci din nou."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (!user || user.role !== "teacher") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cursurile mele</h1>
          <p>
            Trebuie să fii autentificat ca profesor pentru a accesa această
            pagină.
          </p>
        </div>
      </div>
    );
  }

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  );
  const draftCourses = courses.filter((course) => course.status === "draft");

  const handleDeleteClick = async (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete);
      setCourses((prev) =>
        prev.filter((course) => course.id !== courseToDelete)
      );
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error("Failed to delete course:", err);
      // Show error message
    }
  };

  // Render loading state if courses are being loaded
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cursurile mele</h1>
        <Button asChild className="gap-2">
          <RouterLink to="/my-courses/create">
            <Plus className="h-4 w-4" />
            <span>Curs nou</span>
          </RouterLink>
        </Button>
      </div>

      <Tabs defaultValue="published" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="published">Publicate</TabsTrigger>
          <TabsTrigger value="drafts">Ciorne</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <div className="space-y-6">
            {publishedCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">
                        {course.title}
                      </CardTitle>
                      <Badge className="bg-green-500">
                        {course.status === "published" ? "Publicat" : "Ciornă"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <RouterLink
                            to={`/courses/${course.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <RouterLink
                            to={`/my-courses/edit/${course.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(course.id)}
                          className="text-red-500"
                        >
                          <span className="flex items-center cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Arhivează</span>
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Studenți
                      </span>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Conținut
                      </span>
                      <div className="flex items-center mt-1">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {course.modules} module, {course.lessons} lecții
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Rating
                      </span>
                      <div className="flex items-center mt-1">
                        <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {course.rating} ({course.reviews} recenzii)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Actualizat
                      </span>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {course.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <RouterLink to={`/courses/${course.id}`}>
                      Vizualizează
                    </RouterLink>
                  </Button>
                  <Button asChild size="sm">
                    <RouterLink to={`/my-courses/edit/${course.id}`}>
                      Editează
                    </RouterLink>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {publishedCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  Nu ai niciun curs publicat
                </h3>
                <p className="text-muted-foreground mb-6">
                  Publică ciornele tale sau creează un curs nou
                </p>
                <Button asChild>
                  <RouterLink to="/my-courses/create">
                    Creează un curs
                  </RouterLink>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="space-y-6">
            {draftCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">
                        {course.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {course.status === "published" ? "Publicat" : "Ciornă"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <RouterLink
                            to={`/my-courses/edit/${course.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editează</span>
                          </RouterLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(course.id)}
                          className="text-red-500"
                        >
                          <span className="flex items-center cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Șterge</span>
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Conținut
                      </span>
                      <div className="flex items-center mt-1">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {course.modules} module, {course.lessons} lecții
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Actualizat
                      </span>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {course.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button asChild size="sm">
                    <RouterLink to={`/my-courses/edit/${course.id}`}>
                      Continuă editarea
                    </RouterLink>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {draftCourses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nu ai nicio ciornă</h3>
                <p className="text-muted-foreground mb-6">
                  Începe să creezi un nou curs
                </p>
                <Button asChild>
                  <RouterLink to="/my-courses/create">
                    Creează un curs
                  </RouterLink>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ești sigur că vrei să ștergi acest curs?</DialogTitle>
            <DialogDescription>
              Această acțiune nu poate fi anulată. Cursul va fi șters definitiv
              din contul tău.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Șterge cursul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherCoursesPage;
