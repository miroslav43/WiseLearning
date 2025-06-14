// Admin Controller Index - Re-exports from all admin controller modules

// Dashboard
export {
    getApprovalRequests, getCoursePerformanceData, getDashboardStats,
    getUserGrowthData
} from './dashboardController';

// Course Management
export {
    manageCourseApprovals,
    updateCourseStatus
} from './courseController';

// Tutoring Management
export {
    approveTutoringSession, manageTutoringApprovals, rejectTutoringSession, updateTutoringStatus
} from './tutoringController';

// User Management
export {
    getPendingTeachers, manageUsers
} from './userController';

// Subscription Plans
export {
    deleteSubscriptionPlan, getSubscriptionPlans,
    upsertSubscriptionPlan
} from './subscriptionController';

// Course Bundles
export {
    deleteCourseBundle, getCourseBundles,
    upsertCourseBundle
} from './bundleController';

// Reports
export {
    getEnrollmentStats, getPaymentsReport
} from './reportController';
