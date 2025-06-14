import express from 'express';
import * as adminController from '../controllers/admin/index';
import * as pointsController from '../controllers/admin/pointsController';
import { isAdmin, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken, isAdmin);

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/user-growth', adminController.getUserGrowthData);
router.get('/dashboard/course-performance', adminController.getCoursePerformanceData);
router.get('/dashboard/approval-requests', adminController.getApprovalRequests);

// Course management
router.get('/courses', adminController.manageCourseApprovals);
router.get('/courses/pending', adminController.manageCourseApprovals);
router.patch('/courses/:id/status', adminController.updateCourseStatus);

// Tutoring management
router.get('/tutoring', adminController.manageTutoringApprovals);
router.get('/tutoring/pending', adminController.manageTutoringApprovals);
router.patch('/tutoring/:id/status', adminController.updateTutoringStatus);
router.post('/tutoring/:id/approve', adminController.approveTutoringSession);
router.post('/tutoring/:id/reject', adminController.rejectTutoringSession);

// User management
router.get('/users', adminController.manageUsers);
router.get('/teachers/pending', adminController.getPendingTeachers);

// Subscription plans
router.get('/subscription-plans', adminController.getSubscriptionPlans);
router.post('/subscription-plans', adminController.upsertSubscriptionPlan);
router.delete('/subscription-plans/:id', adminController.deleteSubscriptionPlan);

// Course bundles
router.get('/course-bundles', adminController.getCourseBundles);
router.post('/course-bundles', adminController.upsertCourseBundle);
router.delete('/course-bundles/:id', adminController.deleteCourseBundle);

// Points package management
router.get('/points-packages', pointsController.getAllPointsPackages);
router.post('/points-packages', pointsController.createPointsPackage);
router.put('/points-packages/:id', pointsController.updatePointsPackage);
router.delete('/points-packages/:id', pointsController.deletePointsPackage);
router.patch('/points-packages/:id/toggle', pointsController.togglePointsPackageStatus);

// Reports
router.get('/reports/payments', adminController.getPaymentsReport);
router.get('/reports/enrollments', adminController.getEnrollmentStats);

export default router; 