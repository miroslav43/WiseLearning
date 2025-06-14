"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getUserEvents = void 0;
const index_1 = require("../../index");
/**
 * Get user's calendar events with optional date filters
 */
const getUserEvents = async (userId, startDate, endDate) => {
    const where = { userId };
    // Add date filters if provided
    if (startDate || endDate) {
        where.startTime = {};
        if (startDate) {
            where.startTime.gte = startDate;
        }
        if (endDate) {
            where.startTime.lte = endDate;
        }
    }
    return index_1.prisma.calendarEvent.findMany({
        where,
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    image: true
                }
            },
            lesson: {
                select: {
                    id: true,
                    title: true,
                    type: true
                }
            },
            teacher: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            student: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });
};
exports.getUserEvents = getUserEvents;
/**
 * Create a new calendar event
 */
const createEvent = async (userId, eventData) => {
    return index_1.prisma.calendarEvent.create({
        data: {
            userId,
            title: eventData.title,
            description: eventData.description,
            type: eventData.type,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            courseId: eventData.courseId,
            lessonId: eventData.lessonId,
            teacherId: eventData.teacherId,
            studentId: eventData.studentId,
            location: eventData.location
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true
                }
            },
            lesson: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
};
exports.createEvent = createEvent;
/**
 * Update a calendar event
 */
const updateEvent = async (id, userId, eventData) => {
    // First check if event exists and belongs to user
    const event = await index_1.prisma.calendarEvent.findUnique({
        where: { id }
    });
    if (!event) {
        throw new Error('Calendar event not found');
    }
    if (event.userId !== userId) {
        throw new Error('Cannot update an event that does not belong to you');
    }
    return index_1.prisma.calendarEvent.update({
        where: { id },
        data: eventData,
        include: {
            course: {
                select: {
                    id: true,
                    title: true
                }
            },
            lesson: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
};
exports.updateEvent = updateEvent;
/**
 * Delete a calendar event
 */
const deleteEvent = async (id, userId) => {
    // First check if event exists and belongs to user
    const event = await index_1.prisma.calendarEvent.findUnique({
        where: { id }
    });
    if (!event) {
        throw new Error('Calendar event not found');
    }
    if (event.userId !== userId) {
        throw new Error('Cannot delete an event that does not belong to you');
    }
    return index_1.prisma.calendarEvent.delete({
        where: { id }
    });
};
exports.deleteEvent = deleteEvent;
