import { Role } from '@prisma/client';
import { Router } from 'express';

// Session controller (CRUD operations)
import {
    createTutoringSession,
    deleteTutoringSession,
    getAllTutoringSessions,
    getMyTutoringSessions,
    getTeacherTutoringSessions,
    getTutoringSessionById,
    updateTutoringSession
} from '../controllers/tutoringController';

// Request controller
import {
    cancelRequest,
    createTutoringRequest,
    getMyRequests,
    getSessionRequests,
    updateRequestStatus
} from '../controllers/tutoringRequestController';

// Message controller
import {
    getMyConversations,
    getRequestMessages,
    getUnreadMessageCount,
    markMessagesAsRead,
    sendTutoringMessage
} from '../controllers/tutoringMessageController';

import { authenticate, authorize, checkOwnership } from '../middleware/authMiddleware';

const router = Router();

// Public session routes
router.get('/', getAllTutoringSessions);
router.get('/:id', getTutoringSessionById);
router.get('/teacher/:id', getTeacherTutoringSessions);

// Protected session CRUD routes
router.get('/my/teaching', authenticate, authorize(Role.teacher, Role.admin), getMyTutoringSessions);
router.post('/', authenticate, authorize(Role.teacher, Role.admin), createTutoringSession);
router.put('/:id', authenticate, authorize(Role.teacher, Role.admin), checkOwnership('tutoringSession'), updateTutoringSession);
router.delete('/:id', authenticate, authorize(Role.teacher, Role.admin), checkOwnership('tutoringSession'), deleteTutoringSession);

// Request routes
router.post('/:sessionId/request', authenticate, createTutoringRequest);
router.get('/:sessionId/requests', authenticate, authorize(Role.teacher, Role.admin), getSessionRequests);
router.get('/requests/my', authenticate, getMyRequests);
router.put('/requests/:requestId/status', authenticate, authorize(Role.teacher, Role.admin), updateRequestStatus);
router.delete('/requests/:requestId', authenticate, cancelRequest);

// Message routes
router.post('/requests/:requestId/messages', authenticate, sendTutoringMessage);
router.get('/requests/:requestId/messages', authenticate, getRequestMessages);
router.put('/requests/:requestId/messages/read', authenticate, markMessagesAsRead);
router.get('/conversations/my', authenticate, getMyConversations);
router.get('/messages/unread-count', authenticate, getUnreadMessageCount);

export default router; 