import { Role } from '@prisma/client';
import { Router } from 'express';
import {
    createCourse,
    deleteCourse,
    getAllPublishedCourses,
    getCourseById,
    getEnrolledCourses,
    getMyCourses,
    getTeacherCourses,
    updateCourse
} from '../controllers/courseController';
import { authenticate, authorize, checkOwnership } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getAllPublishedCourses);
router.get('/:id', getCourseById);
router.get('/teacher/:id', getTeacherCourses);

// Protected routes
router.get('/my/teaching', authenticate, authorize(Role.teacher, Role.admin), getMyCourses);
router.get('/my/learning', authenticate, getEnrolledCourses);
router.post('/', authenticate, authorize(Role.teacher, Role.admin), createCourse);
router.put('/:id', authenticate, checkOwnership('course'), updateCourse);
router.delete('/:id', authenticate, checkOwnership('course'), deleteCourse);

export default router; 