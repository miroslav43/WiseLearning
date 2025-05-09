
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { PointsTransaction, Achievement } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface PointsContextType {
  points: number;
  transactions: PointsTransaction[];
  achievements: Achievement[];
  addPoints: (amount: number, type: 'purchase' | 'referral' | 'achievement', description: string) => void;
  deductPoints: (amount: number, description: string) => Promise<boolean>;
  hasEnoughPoints: (amount: number) => boolean;
  buyPointsPackage: (packageId: string) => void;
  completeAchievement: (achievementId: string) => void;
  formatPoints: (points: number | undefined | null) => string;
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  transactions: [],
  achievements: [],
  addPoints: () => {},
  deductPoints: async () => false,
  hasEnoughPoints: () => false,
  buyPointsPackage: () => {},
  completeAchievement: () => {},
  formatPoints: () => '',
});

export const usePoints = () => useContext(PointsContext);

// Mock points packages
export const pointsPackages = [
  { id: 'package-1', points: 500, price: 49, discounted: false },
  { id: 'package-2', points: 1000, price: 89, discounted: false },
  { id: 'package-3', points: 2500, price: 199, discounted: true, originalPrice: 249 },
  { id: 'package-4', points: 5000, price: 379, discounted: true, originalPrice: 499 },
];

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const { toast } = useToast();
  const [points, setPoints] = useState<number>(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Load points data from localStorage on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, these would come from the user object or API
      // For now, we'll use localStorage to simulate persistence
      const savedPoints = localStorage.getItem(`userPoints-${user.id}`);
      const savedTransactions = localStorage.getItem(`userTransactions-${user.id}`);
      
      if (savedPoints) {
        setPoints(parseInt(savedPoints, 10));
      } else {
        // Default starting points
        setPoints(user.points || 500);
        localStorage.setItem(`userPoints-${user.id}`, String(user.points || 500));
      }
      
      if (savedTransactions) {
        try {
          const parsedTransactions = JSON.parse(savedTransactions);
          // Convert string dates back to Date objects
          const fixedTransactions = parsedTransactions.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt)
          }));
          setTransactions(fixedTransactions);
        } catch (error) {
          console.error('Failed to parse transactions:', error);
          setTransactions(user.pointsHistory || []);
        }
      } else {
        // Use transactions from user object
        setTransactions(user.pointsHistory || []);
        localStorage.setItem(`userTransactions-${user.id}`, JSON.stringify(user.pointsHistory || []));
      }
      
      // Set achievements from user
      setAchievements(user.achievements || []);
    }
  }, [isAuthenticated, user]);
  
  // Save points data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`userPoints-${user.id}`, points.toString());
      localStorage.setItem(`userTransactions-${user.id}`, JSON.stringify(transactions));
    }
  }, [points, transactions, isAuthenticated, user]);
  
  const addPoints = (amount: number, type: 'purchase' | 'referral' | 'achievement', description: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Trebuie să fii autentificat",
        description: "Pentru a gestiona punctele, trebuie să ai un cont.",
        variant: "destructive",
      });
      return;
    }
    
    const newTransaction: PointsTransaction = {
      id: uuidv4(),
      userId: user.id,
      amount,
      type,
      description,
      createdAt: new Date(),
    };
    
    const newPoints = points + amount;
    setPoints(newPoints);
    
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    
    // Update user data in AuthContext
    updateUserData({
      points: newPoints,
      pointsHistory: newTransactions
    });
    
    toast({
      title: "Puncte adăugate",
      description: `Ai primit ${amount} puncte: ${description}`,
      variant: "default",
    });
  };
  
  const deductPoints = async (amount: number, description: string): Promise<boolean> => {
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
    
    const newTransaction: PointsTransaction = {
      id: uuidv4(),
      userId: user.id,
      amount: -amount,
      type: 'course_purchase',
      description,
      createdAt: new Date(),
    };
    
    const newPoints = points - amount;
    setPoints(newPoints);
    
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    
    // Update user data in AuthContext
    updateUserData({
      points: newPoints,
      pointsHistory: newTransactions
    });
    
    toast({
      title: "Puncte utilizate",
      description: `Ai folosit ${amount} puncte: ${description}`,
      variant: "default",
    });
    
    return true;
  };
  
  const hasEnoughPoints = (amount: number): boolean => {
    return (points || 0) >= (amount || 0);
  };
  
  const buyPointsPackage = (packageId: string) => {
    const pkg = pointsPackages.find(p => p.id === packageId);
    if (!pkg) return;
    
    // In a real app, this would trigger a payment flow
    // For demonstration, we'll just add the points
    addPoints(pkg.points, 'purchase', `Pachet de ${pkg.points} puncte`);
  };
  
  const completeAchievement = (achievementId: string) => {
    if (!isAuthenticated || !user || !user.achievements) return;
    
    const achievementIndex = user.achievements.findIndex(a => a.id === achievementId);
    if (achievementIndex === -1) return;
    
    const achievement = user.achievements[achievementIndex];
    
    // Skip if already completed
    if (achievement.completed) return;
    
    // Mark achievement as completed
    const updatedAchievement: Achievement = {
      ...achievement,
      completed: true,
      completedAt: new Date(),
      progress: 100
    };
    
    // Update achievements array
    const updatedAchievements = [...user.achievements];
    updatedAchievements[achievementIndex] = updatedAchievement;
    
    // Update state
    setAchievements(updatedAchievements);
    
    // Add points reward if applicable
    if (updatedAchievement.pointsRewarded > 0) {
      addPoints(
        updatedAchievement.pointsRewarded, 
        'achievement', 
        `Realizare: ${updatedAchievement.name}`
      );
    } else {
      // Update the user data without adding points
      updateUserData({
        achievements: updatedAchievements
      });
      
      // Show achievement unlock notification
      toast({
        title: "Realizare deblocată!",
        description: `${updatedAchievement.name}: ${updatedAchievement.description}`,
        variant: "default",
      });
    }
  };
  
  const formatPoints = (points: number | undefined | null): string => {
    if (points === undefined || points === null) {
      return '0';
    }
    return points.toLocaleString('ro-RO');
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
        buyPointsPackage,
        completeAchievement,
        formatPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};
