import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PointsTransaction, Achievement, Certificate, Teacher } from '../types/user';
import { initializeAchievements } from '@/services/achievementService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserData: (updates: Partial<User>) => void;
  updateTeacherProfile: (teacherData: Partial<Teacher>) => void;
}

// Mock user data (would be replaced with actual authentication)
const mockUsers = [
  {
    id: '1',
    name: 'Student Demo',
    email: 'student@example.com',
    role: 'student' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=Student+Demo&background=3f7e4e&color=fff',
    createdAt: new Date(),
    enrolledCourses: ['1', '2'],
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    completedQuizzes: {'quiz-1': 100, 'quiz-2': 85},
    completedAssignments: ['assignment-1', 'assignment-2', 'assignment-3', 'assignment-4', 'assignment-5'],
    points: 1550,
    pointsHistory: [
      {
        id: 'tx-1',
        userId: '1',
        amount: 500,
        type: 'purchase',
        description: 'Puncte de bun venit',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        id: 'tx-2',
        userId: '1',
        amount: 50,
        type: 'achievement',
        description: 'Realizare: Prima lecție',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: 'tx-3',
        userId: '1',
        amount: 1000,
        type: 'purchase',
        description: 'Pachet de 1000 puncte',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
    ],
    referralCode: 'STUDENT123',
    achievements: [
      {
        id: 'first-lesson',
        name: 'Prima lecție',
        description: 'Completează prima lecție din orice curs',
        pointsRewarded: 50,
        completed: true,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        category: 'learning',
        progress: 100
      },
      {
        id: 'five-assignments',
        name: 'Tema perfectă',
        description: 'Completează 5 teme cu succes',
        pointsRewarded: 120,
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        category: 'learning',
        progress: 100
      },
      {
        id: 'perfect-quiz',
        name: 'Perfecțiune',
        description: 'Obține scorul maxim la un test',
        pointsRewarded: 100,
        completed: true,
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        category: 'mastery',
        progress: 100
      },
      {
        id: 'course-completed',
        name: 'Primul curs finalizat',
        description: 'Finalizează complet primul tău curs',
        pointsRewarded: 100,
        completed: false,
        category: 'learning',
        progress: 80
      },
      {
        id: 'three-courses',
        name: 'Pasionat de cunoaștere',
        description: 'Înscrie-te la cel puțin 3 cursuri diferite',
        pointsRewarded: 80,
        completed: false,
        category: 'learning',
        progress: 66
      },
      {
        id: 'top-quiz',
        name: 'Performanță de top',
        description: 'Obține un scor în primele 10% la un test',
        pointsRewarded: 75,
        completed: false,
        category: 'mastery',
        progress: 0
      },
      {
        id: 'daily-streak',
        name: 'Consecvență',
        description: 'Conectează-te 7 zile consecutive',
        pointsRewarded: 150,
        completed: false,
        category: 'community',
        progress: 40
      },
      {
        id: 'first-comment',
        name: 'Contribuitor',
        description: 'Lasă primul tău comentariu într-un curs',
        pointsRewarded: 25,
        completed: false,
        category: 'community',
        progress: 0
      },
      {
        id: 'share-course',
        name: 'Ambasador',
        description: 'Împărtășește un curs pe rețelele sociale',
        pointsRewarded: 50,
        completed: false,
        category: 'community',
        progress: 0
      },
    ],
    certificates: [] // Add empty certificates array
  },
  {
    id: '2',
    name: 'Teacher Demo',
    email: 'teacher@example.com',
    role: 'teacher' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=Teacher+Demo&background=3f7e4e&color=fff',
    createdAt: new Date(),
    courses: ['1', '2', '3'],
    specialization: ['mathematics', 'computer-science'],
    rating: 4.8,
    students: 120,
    points: 0,
    pointsHistory: [],
    achievements: [],
    certificates: [] // Add empty certificates array
  },
  {
    id: '3',
    name: 'Admin Demo',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=Admin+Demo&background=3f7e4e&color=fff',
    createdAt: new Date(),
    permissions: ['manage_users', 'manage_courses', 'manage_payments'],
    points: 0,
    pointsHistory: [],
    achievements: [],
    certificates: [] // Add empty certificates array
  }
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUserData: () => {},
  updateTeacherProfile: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (would be replaced with token validation)
    const savedUser = localStorage.getItem('bacUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login functionality (would be replaced with actual auth)
    setLoading(true);
    try {
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, we would validate the password here
      
      setUser(foundUser as User);
      localStorage.setItem('bacUser', JSON.stringify(foundUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Mock registration functionality (would be replaced with actual auth)
    setLoading(true);
    try {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=3f7e4e&color=fff`,
        createdAt: new Date(),
        points: 500, // Initial points for new users
        pointsHistory: [
          {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            userId: Math.random().toString(36).substr(2, 9),
            amount: 500,
            type: 'purchase' as 'purchase',
            description: 'Puncte de bun venit',
            createdAt: new Date()
          }
        ],
        referralCode: `${name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
        achievements: initializeAchievements(),
        certificates: [], // Add empty certificates array
        // Adding role-specific properties
        ...(role === 'student' ? {
          enrolledCourses: [],
          completedLessons: [],
          completedQuizzes: {},
          completedAssignments: []
        } : role === 'teacher' ? {
          courses: [],
          specialization: [],
          rating: 0,
          students: 0
        } : {
          permissions: ['view_dashboard']
        })
      };
      
      setUser(newUser as User);
      localStorage.setItem('bacUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bacUser');
  };
  
  const updateUserData = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('bacUser', JSON.stringify(updatedUser));
  };
  
  const updateTeacherProfile = (teacherData: Partial<Teacher>) => {
    if (!user || user.role !== 'teacher') return;
    
    const updatedUser = { 
      ...user, 
      ...teacherData,
      // Make sure role remains 'teacher'
      role: 'teacher' as UserRole 
    };
    
    setUser(updatedUser);
    localStorage.setItem('bacUser', JSON.stringify(updatedUser));
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUserData,
    updateTeacherProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
