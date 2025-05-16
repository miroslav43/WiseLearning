import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPublishedCourses } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseTableItem {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  status: string;
  students: number;
  price: number;
  createdAt: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<CourseTableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const coursesData = await fetchPublishedCourses();

        // Transform the data for the table
        const transformedCourses = coursesData.map((course) => ({
          id: course.id,
          title: course.title,
          subject: course.subject,
          teacher: course.teacherName || "Unknown",
          status: course.status,
          students: course.students,
          price: course.price,
          createdAt: new Date(course.createdAt).toLocaleDateString(),
        }));

        setCourses(transformedCourses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Nu am putut încărca cursurile. Te rugăm să încerci din nou.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Publicat</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">În așteptare</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Respins</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-2">Se încarcă cursurile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button variant="link" onClick={() => window.location.reload()}>
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Management Cursuri</h2>
        <Button variant="default">Adaugă Curs Nou</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titlu</TableHead>
            <TableHead>Materie</TableHead>
            <TableHead>Profesor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Studenți</TableHead>
            <TableHead>Preț (RON)</TableHead>
            <TableHead>Data Creării</TableHead>
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.subject}</TableCell>
              <TableCell>{course.teacher}</TableCell>
              <TableCell>{getStatusBadge(course.status)}</TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>{course.price}</TableCell>
              <TableCell>{course.createdAt}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Edit</span>
                  <i className="fas fa-edit"></i>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Delete</span>
                  <i className="fas fa-trash"></i>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
