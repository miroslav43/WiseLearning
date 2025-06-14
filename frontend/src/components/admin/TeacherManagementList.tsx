import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getAllTeachers, updateUserStatus } from "@/services/adminService";
import { AlertCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Teacher {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  avatar?: string;
  specialization?: string[];
  courses?: number;
  students?: number;
  rating?: number;
  isActive: boolean;
  canPublish?: boolean;
}

const TeacherManagementList: React.FC = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTeachers();
  }, [currentPage]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getAllTeachers(currentPage, itemsPerPage);

      if (response && Array.isArray(response.data)) {
        // Transform API response to match our component's expected format
        const transformedTeachers = response.data.map((teacher) => ({
          id: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          name:
            teacher.firstName && teacher.lastName
              ? `${teacher.firstName} ${teacher.lastName}`
              : undefined,
          email: teacher.email,
          avatar: teacher.avatar,
          specialization: teacher.specialization || [],
          courses: teacher.courses || 0,
          students: teacher.students || 0,
          rating: teacher.rating || 0,
          isActive: teacher.status === "active",
          canPublish: teacher.canPublish,
        }));

        setTeachers(transformedTeachers);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalTeachers(response.pagination?.totalItems || 0);
      } else {
        setTeachers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Failed to load teachers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      const newStatus = currentStatus ? "inactive" : "active";

      await updateUserStatus(id, newStatus);

      // Update local state
      setTeachers(
        teachers.map((teacher) => {
          if (teacher.id === id) {
            return { ...teacher, isActive: !teacher.isActive };
          }
          return teacher;
        })
      );

      toast({
        title:
          newStatus === "active" ? "Profesor activat" : "Profesor dezactivat",
        description: `Profesorul a fost ${
          newStatus === "active" ? "activat" : "dezactivat"
        } cu succes.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to update teacher status:", err);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul profesorului.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);

      // This would need a new API endpoint to toggle publishing permissions
      // For now we'll just update the local state
      setTeachers(
        teachers.map((teacher) => {
          if (teacher.id === id) {
            const updated = { ...teacher, canPublish: !teacher.canPublish };
            return updated;
          }
          return teacher;
        })
      );

      // Simulating API call success
      setTimeout(() => {
        toast({
          title: teachers.find((t) => t.id === id)?.canPublish
            ? "Permisiune de publicare revocată"
            : "Permisiune de publicare acordată",
          description: teachers.find((t) => t.id === id)?.canPublish
            ? "Profesorul nu mai poate publica cursuri."
            : "Profesorul poate acum să publice cursuri.",
          variant: "default",
        });
        setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
      }, 500);
    } catch (err) {
      console.error("Failed to update publishing permission:", err);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza permisiunea de publicare.",
        variant: "destructive",
      });
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTeacherName = (teacher: Teacher) => {
    if (teacher.name) return teacher.name;
    if (teacher.firstName || teacher.lastName)
      return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
    return "Necunoscut";
  };

  if (loading && teachers.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md mb-4">
        <p className="text-muted-foreground">
          Total profesori: {totalTeachers}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profesor</TableHead>
            <TableHead>Specializare</TableHead>
            <TableHead className="text-center">Cursuri</TableHead>
            <TableHead className="text-center">Studenți</TableHead>
            <TableHead className="text-center">Rating</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Publicare</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={teacher.avatar}
                      alt={getTeacherName(teacher)}
                    />
                    <AvatarFallback>
                      {teacher.firstName?.[0] || ""}
                      {teacher.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{getTeacherName(teacher)}</div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialization &&
                  teacher.specialization.length > 0 ? (
                    teacher.specialization.map((spec) => (
                      <Badge key={spec} variant="outline">
                        {spec}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Nicio specializare
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {teacher.courses || 0}
              </TableCell>
              <TableCell className="text-center">
                {teacher.students || 0}
              </TableCell>
              <TableCell className="text-center">
                {teacher.rating || 0}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch
                    checked={teacher.isActive}
                    disabled={processingIds.includes(teacher.id)}
                    onCheckedChange={() =>
                      handleToggleActive(teacher.id, teacher.isActive)
                    }
                  />
                  {processingIds.includes(teacher.id) && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch
                    checked={teacher.canPublish || false}
                    disabled={processingIds.includes(teacher.id)}
                    onCheckedChange={() => handleTogglePublish(teacher.id)}
                  />
                  {processingIds.includes(teacher.id) && (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}

          {teachers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                Nu există profesori de afișat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
};

export default TeacherManagementList;
