import { useToast } from "@/hooks/use-toast";
import * as pointsService from "@/services/pointsService";
import { PointsPackage } from "@/services/pointsService";
import { Achievement, PointsTransaction } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface PointsContextType {
  points: number;
  transactions: PointsTransaction[];
  achievements: Achievement[];
  addPoints: (
    amount: number,
    type: "purchase" | "referral" | "achievement",
    description: string
  ) => Promise<void>;
  deductPoints: (amount: number, description: string) => Promise<boolean>;
  hasEnoughPoints: (amount: number) => boolean;
  completeAchievement: (achievementId: string) => void;
  formatPoints: (points: number | undefined | null) => string;
  isLoading: boolean;
  refreshPoints: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  transactions: [],
  achievements: [],
  addPoints: async () => {},
  deductPoints: async () => false,
  hasEnoughPoints: () => false,
  completeAchievement: () => {},
  formatPoints: () => "",
  isLoading: false,
  refreshPoints: async () => {},
  refreshTransactions: async () => {},
});

export const usePoints = () => useContext(PointsContext);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const { toast } = useToast();
  const [points, setPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsPackages, setPointsPackages] = useState<PointsPackage[]>([]);

  // Load data from API on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshPoints(),
        refreshTransactions(),
        refreshPackages(),
      ]);
    } catch (error) {
      console.error("Error refreshing points data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPoints = async () => {
    try {
      const response = await pointsService.getMyPoints();
      // Handle case where API returns undefined or unexpected structure
      const pointsValue = response?.data?.points ?? user?.points ?? 0;
      setPoints(pointsValue);

      // Don't call updateUserData here as it causes infinite loop
      // The points will be updated in the user context when needed

      return pointsValue;
    } catch (error) {
      console.error("Error fetching points balance:", error);
      // If API fails, use points from user object as fallback
      const fallbackPoints = user?.points ?? 0;
      setPoints(fallbackPoints);
      return fallbackPoints;
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await pointsService.getMyTransactions();
      const transactionData = response?.data ?? [];
      setTransactions(transactionData);
      return transactionData;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return transactions;
    }
  };

  const refreshPackages = async () => {
    try {
      const response = await pointsService.getPointsPackages();
      // Handle case where API returns undefined or unexpected structure
      const packagesData = response?.data ?? [];
      // Only show active packages to users, but handle case where packagesData is not an array
      const activePackages = Array.isArray(packagesData)
        ? packagesData.filter((pkg) => pkg.active)
        : [];
      setPointsPackages(activePackages);
      return packagesData;
    } catch (error) {
      console.error("Error fetching points packages:", error);
      setPointsPackages([]);
      return [];
    }
  };

  const addPoints = async (
    amount: number,
    type: "purchase" | "referral" | "achievement",
    description: string
  ) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Trebuie să fii autentificat",
        description: "Pentru a gestiona punctele, trebuie să ai un cont.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await pointsService.addPoints(amount, type, description);

      // Update local state directly instead of calling refreshPoints
      setPoints((prev) => prev + amount);
      setTransactions((prev) => [response.data, ...prev]);

      toast({
        title: "Puncte adăugate",
        description: `Ai primit ${amount} puncte: ${description}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding points:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut adăuga punctele. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    }
  };

  const deductPoints = async (
    amount: number,
    description: string
  ): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Trebuie să fii autentificat",
        description: "Pentru a cheltui puncte, trebuie să ai un cont.",
        variant: "destructive",
      });
      return false;
    }

    if (points < amount) {
      toast({
        title: "Puncte insuficiente",
        description: `Ai nevoie de ${amount} puncte, dar ai doar ${points}.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await pointsService.deductPoints(
        amount,
        "course_purchase",
        description
      );

      // Update local state directly instead of calling refreshPoints
      setPoints((prev) => prev - amount);
      setTransactions((prev) => [response.data, ...prev]);

      toast({
        title: "Puncte utilizate",
        description: `Ai folosit ${amount} puncte pentru: ${description}`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error("Error deducting points:", error);
      toast({
        title: "Eroare",
        description:
          "Nu am putut utiliza punctele. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
      return false;
    }
  };

  const hasEnoughPoints = (amount: number): boolean => {
    return points >= amount;
  };

  const completeAchievement = (achievementId: string) => {
    // Find achievement in the list
    const achievement = achievements.find((a) => a.id === achievementId);

    if (!achievement || achievement.completed) {
      return;
    }

    // In a real app, you'd call an API endpoint to mark achievement as completed
    // For demo, we'll just update local state
    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, completed: true } : a))
    );

    // Add points
    addPoints(
      achievement.pointsReward,
      "achievement",
      `Achievement completed: ${achievement.title}`
    );

    toast({
      title: "Realizare completată!",
      description: `Ai obținut ${achievement.title} și ai primit ${achievement.pointsReward} puncte!`,
      variant: "default",
    });
  };

  const formatPoints = (points: number | undefined | null): string => {
    if (points === undefined || points === null) return "0";
    return points.toLocaleString("ro-RO");
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        transactions,
        achievements,
        addPoints,
        deductPoints,
        hasEnoughPoints,
        completeAchievement,
        formatPoints,
        isLoading,
        refreshPoints,
        refreshTransactions,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};
