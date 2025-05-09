import { v4 as uuidv4 } from 'uuid';
import { 
  TutoringSession, 
  TutoringRequest, 
  TutoringMessage,
  TutoringSessionStatus,
  TutoringRequestStatus,
  TutoringReview
} from '@/types/tutoring';
import { 
  mockTutoringSessions, 
  mockTutoringRequests, 
  mockTutoringMessages 
} from '@/data/mockTutoringData';
import { useNotifications } from '@/contexts/NotificationContext';
import { createTutoringConversation } from '@/services/messagingService';

// Mock storage in localStorage
const STORAGE_KEYS = {
  TUTORING_SESSIONS: 'wiselearning_tutoring_sessions',
  TUTORING_REQUESTS: 'wiselearning_tutoring_requests',
  TUTORING_MESSAGES: 'wiselearning_tutoring_messages',
  TUTORING_REVIEWS: 'wiselearning_tutoring_reviews'
};

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TUTORING_SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.TUTORING_SESSIONS, JSON.stringify(mockTutoringSessions));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TUTORING_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.TUTORING_REQUESTS, JSON.stringify(mockTutoringRequests));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TUTORING_MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.TUTORING_MESSAGES, JSON.stringify(mockTutoringMessages));
  }
};

// Get all tutoring sessions
export const getAllTutoringSessions = (): TutoringSession[] => {
  initializeStorage();
  const sessions = localStorage.getItem(STORAGE_KEYS.TUTORING_SESSIONS);
  return sessions ? JSON.parse(sessions) : [];
};

// Get approved tutoring sessions
export const getApprovedTutoringSessions = (): TutoringSession[] => {
  return getAllTutoringSessions().filter(session => session.status === 'approved');
};

// Get tutoring sessions by teacher ID
export const getTeacherTutoringSessions = (teacherId: string): TutoringSession[] => {
  return getAllTutoringSessions().filter(session => session.teacherId === teacherId);
};

// Get a specific tutoring session
export const getTutoringSessionById = (sessionId: string): TutoringSession | undefined => {
  const session = getAllTutoringSessions().find(session => session.id === sessionId);
  
  if (session) {
    // Fetch reviews for this session
    const reviews = getTutoringReviewsBySessionId(sessionId);
    
    // Calculate average rating
    let rating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      rating = sum / reviews.length;
    }
    
    return {
      ...session,
      reviews,
      rating
    };
  }
  
  return session;
};

// Create a new tutoring session
export const createTutoringSession = (
  session: Omit<TutoringSession, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): TutoringSession => {
  const newSession: TutoringSession = {
    ...session,
    id: uuidv4(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const sessions = getAllTutoringSessions();
  const updatedSessions = [...sessions, newSession];
  localStorage.setItem(STORAGE_KEYS.TUTORING_SESSIONS, JSON.stringify(updatedSessions));
  
  return newSession;
};

// Update a tutoring session
export const updateTutoringSession = (
  sessionId: string, 
  updates: Partial<TutoringSession>
): TutoringSession | undefined => {
  const sessions = getAllTutoringSessions();
  const sessionIndex = sessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex === -1) return undefined;
  
  const updatedSession = {
    ...sessions[sessionIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  sessions[sessionIndex] = updatedSession;
  localStorage.setItem(STORAGE_KEYS.TUTORING_SESSIONS, JSON.stringify(sessions));
  
  return updatedSession;
};

// Update tutoring session status
export const updateTutoringSessionStatus = (
  sessionId: string, 
  status: TutoringSessionStatus
): TutoringSession | undefined => {
  return updateTutoringSession(sessionId, { status });
};

// Delete a tutoring session
export const deleteTutoringSession = (sessionId: string): boolean => {
  const sessions = getAllTutoringSessions();
  const filteredSessions = sessions.filter(session => session.id !== sessionId);
  
  if (filteredSessions.length === sessions.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.TUTORING_SESSIONS, JSON.stringify(filteredSessions));
  
  // Clean up related requests and messages
  const requests = getAllTutoringRequests();
  const sessionRequests = requests.filter(request => request.sessionId === sessionId);
  
  sessionRequests.forEach(request => {
    deleteTutoringRequest(request.id);
  });
  
  return true;
};

// Get all tutoring requests
export const getAllTutoringRequests = (): TutoringRequest[] => {
  initializeStorage();
  const requests = localStorage.getItem(STORAGE_KEYS.TUTORING_REQUESTS);
  return requests ? JSON.parse(requests) : [];
};

// Get tutoring requests by session ID
export const getTutoringRequestsBySessionId = (sessionId: string): TutoringRequest[] => {
  return getAllTutoringRequests().filter(request => request.sessionId === sessionId);
};

// Get tutoring requests by student ID
export const getTutoringRequestsByStudentId = (studentId: string): TutoringRequest[] => {
  return getAllTutoringRequests().filter(request => request.studentId === studentId);
};

// Get a specific tutoring request
export const getTutoringRequestById = (requestId: string): TutoringRequest | undefined => {
  return getAllTutoringRequests().find(request => request.id === requestId);
};

// Create a new tutoring request
export const createTutoringRequest = (
  request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): TutoringRequest => {
  const newRequest: TutoringRequest = {
    ...request,
    id: uuidv4(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const requests = getAllTutoringRequests();
  const updatedRequests = [...requests, newRequest];
  localStorage.setItem(STORAGE_KEYS.TUTORING_REQUESTS, JSON.stringify(updatedRequests));
  
  // Create a messaging conversation between student and teacher
  const session = getTutoringSessionById(request.sessionId);
  if (session) {
    createTutoringConversation(
      request.studentId,
      session.teacherId,
      request.studentName,
      session.subject
    );
  }
  
  return newRequest;
};

// Update tutoring request status
export const updateTutoringRequestStatus = (
  requestId: string, 
  status: TutoringRequestStatus
): TutoringRequest | undefined => {
  const requests = getAllTutoringRequests();
  const requestIndex = requests.findIndex(request => request.id === requestId);
  
  if (requestIndex === -1) return undefined;
  
  const updatedRequest = {
    ...requests[requestIndex],
    status,
    updatedAt: new Date()
  };
  
  requests[requestIndex] = updatedRequest;
  localStorage.setItem(STORAGE_KEYS.TUTORING_REQUESTS, JSON.stringify(requests));
  
  return updatedRequest;
};

// Delete a tutoring request
export const deleteTutoringRequest = (requestId: string): boolean => {
  const requests = getAllTutoringRequests();
  const filteredRequests = requests.filter(request => request.id !== requestId);
  
  if (filteredRequests.length === requests.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.TUTORING_REQUESTS, JSON.stringify(filteredRequests));
  
  // Clean up related messages
  const messages = getAllTutoringMessages();
  const filteredMessages = messages.filter(message => message.requestId !== requestId);
  localStorage.setItem(STORAGE_KEYS.TUTORING_MESSAGES, JSON.stringify(filteredMessages));
  
  return true;
};

// Get all tutoring messages
export const getAllTutoringMessages = (): TutoringMessage[] => {
  initializeStorage();
  const messages = localStorage.getItem(STORAGE_KEYS.TUTORING_MESSAGES);
  return messages ? JSON.parse(messages) : [];
};

// Get tutoring messages by request ID
export const getTutoringMessagesByRequestId = (requestId: string): TutoringMessage[] => {
  return getAllTutoringMessages()
    .filter(message => message.requestId === requestId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

// Create a new tutoring message
export const createTutoringMessage = (
  message: Omit<TutoringMessage, 'id' | 'read' | 'createdAt'>
): TutoringMessage => {
  const newMessage: TutoringMessage = {
    ...message,
    id: uuidv4(),
    read: false,
    createdAt: new Date()
  };
  
  const messages = getAllTutoringMessages();
  const updatedMessages = [...messages, newMessage];
  localStorage.setItem(STORAGE_KEYS.TUTORING_MESSAGES, JSON.stringify(updatedMessages));
  
  return newMessage;
};

// Mark all messages in a request as read
export const markRequestMessagesAsRead = (requestId: string, userId: string): boolean => {
  const messages = getAllTutoringMessages();
  let updated = false;
  
  const updatedMessages = messages.map(message => {
    if (message.requestId === requestId && message.senderId !== userId && !message.read) {
      updated = true;
      return { ...message, read: true };
    }
    return message;
  });
  
  if (updated) {
    localStorage.setItem(STORAGE_KEYS.TUTORING_MESSAGES, JSON.stringify(updatedMessages));
  }
  
  return updated;
};

// Get unread message count for a user
export const getUnreadMessageCount = (userId: string): number => {
  return getAllTutoringMessages().filter(
    message => message.senderId !== userId && !message.read
  ).length;
};

// Get tutoring reviews by session ID
export const getTutoringReviewsBySessionId = (sessionId: string): TutoringReview[] => {
  initializeStorage();
  const REVIEWS_KEY = 'wiselearning_tutoring_reviews';
  const reviews = localStorage.getItem(REVIEWS_KEY);
  return reviews ? 
    JSON.parse(reviews).filter((review: TutoringReview) => review.sessionId === sessionId) : 
    [];
};

// Add a tutoring review
export const addTutoringReview = (review: Omit<TutoringReview, 'id' | 'createdAt'>): TutoringReview => {
  initializeStorage();
  const REVIEWS_KEY = 'wiselearning_tutoring_reviews';

  // Check if the user has already reviewed this session
  const existingReviews = getTutoringReviewsBySessionId(review.sessionId);
  const hasReviewed = existingReviews.some(r => r.studentId === review.studentId);
  
  if (hasReviewed) {
    throw new Error('You have already reviewed this tutoring session');
  }

  const newReview: TutoringReview = {
    ...review,
    id: uuidv4(),
    createdAt: new Date()
  };

  const reviews = localStorage.getItem(REVIEWS_KEY);
  const parsedReviews = reviews ? JSON.parse(reviews) : [];
  const updatedReviews = [...parsedReviews, newReview];
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
  return newReview;
};

// Delete a tutoring review
export const deleteTutoringReview = (reviewId: string): boolean => {
  initializeStorage();
  const REVIEWS_KEY = 'wiselearning_tutoring_reviews';
  
  const reviews = localStorage.getItem(REVIEWS_KEY);
  if (!reviews) return false;
  
  const parsedReviews = JSON.parse(reviews);
  const updatedReviews = parsedReviews.filter((review: TutoringReview) => review.id !== reviewId);
  
  if (updatedReviews.length === parsedReviews.length) {
    return false;
  }
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
  return true;
};

// Custom hook for using the tutoring service with notifications
export const useTutoringService = () => {
  const { addNotification } = useNotifications();
  
  const createSessionWithNotification = (
    session: Omit<TutoringSession, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const newSession = createTutoringSession(session);
    
    addNotification({
      title: 'Sesiune de tutoriat creată',
      message: 'Sesiunea de tutoriat a fost creată și așteaptă aprobarea.',
      type: 'info'
    });
    
    return newSession;
  };
  
  const approveSessionWithNotification = (sessionId: string) => {
    const session = updateTutoringSessionStatus(sessionId, 'approved');
    
    if (session) {
      addNotification({
        title: 'Sesiune aprobată',
        message: `Sesiunea "${session.subject}" a fost aprobată și este acum vizibilă pentru studenți.`,
        type: 'success'
      });
    }
    
    return session;
  };
  
  const rejectSessionWithNotification = (sessionId: string) => {
    const session = updateTutoringSessionStatus(sessionId, 'rejected');
    
    if (session) {
      addNotification({
        title: 'Sesiune respinsă',
        message: `Sesiunea "${session.subject}" a fost respinsă.`,
        type: 'warning'
      });
    }
    
    return session;
  };
  
  const createRequestWithNotification = (
    request: Omit<TutoringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const newRequest = createTutoringRequest(request);
    const session = getTutoringSessionById(request.sessionId);
    
    if (session) {
      addNotification({
        title: 'Cerere de tutoriat trimisă',
        message: `Cererea ta pentru "${session.subject}" a fost trimisă profesorului. Verifică mesajele pentru a continua conversația.`,
        type: 'info'
      });
    }
    
    return newRequest;
  };
  
  const acceptRequestWithNotification = (requestId: string) => {
    const request = updateTutoringRequestStatus(requestId, 'accepted');
    
    if (request) {
      const session = getTutoringSessionById(request.sessionId);
      if (session) {
        addNotification({
          title: 'Cerere acceptată',
          message: `Cererea pentru "${session.subject}" a fost acceptată.`,
          type: 'success'
        });
      }
    }
    
    return request;
  };
  
  const rejectRequestWithNotification = (requestId: string) => {
    const request = updateTutoringRequestStatus(requestId, 'rejected');
    
    if (request) {
      const session = getTutoringSessionById(request.sessionId);
      if (session) {
        addNotification({
          title: 'Cerere respinsă',
          message: `Cererea pentru "${session.subject}" a fost respinsă.`,
          type: 'warning'
        });
      }
    }
    
    return request;
  };
  
  const sendMessageWithNotification = (
    message: Omit<TutoringMessage, 'id' | 'read' | 'createdAt'>
  ) => {
    const newMessage = createTutoringMessage(message);
    
    addNotification({
      title: 'Mesaj nou',
      message: 'Ai trimis un mesaj nou.',
      type: 'info'
    });
    
    return newMessage;
  };
  
  const submitTutoringReview = (review: Omit<TutoringReview, 'id' | 'createdAt'>) => {
    try {
      const newReview = addTutoringReview(review);
      
      addNotification({
        title: 'Recenzie adăugată',
        message: 'Recenzia ta a fost trimisă cu succes.',
        type: 'success'
      });
      
      return newReview;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare la trimiterea recenziei.';
      
      addNotification({
        title: 'Eroare',
        message: errorMessage,
        type: 'error'
      });
      
      throw error;
    }
  };
  
  const removeTutoringReview = (reviewId: string) => {
    const success = deleteTutoringReview(reviewId);
    
    if (success) {
      addNotification({
        title: 'Recenzie ștearsă',
        message: 'Recenzia a fost ștearsă cu succes.',
        type: 'success'
      });
    } else {
      addNotification({
        title: 'Eroare',
        message: 'Nu s-a putut șterge recenzia.',
        type: 'error'
      });
    }
    
    return success;
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
