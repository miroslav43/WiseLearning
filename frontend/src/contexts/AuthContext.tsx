import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth";
import * as authService from "@/services/authService";
import { Teacher, User, UserRole } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserData: (updates: Partial<User>) => Promise<void>;
  updateTeacherProfile: (teacherData: Partial<Teacher>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiToken, setApiToken] = useState("");

  // Helper function to apply getters to user object
  const applyUserGetters = (userData: User) => {
    // Parse name into firstName and lastName if they don't exist
    let firstName = "";
    let lastName = "";

    if (userData.name && userData.name !== "undefined undefined") {
      const nameParts = userData.name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    // Add computed properties without setters to avoid infinite loops
    Object.defineProperties(userData, {
      firstName: {
        get: function () {
          if (this.name && this.name !== "undefined undefined") {
            return this.name.split(" ")[0] || "";
          }
          return "";
        },
        configurable: true,
        enumerable: true,
      },
      lastName: {
        get: function () {
          if (this.name && this.name !== "undefined undefined") {
            const nameParts = this.name.split(" ");
            return nameParts.slice(1).join(" ") || "";
          }
          return "";
        },
        configurable: true,
        enumerable: true,
      },
    });

    return userData;
  };

  useEffect(() => {
    // Load user on init
    const loadUser = async () => {
      if (checkIsAuthenticated()) {
        setIsAuthenticated(true);
        try {
          const currentUser = await authService.getCurrentUser();
          // Apply the same getters as in setAuthenticatedUser
          setUser(applyUserGetters(currentUser));
        } catch (error) {
          console.error("Failed to load user:", error);
          // If we get an error, the token might be invalid
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authResponse = await authService.login({ email, password });
      setAuthenticatedUser(authResponse.user, authResponse.token);
      return true;
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
      const authResponse = await authService.register({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setAuthenticatedUser(authResponse.user, authResponse.token);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setApiToken("");
  };

  const updateUserData = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await authService.updateUserProfile(updates);
      // Apply the same getters as in setAuthenticatedUser
      setUser(applyUserGetters(updatedUser));
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
      // Apply the same getters as in setAuthenticatedUser
      setUser(applyUserGetters(updatedUser));
    } catch (error) {
      console.error("Failed to update teacher profile:", error);
      throw error;
    }
  };

  // Set the user with the received data
  const setAuthenticatedUser = (userData: User, token: string) => {
    // Add computed properties for name and avatar
    const updatedUser = applyUserGetters(userData);

    setUser(updatedUser);
    setIsAuthenticated(true);
    setApiToken(token);
    localStorage.setItem("wiselearning_auth_token", token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        updateUserData,
        updateTeacherProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
