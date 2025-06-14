"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get user's conversations
router.get('/conversations', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Get a specific conversation
router.get('/conversations/:id', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Create a new conversation
router.post('/conversations', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Send a message in a conversation
router.post('/messages', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Mark message as read
router.put('/messages/:id/read', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Get messages for a conversation
router.get('/messages/conversation/:id', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Upload attachment
router.post('/attachments', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
// Delete conversation
router.delete('/conversations/:id', authMiddleware_1.authenticate, async (req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
exports.default = router;
