import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getAllCourses } from "@/services/adminService";
import { AlertCircle, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CourseTableItem {
  id: string;
  title: string;
  subject: string;
  teacherId?: string;
  teacher: string;
  status: string;
  students: number;
  price: number;
  createdAt: string;
}

export default function CourseManagement() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseTableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadCourses();
  }, [currentPage]);

  const loadCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllCourses(currentPage, itemsPerPage);

      if (response && Array.isArray(response.data)) {
        // Transform the data for the table
        const transformedCourses = response.data.map((course) => ({
          id: course.id,
          title: course.title,
          subject: course.subject,
          teacherId: course.teacherId,
          teacher: course.teacherName || "Unknown",
          status: course.status,
          students: course.students || 0,
          price: course.price || 0,
          createdAt: new Date(course.createdAt).toLocaleDateString(),
        }));

        setCourses(transformedCourses);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCourses(response.pagination?.totalItems || 0);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Nu am putut încărca cursurile. Te rugăm să încerci din nou.");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-2">Se încarcă cursurile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-500">{error}</p>
        <Button variant="link" onClick={() => loadCourses()}>
          Încearcă din nou
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Management Cursuri</h2>
          <p className="text-muted-foreground">Total cursuri: {totalCourses}</p>
        </div>
        <Button variant="default">Adaugă Curs Nou</Button>
      </div>

      <div className="border rounded-md overflow-hidden">
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
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      asChild
                    >
                      <Link to={`/courses/${course.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nu există cursuri de afișat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
