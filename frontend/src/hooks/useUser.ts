import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook that provides user information and role-based helpers
 * @returns User information and role-based helpers
 */
export const useUser = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    loading,
    isStudent: isAuthenticated && user?.role === 'student',
    isTeacher: isAuthenticated && user?.role === 'teacher',
    isAdmin: isAuthenticated && user?.role === 'admin',
    hasRole: (role: string) => isAuthenticated && user?.role === role,
  };
};

export default useUser; 