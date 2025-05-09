
import { v4 as uuidv4 } from 'uuid';
import { Review } from '@/types/course';
import { TutoringReview } from '@/types/tutoring';
import { useNotifications } from '@/contexts/NotificationContext';

// Storage keys
const STORAGE_KEYS = {
  COURSE_REVIEWS: 'wiselearning_course_reviews',
  TUTORING_REVIEWS: 'wiselearning_tutoring_reviews',
};

// Initialize storage if needed
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSE_REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.COURSE_REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TUTORING_REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.TUTORING_REVIEWS, JSON.stringify([]));
  }
};

// Get all course reviews
export const getAllCourseReviews = (): Review[] => {
  initializeStorage();
  const reviews = localStorage.getItem(STORAGE_KEYS.COURSE_REVIEWS);
  return reviews ? JSON.parse(reviews) : [];
};

// Get course reviews by course ID
export const getCourseReviewsByCourseId = (courseId: string): Review[] => {
  return getAllCourseReviews().filter(review => review.courseId === courseId);
};

// Get course reviews by user ID
export const getCourseReviewsByUserId = (userId: string): Review[] => {
  return getAllCourseReviews().filter(review => review.userId === userId);
};

// Check if user has already reviewed a course
export const hasUserReviewedCourse = (userId: string, courseId: string): boolean => {
  return getAllCourseReviews().some(
    review => review.userId === userId && review.courseId === courseId
  );
};

// Add a course review
export const addCourseReview = (
  review: Omit<Review, 'id' | 'createdAt'>
): Review => {
  if (hasUserReviewedCourse(review.userId, review.courseId)) {
    throw new Error('You have already reviewed this course');
  }

  const newReview: Review = {
    ...review,
    id: uuidv4(),
    createdAt: new Date()
  };

  const reviews = getAllCourseReviews();
  const updatedReviews = [...reviews, newReview];
  localStorage.setItem(STORAGE_KEYS.COURSE_REVIEWS, JSON.stringify(updatedReviews));

  return newReview;
};

// Delete a course review
export const deleteCourseReview = (reviewId: string): boolean => {
  const reviews = getAllCourseReviews();
  const updatedReviews = reviews.filter(review => review.id !== reviewId);
  
  if (updatedReviews.length === reviews.length) {
    return false;
  }

  localStorage.setItem(STORAGE_KEYS.COURSE_REVIEWS, JSON.stringify(updatedReviews));
  return true;
};

// Get average rating for a course
export const getAverageCourseRating = (courseId: string): number => {
  const reviews = getCourseReviewsByCourseId(courseId);
  
  if (reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// --- Tutoring reviews ---

// Get all tutoring reviews
export const getAllTutoringReviews = (): TutoringReview[] => {
  initializeStorage();
  const reviews = localStorage.getItem(STORAGE_KEYS.TUTORING_REVIEWS);
  return reviews ? JSON.parse(reviews) : [];
};

// Get tutoring reviews by session ID
export const getTutoringReviewsBySessionId = (sessionId: string): TutoringReview[] => {
  return getAllTutoringReviews().filter(review => review.sessionId === sessionId);
};

// Get tutoring reviews by student ID
export const getTutoringReviewsByStudentId = (studentId: string): TutoringReview[] => {
  return getAllTutoringReviews().filter(review => review.studentId === studentId);
};

// Check if student has already reviewed a tutoring session
export const hasStudentReviewedSession = (studentId: string, sessionId: string): boolean => {
  return getAllTutoringReviews().some(
    review => review.studentId === studentId && review.sessionId === sessionId
  );
};

// Add a tutoring review
export const addTutoringReview = (
  review: Omit<TutoringReview, 'id' | 'createdAt'>
): TutoringReview => {
  if (hasStudentReviewedSession(review.studentId, review.sessionId)) {
    throw new Error('You have already reviewed this tutoring session');
  }

  const newReview: TutoringReview = {
    ...review,
    id: uuidv4(),
    createdAt: new Date()
  };

  const reviews = getAllTutoringReviews();
  const updatedReviews = [...reviews, newReview];
  localStorage.setItem(STORAGE_KEYS.TUTORING_REVIEWS, JSON.stringify(updatedReviews));

  return newReview;
};

// Delete a tutoring review
export const deleteTutoringReview = (reviewId: string): boolean => {
  const reviews = getAllTutoringReviews();
  const updatedReviews = reviews.filter(review => review.id !== reviewId);
  
  if (updatedReviews.length === reviews.length) {
    return false;
  }

  localStorage.setItem(STORAGE_KEYS.TUTORING_REVIEWS, JSON.stringify(updatedReviews));
  return true;
};

// Get average rating for a tutoring session
export const getAverageTutoringRating = (sessionId: string): number => {
  const reviews = getTutoringReviewsBySessionId(sessionId);
  
  if (reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Custom hook for using reviews with notifications
export const useReviewService = () => {
  const { addNotification } = useNotifications();

  const submitCourseReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      const newReview = addCourseReview(review);
      
      addNotification({
        title: 'Recenzie trimisă',
        message: 'Recenzia ta a fost adăugată cu succes.',
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

  const submitTutoringReview = (review: Omit<TutoringReview, 'id' | 'createdAt'>) => {
    try {
      const newReview = addTutoringReview(review);
      
      addNotification({
        title: 'Recenzie trimisă',
        message: 'Recenzia ta a fost adăugată cu succes.',
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

  const removeCourseReview = (reviewId: string) => {
    const success = deleteCourseReview(reviewId);
    
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
    // Course reviews
    getAllCourseReviews,
    getCourseReviewsByCourseId,
    getCourseReviewsByUserId,
    hasUserReviewedCourse,
    submitCourseReview,
    removeCourseReview,
    getAverageCourseRating,
    
    // Tutoring reviews
    getAllTutoringReviews,
    getTutoringReviewsBySessionId,
    getTutoringReviewsByStudentId,
    hasStudentReviewedSession,
    submitTutoringReview,
    removeTutoringReview,
    getAverageTutoringRating
  };
};
