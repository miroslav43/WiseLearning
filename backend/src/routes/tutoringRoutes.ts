import { Role } from '@prisma/client';
import { Router } from 'express';
import {
  createTutoringRequest,
  createTutoringSession,
  deleteTutoringSession,
  getAllTutoringSessions,
  getMyRequests,
  getMyTutoringSessions,
  getRequestMessages,
  getSessionRequests,
  getTeacherTutoringSessions,
  getTutoringSessionById,
  sendTutoringMessage,
  updateRequestStatus,
  updateTutoringSession
} from '../controllers/tutoringController';
import { authenticate, authorize, checkOwnership } from '../middleware/authMiddleware';

const router = Router();

// Public routes for browsing tutoring sessions
router.get('/sessions', getAllTutoringSessions);
router.get('/sessions/:id', getTutoringSessionById);

// Teacher routes
router.get('/sessions/teacher/:id', getTeacherTutoringSessions);

// My tutoring sessions (as teacher)
router.get('/sessions/my', authenticate, authorize(Role.teacher), getMyTutoringSessions);

// Create tutoring session
router.post('/sessions', authenticate, authorize(Role.teacher), createTutoringSession);

// Update tutoring session
router.put('/sessions/:id', authenticate, checkOwnership('tutoring'), updateTutoringSession);

// Delete tutoring session
router.delete('/sessions/:id', authenticate, checkOwnership('tutoring'), deleteTutoringSession);

// Create tutoring request
router.post('/requests', authenticate, createTutoringRequest);

// Get requests for a session
router.get('/requests/session/:id', authenticate, getSessionRequests);

// Get my requests
router.get('/requests/my', authenticate, getMyRequests);

// Update request status
router.put('/requests/:id/status', authenticate, updateRequestStatus);

// Tutoring messaging
router.post('/messages', authenticate, sendTutoringMessage);

// Get messages for a request
router.get('/messages/request/:id', authenticate, getRequestMessages);

export default router; 