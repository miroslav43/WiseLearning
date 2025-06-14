"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getUserEvents = void 0;
const calendarService = __importStar(require("./calendarService"));
/**
 * Get current user's calendar events
 * GET /api/calendar/events
 */
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        // Convert string dates to Date objects if provided
        const startDateTime = startDate ? new Date(startDate) : undefined;
        const endDateTime = endDate ? new Date(endDate) : undefined;
        const events = await calendarService.getUserEvents(userId, startDateTime, endDateTime);
        res.status(200).json(events);
    }
    catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ message: 'Failed to fetch calendar events' });
    }
};
exports.getUserEvents = getUserEvents;
/**
 * Create calendar event
 * POST /api/calendar/events
 */
const createEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, type, startTime, endTime, courseId, lessonId, teacherId, studentId, location } = req.body;
        // Validate required fields
        if (!title || !type || !startTime) {
            return res.status(400).json({
                message: 'Title, type, and startTime are required fields'
            });
        }
        // Parse dates
        const parsedStartTime = new Date(startTime);
        const parsedEndTime = endTime ? new Date(endTime) : undefined;
        const event = await calendarService.createEvent(userId, {
            title,
            description,
            type,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            courseId,
            lessonId,
            teacherId,
            studentId,
            location
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({ message: 'Failed to create calendar event' });
    }
};
exports.createEvent = createEvent;
/**
 * Update calendar event
 * PUT /api/calendar/events/:id
 */
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, type, startTime, endTime, courseId, lessonId, teacherId, studentId, location } = req.body;
        // Parse dates if provided
        let eventData = {
            title,
            description,
            type,
            courseId,
            lessonId,
            teacherId,
            studentId,
            location
        };
        if (startTime) {
            eventData.startTime = new Date(startTime);
        }
        if (endTime) {
            eventData.endTime = new Date(endTime);
        }
        const event = await calendarService.updateEvent(id, userId, eventData);
        res.status(200).json(event);
    }
    catch (error) {
        console.error(`Error updating calendar event ${req.params.id}:`, error);
        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: 'Calendar event not found' });
            }
            if (error.message.includes('not belong to you')) {
                return res.status(403).json({ message: 'You can only update your own events' });
            }
        }
        res.status(500).json({ message: 'Failed to update calendar event' });
    }
};
exports.updateEvent = updateEvent;
/**
 * Delete calendar event
 * DELETE /api/calendar/events/:id
 */
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await calendarService.deleteEvent(id, userId);
        res.status(200).json({ message: 'Calendar event deleted successfully' });
    }
    catch (error) {
        console.error(`Error deleting calendar event ${req.params.id}:`, error);
        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: 'Calendar event not found' });
            }
            if (error.message.includes('not belong to you')) {
                return res.status(403).json({ message: 'You can only delete your own events' });
            }
        }
        res.status(500).json({ message: 'Failed to delete calendar event' });
    }
};
exports.deleteEvent = deleteEvent;
