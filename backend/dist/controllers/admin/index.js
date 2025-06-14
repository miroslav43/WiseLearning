"use strict";
// Admin Controller Index - Re-exports from all admin controller modules
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsReport = exports.getEnrollmentStats = exports.upsertCourseBundle = exports.getCourseBundles = exports.deleteCourseBundle = exports.upsertSubscriptionPlan = exports.getSubscriptionPlans = exports.deleteSubscriptionPlan = exports.manageUsers = exports.getPendingTeachers = exports.updateTutoringStatus = exports.rejectTutoringSession = exports.manageTutoringApprovals = exports.approveTutoringSession = exports.updateCourseStatus = exports.manageCourseApprovals = exports.getUserGrowthData = exports.getDashboardStats = exports.getCoursePerformanceData = exports.getApprovalRequests = void 0;
// Dashboard
var dashboardController_1 = require("./dashboardController");
Object.defineProperty(exports, "getApprovalRequests", { enumerable: true, get: function () { return dashboardController_1.getApprovalRequests; } });
Object.defineProperty(exports, "getCoursePerformanceData", { enumerable: true, get: function () { return dashboardController_1.getCoursePerformanceData; } });
Object.defineProperty(exports, "getDashboardStats", { enumerable: true, get: function () { return dashboardController_1.getDashboardStats; } });
Object.defineProperty(exports, "getUserGrowthData", { enumerable: true, get: function () { return dashboardController_1.getUserGrowthData; } });
// Course Management
var courseController_1 = require("./courseController");
Object.defineProperty(exports, "manageCourseApprovals", { enumerable: true, get: function () { return courseController_1.manageCourseApprovals; } });
Object.defineProperty(exports, "updateCourseStatus", { enumerable: true, get: function () { return courseController_1.updateCourseStatus; } });
// Tutoring Management
var tutoringController_1 = require("./tutoringController");
Object.defineProperty(exports, "approveTutoringSession", { enumerable: true, get: function () { return tutoringController_1.approveTutoringSession; } });
Object.defineProperty(exports, "manageTutoringApprovals", { enumerable: true, get: function () { return tutoringController_1.manageTutoringApprovals; } });
Object.defineProperty(exports, "rejectTutoringSession", { enumerable: true, get: function () { return tutoringController_1.rejectTutoringSession; } });
Object.defineProperty(exports, "updateTutoringStatus", { enumerable: true, get: function () { return tutoringController_1.updateTutoringStatus; } });
// User Management
var userController_1 = require("./userController");
Object.defineProperty(exports, "getPendingTeachers", { enumerable: true, get: function () { return userController_1.getPendingTeachers; } });
Object.defineProperty(exports, "manageUsers", { enumerable: true, get: function () { return userController_1.manageUsers; } });
// Subscription Plans
var subscriptionController_1 = require("./subscriptionController");
Object.defineProperty(exports, "deleteSubscriptionPlan", { enumerable: true, get: function () { return subscriptionController_1.deleteSubscriptionPlan; } });
Object.defineProperty(exports, "getSubscriptionPlans", { enumerable: true, get: function () { return subscriptionController_1.getSubscriptionPlans; } });
Object.defineProperty(exports, "upsertSubscriptionPlan", { enumerable: true, get: function () { return subscriptionController_1.upsertSubscriptionPlan; } });
// Course Bundles
var bundleController_1 = require("./bundleController");
Object.defineProperty(exports, "deleteCourseBundle", { enumerable: true, get: function () { return bundleController_1.deleteCourseBundle; } });
Object.defineProperty(exports, "getCourseBundles", { enumerable: true, get: function () { return bundleController_1.getCourseBundles; } });
Object.defineProperty(exports, "upsertCourseBundle", { enumerable: true, get: function () { return bundleController_1.upsertCourseBundle; } });
// Reports
var reportController_1 = require("./reportController");
Object.defineProperty(exports, "getEnrollmentStats", { enumerable: true, get: function () { return reportController_1.getEnrollmentStats; } });
Object.defineProperty(exports, "getPaymentsReport", { enumerable: true, get: function () { return reportController_1.getPaymentsReport; } });
