"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController = __importStar(require("../controllers/admin/index"));
const pointsController = __importStar(require("../controllers/admin/pointsController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Apply auth middleware to all admin routes
router.use(authMiddleware_1.verifyToken, authMiddleware_1.isAdmin);
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
exports.default = router;
