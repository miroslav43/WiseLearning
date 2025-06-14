import { apiClient } from '@/utils/apiClient';
import { useState } from 'react';

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface FilterParams {
  status?: string;
  role?: string;
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | undefined;
}

export interface SubscriptionPlanData {
  name: string;
  description?: string;
  price: number;
  duration: string;
  features: string[];
  isActive?: boolean;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
}

export interface Review {
  id: string;
  type: 'course' | 'tutoring';
  rating: number;
  comment: string;
  status: string;
  userId: string;
  userName?: string;
  courseId?: string;
  courseTitle?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt: string;
}

/**
 * Custom hook for admin-related API calls
 */
export const useAdminService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Get dashboard statistics
   */
  const getDashboardStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch dashboard statistics');
      setError(error);
      console.error('Error fetching dashboard statistics:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get pending teacher approvals
   */
  const getPendingTeachers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/teachers/pending');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch pending teachers');
      setError(error);
      console.error('Error fetching pending teachers:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Approve a teacher
   */
  const approveTeacher = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/admin/teachers/${id}/approve`);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to approve teacher');
      setError(error);
      console.error('Error approving teacher:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Reject a teacher
   */
  const rejectTeacher = async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/admin/teachers/${id}/reject`, { reason });
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to reject teacher');
      setError(error);
      console.error('Error rejecting teacher:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get pending course approvals
   */
  const getPendingCourses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/courses/pending');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch pending courses');
      setError(error);
      console.error('Error fetching pending courses:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Approve a course
   */
  const approveCourse = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/admin/courses/${id}/approve`);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to approve course');
      setError(error);
      console.error('Error approving course:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Reject a course
   */
  const rejectCourse = async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/admin/courses/${id}/reject`, { reason });
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to reject course');
      setError(error);
      console.error('Error rejecting course:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get all users
   */
  const getAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/users');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch users');
      setError(error);
      console.error('Error fetching users:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update user role
   */
  const updateUserRole = async (id: string, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch(`/admin/users/${id}/role`, { role });
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to update user role');
      setError(error);
      console.error('Error updating user role:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get all courses
   */
  const getAllCourses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/courses');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch courses');
      setError(error);
      console.error('Error fetching courses:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all reviews
   */
  const getAllReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/admin/reviews');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch reviews');
      setError(error);
      console.error('Error fetching reviews:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a review
   */
  const deleteReview = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.delete(`/admin/reviews/${id}`);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to delete review');
      setError(error);
      console.error('Error deleting review:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getDashboardStats,
    getPendingTeachers,
    approveTeacher,
    rejectTeacher,
    getPendingCourses,
    approveCourse,
    rejectCourse,
    getAllUsers,
    updateUserRole,
    getAllCourses,
    getAllReviews,
    deleteReview
  };
};

// Dashboard
export const getDashboardStats = async () => {
  return await apiClient.get('/admin/dashboard/stats');
};

export const getRecentActivity = async () => {
  return await apiClient.get('/admin/dashboard/recent-activity');
};

export const getUserGrowthData = async (period: string = 'month') => {
  return await apiClient.get(`/admin/dashboard/user-growth?period=${period}`);
};

export const getCoursePerformance = async () => {
  return await apiClient.get('/admin/dashboard/course-performance');
};

export const getApprovalRequests = async () => {
  return await apiClient.get('/admin/dashboard/approval-requests');
};

// User Management
export const getAllUsers = async (page = 1, limit = 10, filters: FilterParams = {}) => {
  const params = { page: String(page), limit: String(limit), ...filters };
  return await apiClient.get('/admin/users', params);
};

export const updateUserStatus = async (userId: string, status: string) => {
  return await apiClient.patch(`/admin/users/${userId}/status`, { status });
};

// Teacher Management
export const getAllTeachers = async (page = 1, limit = 10, filters: FilterParams = {}) => {
  const params = { page: String(page), limit: String(limit), ...filters };
  return await apiClient.get('/admin/teachers', params);
};

export const approveTeacher = async (teacherId: string) => {
  return await apiClient.post(`/admin/teachers/${teacherId}/approve`);
};

export const rejectTeacher = async (teacherId: string, reason: string) => {
  return await apiClient.post(`/admin/teachers/${teacherId}/reject`, { reason });
};

// Course Management
export const getAllCourses = async (page = 1, limit = 10, filters: FilterParams = {}) => {
  const params = { page: String(page), limit: String(limit), ...filters };
  return await apiClient.get('/admin/courses', params);
};

export const approveCourse = async (courseId: string) => {
  return await apiClient.post(`/admin/courses/${courseId}/approve`);
};

export const rejectCourse = async (courseId: string, reason: string) => {
  return await apiClient.post(`/admin/courses/${courseId}/reject`, { reason });
};

// Review Management
export const updateReviewStatus = async (reviewId: string, status: string) => {
  return await apiClient.patch(`/admin/reviews/${reviewId}/status`, { status });
};

// Blog Management
export const getAllBlogPosts = async (page = 1, limit = 10, filters: FilterParams = {}) => {
  const params = { page: String(page), limit: String(limit), ...filters };
  return await apiClient.get('/admin/blog', params);
};

export const updateBlogPostStatus = async (postId: string, status: string) => {
  return await apiClient.patch(`/admin/blog/${postId}/status`, { status });
};

// Subscriptions
export const getAllSubscriptionPlans = async () => {
  return await apiClient.get('/admin/subscription-plans');
};

export const createSubscriptionPlan = async (planData: SubscriptionPlanData) => {
  return await apiClient.post('/admin/subscription-plans', planData);
};

export const updateSubscriptionPlan = async (planId: string, planData: SubscriptionPlanData) => {
  return await apiClient.put(`/admin/subscription-plans/${planId}`, planData);
};

export const deleteSubscriptionPlan = async (planId: string) => {
  return await apiClient.delete(`/admin/subscription-plans/${planId}`);
};

export const getSubscriptionStats = async () => {
  return await apiClient.get('/admin/subscription-stats');
};

export const getAllReviews = async (page = 1, limit = 10, filters: FilterParams = {}) => {
  const params = { page: String(page), limit: String(limit), ...filters };
  return await apiClient.get('/admin/reviews', params);
}; 