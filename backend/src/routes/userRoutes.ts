import { Role } from '@prisma/client';
import { Router } from 'express';
import {
    deleteUser,
    getAllUsers,
    getTeacherProfile,
    getUserAvailability,
    getUserById,
    getUserPointsTransactions,
    setUserAvailability,
    updateCurrentUser,
    updateTeacherProfile,
    updateUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize(Role.admin), getAllUsers);

// Get user points transactions
router.get('/points/transactions', authenticate, getUserPointsTransactions);

// Get teacher profile
router.get('/teacher/:id', getTeacherProfile);

// Update teacher profile
router.put('/teacher/profile', authenticate, authorize(Role.teacher), updateTeacherProfile);

// Teacher dashboard endpoints
router.get('/teacher/dashboard/stats', authenticate, authorize(Role.teacher), (req, res) => {
  // Mock response for now
  res.json({
    coursesCount: 3,
    studentsCount: 45,
    assignmentsCount: 8,
    reviewsCount: 24
  });
});

router.get('/teacher/dashboard/courses', authenticate, authorize(Role.teacher), (req, res) => {
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

router.get('/teacher/dashboard/activities', authenticate, authorize(Role.teacher), (req, res) => {
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

router.get('/teacher/dashboard/reviews', authenticate, authorize(Role.teacher), (req, res) => {
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
router.post('/availability', authenticate, setUserAvailability);

// Get user availability
router.get('/availability/:userId', getUserAvailability);

// Update current user's profile
router.put('/me', authenticate, updateCurrentUser);

// Get user by ID
router.get('/:id', getUserById);

// Update user by ID (admin only)
router.put('/:id', authenticate, authorize(Role.admin), updateUser);

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(Role.admin), deleteUser);

export default router; 