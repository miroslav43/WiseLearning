"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Get user notifications
router.get('/', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const notifications = await index_1.prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to 50 most recent notifications
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});
// Mark notification as read
router.patch('/:id/read', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { id } = req.params;
        // Update notification
        const notification = await index_1.prisma.notification.updateMany({
            where: {
                id,
                userId: req.user.id
            },
            data: { read: true }
        });
        if (notification.count === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
});
// Mark all notifications as read
router.patch('/mark-all-read', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        await index_1.prisma.notification.updateMany({
            where: {
                userId: req.user.id,
                read: false
            },
            data: { read: true }
        });
        res.status(200).json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        console.error('Error updating notifications:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
});
// Send tutoring request notification
router.post('/tutoring-request', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { requestId, teacherId, message } = req.body;
        if (!teacherId || !message) {
            return res.status(400).json({ message: 'Teacher ID and message are required' });
        }
        // Create notification for the teacher
        const notification = await index_1.prisma.notification.create({
            data: {
                userId: teacherId,
                title: 'Cerere nouă de tutoriat',
                message,
                type: 'TUTORING_REQUEST',
                link: `/teacher/tutoring/requests`
            }
        });
        res.status(201).json({
            message: 'Notification sent successfully',
            notification
        });
    }
    catch (error) {
        console.error('Error sending tutoring request notification:', error);
        res.status(500).json({ message: 'Error sending notification' });
    }
});
// Get unread notifications count
router.get('/unread-count', authMiddleware_1.authenticate, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const count = await index_1.prisma.notification.count({
            where: {
                userId: req.user.id,
                read: false
            }
        });
        res.status(200).json({ count });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Error fetching unread count' });
    }
});
exports.default = router;
