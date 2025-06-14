"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get all users (admin only)
router.get('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.admin), userController_1.getAllUsers);
// Get user points transactions
router.get('/points/transactions', authMiddleware_1.authenticate, userController_1.getUserPointsTransactions);
// Get teacher profile
router.get('/teacher/:id', userController_1.getTeacherProfile);
// Update teacher profile
router.put('/teacher/profile', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher), userController_1.updateTeacherProfile);
// Teacher dashboard endpoints
router.get('/teacher/dashboard/stats', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher), (req, res) => {
    // Mock response for now
    res.json({
        coursesCount: 3,
        studentsCount: 45,
        assignmentsCount: 8,
        reviewsCount: 24
    });
});
router.get('/teacher/dashboard/courses', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher), (req, res) => {
    // Mock response for now
    res.json([
        {
            id: '1',
            title: 'Informatică: Algoritmi',
            students: 18,
            activeWeek: 6,
            totalWeeks: 12,
            completionRate: 65
        },
        {
            id: '2',
            title: 'Matematică: Analiza',
            students: 15,
            activeWeek: 4,
            totalWeeks: 10,
            completionRate: 40
        }
    ]);
});
router.get('/teacher/dashboard/activities', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher), (req, res) => {
    // Mock response for now
    res.json([
        {
            id: '1',
            title: 'Student nou înscris',
            subtitle: 'Maria Popescu s-a înscris la cursul de Informatică',
            color: 'blue'
        },
        {
            id: '2',
            title: 'Temă trimisă',
            subtitle: 'Ion Ionescu a trimis tema pentru lecția 5',
            color: 'green'
        }
    ]);
});
router.get('/teacher/dashboard/reviews', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher), (req, res) => {
    // Mock response for now
    res.json([
        {
            id: '1',
            studentName: 'Ana Maria',
            rating: 5,
            comment: 'Profesor excelent, explică foarte clar!',
            course: 'Informatică: Algoritmi',
            date: new Date().toISOString()
        }
    ]);
});
// Set user availability
router.post('/availability', authMiddleware_1.authenticate, userController_1.setUserAvailability);
// Get user availability
router.get('/availability/:userId', userController_1.getUserAvailability);
// Update current user's profile
router.put('/me', authMiddleware_1.authenticate, userController_1.updateCurrentUser);
// Get user by ID
router.get('/:id', userController_1.getUserById);
// Update user by ID (admin only)
router.put('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.admin), userController_1.updateUser);
// Delete user (admin only)
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.admin), userController_1.deleteUser);
exports.default = router;
