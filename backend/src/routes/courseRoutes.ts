import { Role } from '@prisma/client';
import { Router } from 'express';

// Main course controller (CRUD operations)
import {
    createCourse,
    deleteCourse,
    getAllPublishedCourses,
    getCourseById,
    getMyCourses,
    getTeacherCourses,
    updateCourse
} from '../controllers/courseController';

// Enrollment controller
import {
    checkEnrollmentStatus,
    enrollInCourse,
    getEnrolledCourses,
    markCourseCompleted,
    unenrollFromCourse
} from '../controllers/courseEnrollmentController';

// Progress controller
import {
    getCourseProgress,
    getCourseStatistics,
    getLessonProgress,
    markLessonCompleted,
    markLessonIncomplete,
    updateLessonPosition
} from '../controllers/courseProgressController';

// Favorites controller
import {
    checkLikedStatus,
    checkSavedStatus,
    getAllFavorites,
    getLikedCourses,
    getSavedCourses,
    removeBulkSaved,
    toggleLikedCourse,
    toggleSavedCourse
} from '../controllers/courseFavoritesController';

import { authenticate, authorize, checkOwnership } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllPublishedCourses);
router.get('/:id', getCourseById);
router.get('/teacher/:id', getTeacherCourses);

// Protected course CRUD routes
router.get('/my/teaching', authenticate, authorize(Role.teacher, Role.admin), getMyCourses);
router.post('/', authenticate, authorize(Role.teacher, Role.admin), createCourse);
router.put('/:id', authenticate, authorize(Role.teacher, Role.admin), checkOwnership('course'), updateCourse);
router.delete('/:id', authenticate, authorize(Role.teacher, Role.admin), checkOwnership('course'), deleteCourse);

// Enrollment routes
router.get('/my/learning', authenticate, getEnrolledCourses);
router.post('/:courseId/enroll', authenticate, enrollInCourse);
router.delete('/:courseId/enroll', authenticate, unenrollFromCourse);
router.get('/:courseId/enrollment-status', authenticate, checkEnrollmentStatus);
router.post('/:courseId/complete', authenticate, markCourseCompleted);

// Progress routes
router.get('/:id/progress', authenticate, getCourseProgress);
router.get('/:id/statistics', authenticate, getCourseStatistics);
router.post('/:id/lessons/:lessonId/completion', authenticate, markLessonCompleted);
router.delete('/:id/lessons/:lessonId/completion', authenticate, markLessonIncomplete);
router.get('/lessons/:lessonId/progress', authenticate, getLessonProgress);
router.put('/lessons/:lessonId/position', authenticate, updateLessonPosition);

// Favorites routes
router.get('/my/saved', authenticate, getSavedCourses);
router.get('/my/liked', authenticate, getLikedCourses);
router.get('/my/favorites', authenticate, getAllFavorites);
router.post('/:id/save', authenticate, toggleSavedCourse);
router.post('/:id/like', authenticate, toggleLikedCourse);
router.get('/:id/saved-status', authenticate, checkSavedStatus);
router.get('/:id/liked-status', authenticate, checkLikedStatus);
router.delete('/saved/bulk', authenticate, removeBulkSaved);

export default router; 