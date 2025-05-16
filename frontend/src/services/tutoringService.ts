import { useNotifications } from '@/contexts/NotificationContext';
import {
  TutoringMessage,
  TutoringRequest,
  TutoringRequestStatus,
  TutoringReview,
  TutoringSession,
  TutoringSessionStatus
} from '@/types/tutoring';
import { apiClient } from '@/utils/apiClient';

// Get all tutoring sessions
export const getAllTutoringSessions = async () => {
  return apiClient.get<TutoringSession[]>('/tutoring/sessions');
};

// Get approved tutoring sessions
export const getApprovedTutoringSessions = async () => {
  return apiClient.get<TutoringSession[]>('/tutoring/sessions', { status: 'approved' });
};

// Get tutoring sessions by teacher ID
export const getTeacherTutoringSessions = async (teacherId: string) => {
  return apiClient.get<TutoringSession[]>(`/tutoring/sessions/teacher/${teacherId}`);
};

// Get a specific tutoring session
export const getTutoringSessionById = async (sessionId: string) => {
  return apiClient.get<TutoringSession>(`/tutoring/sessions/${sessionId}`);
};

// Create a new tutoring session
export const createTutoringSession = async (
  session: Omit<TutoringSession, 'id' | 'status' | 'createdAt' | 'updatedAt'>
) => {
  return apiClient.post<TutoringSession>('/tutoring/sessions', session);
};

// Update a tutoring session
export const updateTutoringSession = async (
  sessionId: string, 
  updates: Partial<TutoringSession>
) => {
  return apiClient.put<TutoringSession>(`/tutoring/sessions/${sessionId}`, updates);
};

// Update tutoring session status
export const updateTutoringSessionStatus = async (
  sessionId: string, 
  status: TutoringSessionStatus
) => {
  return apiClient.patch<TutoringSession>(`/tutoring/sessions/${sessionId}/status`, { status });
};

// Delete a tutoring session
export const deleteTutoringSession = async (sessionId: string) => {
  return apiClient.delete<{ message: string }>(`/tutoring/sessions/${sessionId}`);
};

// Get all tutoring requests
export const getAllTutoringRequests = async () => {
  return apiClient.get<TutoringRequest[]>('/tutoring/requests');
};

// Get tutoring requests by session ID
export const getTutoringRequestsBySessionId = async (sessionId: string) => {
  return apiClient.get<TutoringRequest[]>(`/tutoring/sessions/${sessionId}/requests`);
};

// Get tutoring requests by student ID
export const getTutoringRequestsByStudentId = async (studentId: string) => {
  return apiClient.get<TutoringRequest[]>(`/tutoring/requests/student/${studentId}`);
};

// Get my tutoring requests (as a student)
export const getMyTutoringRequests = async () => {
  return apiClient.get<TutoringRequest[]>('/tutoring/requests/my');
};

// Get a specific tutoring request
export const getTutoringRequestById = async (requestId: string) => {
  return apiClient.get<TutoringRequest>(`/tutoring/requests/${requestId}`);
};

// Create a new tutoring request
export const createTutoringRequest = async (
  request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
) => {
  return apiClient.post<TutoringRequest>('/tutoring/requests', request);
};

// Update tutoring request status
export const updateTutoringRequestStatus = async (
  requestId: string, 
  status: TutoringRequestStatus
) => {
  return apiClient.patch<TutoringRequest>(`/tutoring/requests/${requestId}/status`, { status });
};

// Delete a tutoring request
export const deleteTutoringRequest = async (requestId: string) => {
  return apiClient.delete<{ message: string }>(`/tutoring/requests/${requestId}`);
};

// Get all tutoring messages
export const getAllTutoringMessages = async () => {
  return apiClient.get<TutoringMessage[]>('/tutoring/messages');
};

// Get tutoring messages by request ID
export const getTutoringMessagesByRequestId = async (requestId: string) => {
  return apiClient.get<TutoringMessage[]>(`/tutoring/requests/${requestId}/messages`);
};

// Create a new tutoring message
export const createTutoringMessage = async (
  message: Omit<TutoringMessage, 'id' | 'read' | 'createdAt'>
) => {
  return apiClient.post<TutoringMessage>(`/tutoring/requests/${message.requestId}/messages`, message);
};

// Mark all messages in a request as read
export const markRequestMessagesAsRead = async (requestId: string) => {
  return apiClient.patch<{ message: string }>(`/tutoring/requests/${requestId}/messages/read`);
};

// Get unread message count for a user
export const getUnreadMessageCount = async () => {
  return apiClient.get<{ count: number }>('/tutoring/messages/unread');
};

// Get tutoring reviews by session ID
export const getTutoringReviewsBySessionId = async (sessionId: string) => {
  return apiClient.get<TutoringReview[]>(`/tutoring/sessions/${sessionId}/reviews`);
};

// Add a tutoring review
export const addTutoringReview = async (review: Omit<TutoringReview, 'id' | 'createdAt'>) => {
  return apiClient.post<TutoringReview>('/tutoring/reviews', review);
};

// Delete a tutoring review
export const deleteTutoringReview = async (reviewId: string) => {
  return apiClient.delete<{ message: string }>(`/tutoring/reviews/${reviewId}`);
};

// Custom hook for using the tutoring service with notifications
export const useTutoringService = () => {
  const { addNotification } = useNotifications();
  
  const createSessionWithNotification = async (
    session: Omit<TutoringSession, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newSession = await createTutoringSession(session);
      
      addNotification({
        title: 'Sesiune de tutoriat creată',
        message: 'Sesiunea de tutoriat a fost creată și așteaptă aprobarea.',
        type: 'info'
      });
      
      return newSession;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la crearea sesiunii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const approveSessionWithNotification = async (sessionId: string) => {
    try {
      const session = await updateTutoringSessionStatus(sessionId, 'approved');
      
      addNotification({
        title: 'Sesiune aprobată',
        message: `Sesiunea "${session.subject}" a fost aprobată și este acum vizibilă pentru studenți.`,
        type: 'success'
      });
      
      return session;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la aprobarea sesiunii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const rejectSessionWithNotification = async (sessionId: string) => {
    try {
      const session = await updateTutoringSessionStatus(sessionId, 'rejected');
      
      addNotification({
        title: 'Sesiune respinsă',
        message: `Sesiunea a fost respinsă.`,
        type: 'warning'
      });
      
      return session;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la respingerea sesiunii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const createRequestWithNotification = async (
    request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const newRequest = await createTutoringRequest(request);
      
      addNotification({
        title: 'Cerere de tutoriat trimisă',
        message: 'Cererea ta a fost trimisă profesorului. Verifică mesajele pentru a continua conversația.',
        type: 'info'
      });
      
      return newRequest;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la trimiterea cererii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const acceptRequestWithNotification = async (requestId: string) => {
    try {
      const request = await updateTutoringRequestStatus(requestId, 'accepted');
      
      addNotification({
        title: 'Cerere acceptată',
        message: 'Cererea de tutoriat a fost acceptată.',
        type: 'success'
      });
      
      return request;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la acceptarea cererii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const rejectRequestWithNotification = async (requestId: string) => {
    try {
      const request = await updateTutoringRequestStatus(requestId, 'rejected');
      
      addNotification({
        title: 'Cerere respinsă',
        message: 'Cererea de tutoriat a fost respinsă.',
        type: 'warning'
      });
      
      return request;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la respingerea cererii';
      addNotification({
        title: 'Eroare',
        message,
        type: 'error'
      });
      throw error;
    }
  };
  
  const sendMessageWithNotification = async (
    message: Omit<TutoringMessage, 'id' | 'read' | 'createdAt'>
  ) => {
    try {
      const newMessage = await createTutoringMessage(message);
      
      return newMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la trimiterea mesajului';
      addNotification({
        title: 'Eroare',
        message: errorMessage,
        type: 'error'
      });
      throw error;
    }
  };
  
  const submitTutoringReview = async (review: Omit<TutoringReview, 'id' | 'createdAt'>) => {
    try {
      const newReview = await addTutoringReview(review);
      
      addNotification({
        title: 'Recenzie adăugată',
        message: 'Recenzia ta a fost trimisă cu succes.',
        type: 'success'
      });
      
      return newReview;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la trimiterea recenziei';
      
      addNotification({
        title: 'Eroare',
        message: errorMessage,
        type: 'error'
      });
      
      throw error;
    }
  };
  
  const removeTutoringReview = async (reviewId: string) => {
    try {
      await deleteTutoringReview(reviewId);
      
      addNotification({
        title: 'Recenzie ștearsă',
        message: 'Recenzia a fost ștearsă cu succes.',
        type: 'success'
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la ștergerea recenziei';
      
      addNotification({
        title: 'Eroare',
        message: errorMessage,
        type: 'error'
      });
      
      throw error;
    }
  };
  
  return {
    // Session methods
    getAllTutoringSessions,
    getApprovedTutoringSessions,
    getTeacherTutoringSessions,
    getTutoringSessionById,
    createTutoringSession: createSessionWithNotification,
    updateTutoringSession,
    updateTutoringSessionStatus,
    deleteTutoringSession,
    approveSession: approveSessionWithNotification,
    rejectSession: rejectSessionWithNotification,
    
    // Request methods
    getAllTutoringRequests,
    getTutoringRequestsBySessionId,
    getTutoringRequestsByStudentId,
    getTutoringRequestById,
    createTutoringRequest: createRequestWithNotification,
    updateTutoringRequestStatus,
    deleteTutoringRequest,
    acceptRequest: acceptRequestWithNotification,
    rejectRequest: rejectRequestWithNotification,
    
    // Message methods
    getAllTutoringMessages,
    getTutoringMessagesByRequestId,
    createTutoringMessage: sendMessageWithNotification,
    markRequestMessagesAsRead,
    getUnreadMessageCount,
    
    // Review methods
    getTutoringReviewsBySessionId,
    submitTutoringReview,
    removeTutoringReview
  };
};
