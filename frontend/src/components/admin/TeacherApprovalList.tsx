import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { CheckIcon, X } from "lucide-react";
import React, { useState } from "react";

const TeacherApprovalList: React.FC = () => {
  const {
    pendingTeachers,
    isLoadingTeachers,
    teachersError,
    approveTeacher,
    rejectTeacher,
    refreshTeachers,
  } = useAdminContext();

  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleApprove = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      await approveTeacher(id);
    } catch (err) {
      console.error("Failed to approve teacher:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      await rejectTeacher(id, "Respins de admin");
    } catch (err) {
      console.error("Failed to reject teacher:", err);
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  if (isLoadingTeachers) {
    return <AdminLoadingState type="table" rowCount={5} columnCount={4} />;
  }

  if (teachersError) {
    return (
      <AdminErrorState
        title="Eroare la încărcarea datelor"
        message="Nu am putut încărca lista profesorilor în așteptare. Încearcă din nou."
        error={teachersError}
        onRetry={refreshTeachers}
      />
    );
  }

  if (!pendingTeachers || pendingTeachers.length === 0) {
    return (
      <AdminEmptyState
        title="Nu există cereri în așteptare"
        description="Nu există cereri de aprobare a profesorilor în așteptare."
        showRefresh={true}
        onRefresh={refreshTeachers}
      />
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profesor</TableHead>
            <TableHead>Specializare</TableHead>
            <TableHead>Data cererii</TableHead>
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={teacher.avatar || teacher.profileImage}
                      alt={`${teacher.firstName || ""} ${
                        teacher.lastName || ""
                      }`}
                    />
                    <AvatarFallback>
                      {teacher.firstName?.[0] || teacher.name?.[0] || ""}
                      {teacher.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {teacher.firstName && teacher.lastName
                        ? `${teacher.firstName} ${teacher.lastName}`
                        : teacher.name || "Profesor"}
                    </div>
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
              <TableCell>
                {new Date(
                  teacher.appliedAt || teacher.createdAt
                ).toLocaleDateString("ro-RO")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(teacher.id)}
                    disabled={processingIds.includes(teacher.id)}
                  >
                    <CheckIcon className="h-4 w-4" />
                    Aprobă
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(teacher.id)}
                    disabled={processingIds.includes(teacher.id)}
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

export default TeacherApprovalList;
