import { useToast } from "@/components/ui/use-toast";
import { useAdminService } from "@/services/adminService";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Types for the admin context
interface AdminContextType {
  // Dashboard state
  stats: {
    totalUsers: number;
    totalCourses: number;
    approvedTeachers: number;
    pendingCourses: number;
    newUsersData: Array<{ name: string; value: number }>;
    teacherStatusData: Array<{ name: string; value: number; color: string }>;
  };
  isLoadingStats: boolean;
  statsError: Error | null;

  // Teacher approval state
  pendingTeachers: any[];
  isLoadingTeachers: boolean;
  teachersError: Error | null;

  // Course approval state
  pendingCourses: any[];
  isLoadingCourses: boolean;
  coursesError: Error | null;

  // User management state
  users: any[];
  isLoadingUsers: boolean;
  usersError: Error | null;

  // Actions
  approveTeacher: (id: string) => Promise<void>;
  rejectTeacher: (id: string, reason: string) => Promise<void>;
  approveCourse: (id: string) => Promise<void>;
  rejectCourse: (id: string, reason: string) => Promise<void>;
  updateUserRole: (id: string, role: string) => Promise<void>;

  // Refresh functions
  refreshStats: () => Promise<void>;
  refreshTeachers: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const adminService = useAdminService();
  const { toast } = useToast();

  // Dashboard stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    approvedTeachers: 0,
    pendingCourses: 0,
    newUsersData: [],
    teacherStatusData: [
      { name: "Aprobați", value: 0, color: "#10b981" },
      { name: "În așteptare", value: 0, color: "#f59e0b" },
      { name: "Respinși", value: 0, color: "#ef4444" },
    ],
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<Error | null>(null);

  // Teacher approval state
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [teachersError, setTeachersError] = useState<Error | null>(null);

  // Course approval state
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<Error | null>(null);

  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<Error | null>(null);

  // Load initial data
  useEffect(() => {
    refreshStats();
    refreshTeachers();
    refreshCourses();
    refreshUsers();
  }, []);

  // Refresh dashboard stats
  const refreshStats = async () => {
    setIsLoadingStats(true);
    setStatsError(null);

    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setStatsError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch dashboard stats")
      );
      toast({
        title: "Error",
        description:
          "Failed to load dashboard statistics. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Refresh pending teachers
  const refreshTeachers = async () => {
    setIsLoadingTeachers(true);
    setTeachersError(null);

    try {
      const response = await adminService.getPendingTeachers();
      setPendingTeachers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch pending teachers:", err);
      setTeachersError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch pending teachers")
      );
      toast({
        title: "Error",
        description:
          "Failed to load pending teacher approvals. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  // Refresh pending courses
  const refreshCourses = async () => {
    setIsLoadingCourses(true);
    setCoursesError(null);

    try {
      const response = await adminService.getPendingCourses();
      setPendingCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch pending courses:", err);
      setCoursesError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch pending courses")
      );
      toast({
        title: "Error",
        description:
          "Failed to load pending course approvals. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Refresh users
  const refreshUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);

    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsersError(
        err instanceof Error ? err : new Error("Failed to fetch users")
      );
      toast({
        title: "Error",
        description: "Failed to load users. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Approve teacher
  const approveTeacher = async (id: string) => {
    try {
      await adminService.approveTeacher(id);
      setPendingTeachers(
        pendingTeachers.filter((teacher) => teacher.id !== id)
      );
      toast({
        title: "Teacher approved",
        description: "The teacher has been approved successfully.",
        variant: "default",
      });
      refreshStats(); // Update dashboard stats
    } catch (err) {
      console.error("Failed to approve teacher:", err);
      toast({
        title: "Error",
        description: "Failed to approve teacher. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Reject teacher
  const rejectTeacher = async (id: string, reason: string) => {
    try {
      await adminService.rejectTeacher(id, reason);
      setPendingTeachers(
        pendingTeachers.filter((teacher) => teacher.id !== id)
      );
      toast({
        title: "Teacher rejected",
        description: "The teacher has been rejected.",
        variant: "default",
      });
      refreshStats(); // Update dashboard stats
    } catch (err) {
      console.error("Failed to reject teacher:", err);
      toast({
        title: "Error",
        description: "Failed to reject teacher. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Approve course
  const approveCourse = async (id: string) => {
    try {
      await adminService.approveCourse(id);
      setPendingCourses(pendingCourses.filter((course) => course.id !== id));
      toast({
        title: "Course approved",
        description: "The course has been approved successfully.",
        variant: "default",
      });
      refreshStats(); // Update dashboard stats
    } catch (err) {
      console.error("Failed to approve course:", err);
      toast({
        title: "Error",
        description: "Failed to approve course. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Reject course
  const rejectCourse = async (id: string, reason: string) => {
    try {
      await adminService.rejectCourse(id, reason);
      setPendingCourses(pendingCourses.filter((course) => course.id !== id));
      toast({
        title: "Course rejected",
        description: "The course has been rejected.",
        variant: "default",
      });
      refreshStats(); // Update dashboard stats
    } catch (err) {
      console.error("Failed to reject course:", err);
      toast({
        title: "Error",
        description: "Failed to reject course. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update user role
  const updateUserRole = async (id: string, role: string) => {
    try {
      const updatedUser = await adminService.updateUserRole(id, role);
      setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
      toast({
        title: "User role updated",
        description: `User role has been updated to ${role}.`,
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to update user role:", err);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const contextValue: AdminContextType = {
    // State
    stats,
    isLoadingStats,
    statsError,
    pendingTeachers,
    isLoadingTeachers,
    teachersError,
    pendingCourses,
    isLoadingCourses,
    coursesError,
    users,
    isLoadingUsers,
    usersError,

    // Actions
    approveTeacher,
    rejectTeacher,
    approveCourse,
    rejectCourse,
    updateUserRole,

    // Refresh functions
    refreshStats,
    refreshTeachers,
    refreshCourses,
    refreshUsers,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }

  return context;
};
