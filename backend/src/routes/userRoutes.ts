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