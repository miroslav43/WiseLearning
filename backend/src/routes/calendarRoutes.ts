import { Router } from 'express';
import * as calendarController from '../controllers/calendar';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get current user's calendar events
router.get('/events', authenticate, calendarController.getUserEvents);

// Create calendar event
router.post('/events', authenticate, calendarController.createEvent);

// Update calendar event
router.put('/events/:id', authenticate, calendarController.updateEvent);

// Delete calendar event
router.delete('/events/:id', authenticate, calendarController.deleteEvent);

export default router; 