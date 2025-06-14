import { TutoringRequest, TutoringReview, TutoringSession } from '@/types/tutoring';
import { apiClient } from '@/utils/apiClient';
import { cleanStudentName } from '@/utils/nameUtils';
import { useCallback, useState } from 'react';

/**
 * Custom hook for tutoring-related API calls
 */
export const useTutoringService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Get all approved tutoring sessions
   */
  const getApprovedTutoringSessions = useCallback(async (): Promise<TutoringSession[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<any[]>('/tutoring');
      
      // Transform the response to match TutoringSession interface
      const transformedSessions: TutoringSession[] = response.map((session: any) => ({
        ...session,
        teacherName: session.teacher?.name || 'Unknown Teacher',
        teacherAvatar: session.teacher?.avatar || null,
        hourlyRate: session.pricePerHour,
        currency: 'RON',
        availability: session.availability?.map((slot: any) => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime ? new Date(slot.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00',
          endTime: slot.endTime ? new Date(slot.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00'
        })) || [],
        isOnline: session.locationType === 'online' || session.locationType === 'both',
        language: 'ro',
        rating: session.rating || 0,
        reviews: session.reviews?.map((review: any) => ({
          id: review.id,
          sessionId: review.sessionId,
          studentId: review.studentId,
          studentName: cleanStudentName(review.student?.name || review.studentName || 'Student necunoscut'),
          studentAvatar: review.student?.avatar || review.studentAvatar,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        })) || []
      }));
      
      return transformedSessions;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch approved tutoring sessions');
      setError(error);
      console.error('Error fetching approved tutoring sessions:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get tutoring sessions by teacher ID
   */
  const getTeacherTutoringSessions = useCallback(async (teacherId: string): Promise<TutoringSession[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<TutoringSession[]>(`/tutoring/teacher/${teacherId}`);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch teacher tutoring sessions');
      setError(error);
      console.error('Error fetching teacher tutoring sessions:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get my tutoring sessions (for the current teacher)
   */
  const getMyTutoringSessions = useCallback(async (): Promise<TutoringSession[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<TutoringSession[]>('/tutoring/my/teaching');
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch my tutoring sessions');
      setError(error);
      console.error('Error fetching my tutoring sessions:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get tutoring session by ID
   */
  const getTutoringSessionById = useCallback(async (sessionId: string): Promise<TutoringSession> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<any>(`/tutoring/${sessionId}`);
      
      // Transform the response to match TutoringSession interface
      const transformedSession: TutoringSession = {
        ...response,
        teacherName: response.teacher?.name || 'Unknown Teacher',
        teacherAvatar: response.teacher?.avatar || null,
        hourlyRate: response.pricePerHour,
        currency: 'RON',
        availability: response.availability?.map((slot: any) => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime ? new Date(slot.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00',
          endTime: slot.endTime ? new Date(slot.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00'
        })) || [],
        isOnline: response.locationType === 'online' || response.locationType === 'both',
        language: 'ro',
        rating: response.rating || 0,
        reviews: response.reviews?.map((review: any) => ({
          id: review.id,
          sessionId: review.sessionId,
          studentId: review.studentId,
          studentName: cleanStudentName(review.student?.name || review.studentName || 'Student necunoscut'),
          studentAvatar: review.student?.avatar || review.studentAvatar,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        })) || []
      };
      
      return transformedSession;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch tutoring session');
      setError(error);
      console.error('Error fetching tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Create a new tutoring request
   */
  const createTutoringRequest = useCallback(async (request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<TutoringRequest> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Send only the fields that the backend expects
      const payload = {
        message: request.message,
        preferredDates: request.preferredDates
      };
      
      const response = await apiClient.post<TutoringRequest>(`/tutoring/${request.sessionId}/request`, payload);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to create tutoring request');
      setError(error);
      console.error('Error creating tutoring request:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Create a new tutoring request and send notification
   */
  const createRequestWithNotification = useCallback(async (request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<TutoringRequest> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First create the request
      const createdRequest = await createTutoringRequest(request);
      
      // Then send notification to the teacher
      await apiClient.post('/notifications/tutoring-request', {
        requestId: createdRequest.id,
        teacherId: request.sessionId, // Assuming sessionId is the teacherId
        message: `Ai primit o nouă cerere de tutoriat de la ${request.studentName}`,
      });
      
      return createdRequest;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to create tutoring request with notification');
      setError(error);
      console.error('Error creating tutoring request with notification:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createTutoringRequest]);
  
  /**
   * Get tutoring reviews by session ID
   */
  const getTutoringReviewsBySessionId = useCallback(async (sessionId: string): Promise<TutoringReview[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<any[]>(`/reviews/tutoring/${sessionId}`);
      
      // Transform the response to match TutoringReview interface
      const transformedReviews: TutoringReview[] = response.map((review: any) => ({
        id: review.id,
        sessionId: review.sessionId,
        studentId: review.studentId,
        studentName: cleanStudentName(review.student?.name || review.studentName || 'Student necunoscut'),
        studentAvatar: review.student?.avatar || review.studentAvatar,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }));
      
      return transformedReviews;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch tutoring reviews');
      setError(error);
      console.error('Error fetching tutoring reviews:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Create a new tutoring review
   */
  const createTutoringReview = useCallback(async (review: Omit<TutoringReview, 'id' | 'createdAt'>): Promise<TutoringReview> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<TutoringReview>(`/reviews/tutoring/${review.sessionId}`, {
        rating: review.rating,
        comment: review.comment
      });
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to create tutoring review');
      setError(error);
      console.error('Error creating tutoring review:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get student tutoring requests
   */
  const getStudentTutoringRequests = useCallback(async (): Promise<TutoringRequest[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<any[]>('/tutoring/requests/my');
      
      // Transform the response to match TutoringRequest interface
      const transformedRequests: TutoringRequest[] = response.map((request: any) => ({
        ...request,
        studentName: cleanStudentName(request.student?.name || request.studentName || 'Student necunoscut'),
        studentAvatar: request.student?.avatar || request.studentAvatar,
        preferredDates: request.preferredDates || []
      }));
      
      return transformedRequests;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch student tutoring requests');
      setError(error);
      console.error('Error fetching student tutoring requests:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get teacher tutoring requests
   */
  const getTeacherTutoringRequests = useCallback(async (): Promise<TutoringRequest[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<any[]>('/tutoring/requests/teacher');
      
      // Transform the response to match TutoringRequest interface
      const transformedRequests: TutoringRequest[] = response.map((request: any) => ({
        ...request,
        studentName: cleanStudentName(request.student?.name || request.studentName || 'Student necunoscut'),
        studentAvatar: request.student?.avatar || request.studentAvatar,
        preferredDates: request.preferredDates || []
      }));
      
      return transformedRequests;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch teacher tutoring requests');
      setError(error);
      console.error('Error fetching teacher tutoring requests:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Update tutoring request status
   */
  const updateTutoringRequestStatus = useCallback(async (requestId: string, status: string, confirmedDate?: string, confirmedStartTime?: string, confirmedEndTime?: string): Promise<TutoringRequest> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch<TutoringRequest>(`/tutoring/requests/${requestId}/status`, {
        status,
        confirmedDate,
        confirmedStartTime,
        confirmedEndTime,
      });
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to update tutoring request status');
      setError(error);
      console.error('Error updating tutoring request status:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a tutoring session
   */
  const deleteTutoringSession = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.delete(`/tutoring/${sessionId}`);
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to delete tutoring session');
      setError(error);
      console.error('Error deleting tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new tutoring session
   */
  const createTutoringSession = useCallback(async (session: Omit<TutoringSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<TutoringSession> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<TutoringSession>('/tutoring', session);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to create tutoring session');
      setError(error);
      console.error('Error creating tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing tutoring session
   */
  const updateTutoringSession = useCallback(async (sessionId: string, session: Partial<TutoringSession>): Promise<TutoringSession> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch<TutoringSession>(`/tutoring/${sessionId}`, session);
      return response;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to update tutoring session');
      setError(error);
      console.error('Error updating tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all tutoring sessions (for admin use)
   */
  const getAllTutoringSessions = useCallback(async (): Promise<TutoringSession[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call admin endpoint to get all sessions with teacher info
      const response = await apiClient.get<any[]>('/admin/tutoring');
      
      // Transform the response to match TutoringSession interface
      const transformedSessions: TutoringSession[] = response.map((session: any) => ({
        ...session,
        teacherName: session.teacher?.name || 'Unknown Teacher',
        teacherAvatar: session.teacher?.avatar || null,
        hourlyRate: session.pricePerHour,
        currency: 'RON',
        availability: session.availability || [],
        isOnline: session.locationType === 'online' || session.locationType === 'both',
        language: 'ro',
        rating: session.rating || 0,
        reviews: session.reviews || []
      }));
      
      return transformedSessions;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to fetch all tutoring sessions');
      setError(error);
      console.error('Error fetching all tutoring sessions:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Update tutoring session status (admin function)
   */
  const updateTutoringSessionStatus = useCallback(async (sessionId: string, status: string): Promise<TutoringSession> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.patch<any>(`/admin/tutoring/${sessionId}/status`, { status });
      
      // Transform the response to match TutoringSession interface
      const transformedSession: TutoringSession = {
        ...response,
        teacherName: response.teacher?.name || 'Unknown Teacher',
        teacherAvatar: response.teacher?.avatar || null,
        hourlyRate: response.pricePerHour,
        currency: 'RON',
        availability: response.availability || [],
        isOnline: response.locationType === 'online' || response.locationType === 'both',
        language: 'ro',
        rating: response.rating || 0,
        reviews: response.reviews || []
      };
      
      return transformedSession;
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to update tutoring session status');
      setError(error);
      console.error('Error updating tutoring session status:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Approve tutoring session with notification (admin function)
   */
  const approveSessionWithNotification = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/admin/tutoring/${sessionId}/approve`);
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to approve tutoring session');
      setError(error);
      console.error('Error approving tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reject tutoring session with notification (admin function)
   */
  const rejectSessionWithNotification = useCallback(async (sessionId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.post(`/admin/tutoring/${sessionId}/reject`);
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error('Failed to reject tutoring session');
      setError(error);
      console.error('Error rejecting tutoring session:', err);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getApprovedTutoringSessions,
    getTeacherTutoringSessions,
    getMyTutoringSessions,
    getTutoringSessionById,
    createTutoringRequest,
    createRequestWithNotification,
    getTutoringReviewsBySessionId,
    createTutoringReview,
    getStudentTutoringRequests,
    getTeacherTutoringRequests,
    updateTutoringRequestStatus,
    deleteTutoringSession,
    createTutoringSession,
    updateTutoringSession,
    getAllTutoringSessions,
    updateTutoringSessionStatus,
    approveSessionWithNotification,
    rejectSessionWithNotification,
  };
}; 