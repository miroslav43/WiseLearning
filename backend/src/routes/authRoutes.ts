import { Router } from 'express';
import { getCurrentUser, login, register, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfile);

export default router; 