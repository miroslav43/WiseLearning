import express from 'express';
import * as adminController from '../controllers/adminController';
import { isAdmin, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken, isAdmin);

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// Course management
router.get('/courses', adminController.manageCourseApprovals);
router.patch('/courses/:id/status', adminController.updateCourseStatus);

// Tutoring management
router.get('/tutoring', adminController.manageTutoringApprovals);
router.patch('/tutoring/:id/status', adminController.updateTutoringStatus);

// User management
router.get('/users', adminController.manageUsers);

// Subscription plans
router.get('/subscription-plans', adminController.getSubscriptionPlans);
router.post('/subscription-plans', adminController.upsertSubscriptionPlan);
router.delete('/subscription-plans/:id', adminController.deleteSubscriptionPlan);

// Course bundles
router.get('/course-bundles', adminController.getCourseBundles);
router.post('/course-bundles', adminController.upsertCourseBundle);
router.delete('/course-bundles/:id', adminController.deleteCourseBundle);

// Reports
router.get('/reports/payments', adminController.getPaymentsReport);
router.get('/reports/enrollments', adminController.getEnrollmentStats);

export default router; 