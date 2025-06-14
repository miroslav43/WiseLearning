import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
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
import { useAdminContext } from "@/contexts/AdminContext";
import { Subject } from "@/types/course";
import { getSubjectLabel } from "@/utils/subjectUtils";
import { CheckIcon, Eye, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CourseApprovalList: React.FC = () => {
  const {
    pendingCourses,
    isLoadingCourses,
    coursesError,
    approveCourse,
    rejectCourse,
    refreshCourses,
  } = useAdminContext();

  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleApprove = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      await approveCourse(id);
    } catch (err) {
      console.error("Failed to approve course:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      await rejectCourse(id, "Respins de admin");
    } catch (err) {
      console.error("Failed to reject course:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  if (isLoadingCourses) {
    return <AdminLoadingState type="table" rowCount={5} columnCount={6} />;
  }

  if (coursesError) {
    return (
      <AdminErrorState
        title="Eroare la încărcarea datelor"
        message="Nu am putut încărca lista cursurilor în așteptare. Încearcă din nou."
        error={coursesError}
        onRetry={refreshCourses}
      />
    );
  }

  if (!pendingCourses || pendingCourses.length === 0) {
    return (
      <AdminEmptyState
        title="Nu există cursuri în așteptare"
        description="Nu există cursuri în așteptare pentru aprobare."
        showRefresh={true}
        onRefresh={refreshCourses}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curs</TableHead>
            <TableHead>Profesor</TableHead>
            <TableHead>Materie</TableHead>
            <TableHead>Preț</TableHead>
            <TableHead>Data cererii</TableHead>
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingCourses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <div className="font-medium">{course.title}</div>
              </TableCell>
              <TableCell>
                {course.teacherName || course.author || "Necunoscut"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {course.subject
                    ? getSubjectLabel(course.subject as Subject)
                    : course.category || "Necunoscută"}
                </Badge>
              </TableCell>
              <TableCell>
                {course.price ? `${course.price} lei` : "Gratuit"}
              </TableCell>
              <TableCell>
                {new Date(course.createdAt).toLocaleDateString("ro-RO")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Vezi curs</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(course.id)}
                    disabled={processingIds.includes(course.id)}
                  >
                    <CheckIcon className="h-4 w-4" />
                    Aprobă
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(course.id)}
                    disabled={processingIds.includes(course.id)}
                  >
                    <X className="h-4 w-4" />
                    Respinge
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseApprovalList;
