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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, updateUserStatus } from "@/services/adminService";
import { AlertCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(currentPage, itemsPerPage);

      if (response && Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalUsers(response.pagination?.totalItems || 0);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      setProcessingIds((prev) => [...prev, userId]);
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await updateUserStatus(userId, newStatus);

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: newStatus as "active" | "inactive" | "pending",
              }
            : user
        )
      );

      toast({
        title: "Status actualizat",
        description: `Utilizatorul a fost ${
          newStatus === "active" ? "activat" : "dezactivat"
        } cu succes.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to update user status:", err);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul utilizatorului.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const getUserName = (user: User) => {
    if (user.name) return user.name;
    if (user.firstName || user.lastName)
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return "Utilizator necunoscut";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && users.length === 0) {
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
        <p className="text-muted-foreground">Total utilizatori: {totalUsers}</p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data înregistrării</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {getUserName(user)}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "destructive"
                        : user.role === "teacher"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {user.role === "admin"
                      ? "Admin"
                      : user.role === "teacher"
                      ? "Profesor"
                      : "Student"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active"
                        ? "default"
                        : user.status === "inactive"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {user.status === "active"
                      ? "Activ"
                      : user.status === "inactive"
                      ? "Inactiv"
                      : "În așteptare"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("ro-RO")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      disabled={
                        user.email === currentUser?.email ||
                        processingIds.includes(user.id) ||
                        user.status === "pending"
                      }
                    >
                      {processingIds.includes(user.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {user.status === "active" ? "Dezactivează" : "Activează"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
};

export default UserManagement;
