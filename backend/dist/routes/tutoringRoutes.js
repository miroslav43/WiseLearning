"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
// Session controller (CRUD operations)
const tutoringController_1 = require("../controllers/tutoringController");
// Request controller
const tutoringRequestController_1 = require("../controllers/tutoringRequestController");
// Message controller
const tutoringMessageController_1 = require("../controllers/tutoringMessageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public session routes
router.get('/', tutoringController_1.getAllTutoringSessions);
router.get('/:id', tutoringController_1.getTutoringSessionById);
router.get('/teacher/:id', tutoringController_1.getTeacherTutoringSessions);
// Protected session CRUD routes
router.get('/my/teaching', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), tutoringController_1.getMyTutoringSessions);
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), tutoringController_1.createTutoringSession);
router.put('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), (0, authMiddleware_1.checkOwnership)('tutoringSession'), tutoringController_1.updateTutoringSession);
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), (0, authMiddleware_1.checkOwnership)('tutoringSession'), tutoringController_1.deleteTutoringSession);
// Request routes
router.post('/:sessionId/request', authMiddleware_1.authenticate, tutoringRequestController_1.createTutoringRequest);
router.get('/:sessionId/requests', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), tutoringRequestController_1.getSessionRequests);
router.get('/requests/my', authMiddleware_1.authenticate, tutoringRequestController_1.getMyRequests);
router.put('/requests/:requestId/status', authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(client_1.Role.teacher, client_1.Role.admin), tutoringRequestController_1.updateRequestStatus);
router.delete('/requests/:requestId', authMiddleware_1.authenticate, tutoringRequestController_1.cancelRequest);
// Message routes
router.post('/requests/:requestId/messages', authMiddleware_1.authenticate, tutoringMessageController_1.sendTutoringMessage);
router.get('/requests/:requestId/messages', authMiddleware_1.authenticate, tutoringMessageController_1.getRequestMessages);
router.put('/requests/:requestId/messages/read', authMiddleware_1.authenticate, tutoringMessageController_1.markMessagesAsRead);
router.get('/conversations/my', authMiddleware_1.authenticate, tutoringMessageController_1.getMyConversations);
router.get('/messages/unread-count', authMiddleware_1.authenticate, tutoringMessageController_1.getUnreadMessageCount);
exports.default = router;
