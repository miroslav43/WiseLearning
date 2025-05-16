import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth";
import * as authService from "@/services/authService";
import { Teacher, User, UserRole } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserData: (updates: Partial<User>) => Promise<void>;
  updateTeacherProfile: (teacherData: Partial<Teacher>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUserData: async () => {},
  updateTeacherProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user on init
    const loadUser = async () => {
      if (checkIsAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to load user:", error);
          // If we get an error, the token might be invalid
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      const newUser = await authService.register({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserData = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await authService.updateUserProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  const updateTeacherProfile = async (teacherData: Partial<Teacher>) => {
    if (!user || user.role !== "teacher") return;

    try {
      // We'll use the same updateUserProfile endpoint with the teacher-specific data
      const updatedUser = await authService.updateUserProfile(teacherData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update teacher profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUserData,
        updateTeacherProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
