// Admin Controller Index - Re-exports from all admin controller modules

// Dashboard
export { getDashboardStats } from './dashboardController';

// Course Management
export {
    manageCourseApprovals,
    updateCourseStatus
} from './courseController';

// Tutoring Management
export {
    manageTutoringApprovals,
    updateTutoringStatus
} from './tutoringController';

// User Management
export { manageUsers } from './userController';

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
