"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
// Main course controller (CRUD operations)
const courseController_1 = require("../controllers/courseController");
// Enrollment controller
const courseEnrollmentController_1 = require("../controllers/courseEnrollmentController");
// Progress controller
const courseProgressController_1 = require("../controllers/courseProgressController");
// Favorites controller
const courseFavoritesController_1 = require("../controllers/courseFavoritesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', courseController_1.getAllPublishedCourses);
router.get('/:id', courseController_1.getCourseById);
router.get('/teacher/:id', courseController_1.getTeacherCourses);
// Protected course CRUD routes
router.get('/my/teaching', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), courseController_1.getMyCourses);
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), courseController_1.createCourse);
router.put('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), (0, authMiddleware_1.checkOwnership)('course'), courseController_1.updateCourse);
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), (0, authMiddleware_1.checkOwnership)('course'), courseController_1.deleteCourse);
// Enrollment routes
router.get('/my/learning', authMiddleware_1.authenticate, courseEnrollmentController_1.getEnrolledCourses);
router.post('/:courseId/enroll', authMiddleware_1.authenticate, courseEnrollmentController_1.enrollInCourse);
router.delete('/:courseId/enroll', authMiddleware_1.authenticate, courseEnrollmentController_1.unenrollFromCourse);
router.get('/:courseId/enrollment-status', authMiddleware_1.authenticate, courseEnrollmentController_1.checkEnrollmentStatus);
router.post('/:courseId/complete', authMiddleware_1.authenticate, courseEnrollmentController_1.markCourseCompleted);
// Progress routes
router.get('/:id/progress', authMiddleware_1.authenticate, courseProgressController_1.getCourseProgress);
router.get('/:id/statistics', authMiddleware_1.authenticate, courseProgressController_1.getCourseStatistics);
router.post('/:id/lessons/:lessonId/completion', authMiddleware_1.authenticate, courseProgressController_1.markLessonCompleted);
router.delete('/:id/lessons/:lessonId/completion', authMiddleware_1.authenticate, courseProgressController_1.markLessonIncomplete);
router.get('/lessons/:lessonId/progress', authMiddleware_1.authenticate, courseProgressController_1.getLessonProgress);
router.put('/lessons/:lessonId/position', authMiddleware_1.authenticate, courseProgressController_1.updateLessonPosition);
// Favorites routes
router.get('/my/saved', authMiddleware_1.authenticate, courseFavoritesController_1.getSavedCourses);
router.get('/my/liked', authMiddleware_1.authenticate, courseFavoritesController_1.getLikedCourses);
router.get('/my/favorites', authMiddleware_1.authenticate, courseFavoritesController_1.getAllFavorites);
router.post('/:id/save', authMiddleware_1.authenticate, courseFavoritesController_1.toggleSavedCourse);
router.post('/:id/like', authMiddleware_1.authenticate, courseFavoritesController_1.toggleLikedCourse);
router.get('/:id/saved-status', authMiddleware_1.authenticate, courseFavoritesController_1.checkSavedStatus);
router.get('/:id/liked-status', authMiddleware_1.authenticate, courseFavoritesController_1.checkLikedStatus);
router.delete('/saved/bulk', authMiddleware_1.authenticate, courseFavoritesController_1.removeBulkSaved);
exports.default = router;
