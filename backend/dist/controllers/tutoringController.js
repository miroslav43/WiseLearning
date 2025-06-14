"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTutoringSession = exports.updateTutoringSession = exports.createTutoringSession = exports.getMyTutoringSessions = exports.getTeacherTutoringSessions = exports.getTutoringSessionById = exports.getAllTutoringSessions = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../index");
// Get all approved tutoring sessions
const getAllTutoringSessions = async (req, res) => {
    try {
        const { subject, locationType, featured } = req.query;
        // Build query filters
        const filters = {
            status: client_1.TutoringStatus.approved
        };
        if (subject) {
            filters.subject = subject;
        }
        if (locationType) {
            filters.locationType = locationType;
        }
        if (featured === 'true') {
            filters.featured = true;
        }
        const sessions = await index_1.prisma.tutoringSession.findMany({
            where: filters,
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        teacherProfile: true
                    }
                },
                availability: true,
                reviews: {
                    include: {
                        student: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        // Calculate average rating for each session
        const sessionsWithRatings = sessions.map(session => {
            const reviews = session.reviews;
            const averageRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                : 0;
            return {
                ...session,
                rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
            };
        });
        res.status(200).json(sessionsWithRatings);
    }
    catch (error) {
        console.error('Error fetching tutoring sessions:', error);
        res.status(500).json({ message: 'Error fetching tutoring sessions' });
    }
};
exports.getAllTutoringSessions = getAllTutoringSessions;
// Get tutoring session by ID
const getTutoringSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        teacherProfile: true
                    }
                },
                availability: true,
                reviews: {
                    include: {
                        student: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });
        if (!session) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        // Allow access if:
        // 1. Session is approved (public access)
        // 2. User is the teacher who owns the session (can access their own regardless of status)
        // 3. User is an admin
        const isOwner = req.user && req.user.id === session.teacherId;
        const isAdmin = req.user && req.user.role === 'admin';
        const isApproved = session.status === client_1.TutoringStatus.approved;
        if (!isApproved && !isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Tutoring session not available' });
        }
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Error fetching tutoring session:', error);
        res.status(500).json({ message: 'Error fetching tutoring session' });
    }
};
exports.getTutoringSessionById = getTutoringSessionById;
// Get tutoring sessions by teacher ID
const getTeacherTutoringSessions = async (req, res) => {
    try {
        const { id } = req.params;
        const sessions = await index_1.prisma.tutoringSession.findMany({
            where: {
                teacherId: id,
                status: client_1.TutoringStatus.approved
            },
            include: {
                availability: true,
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(sessions);
    }
    catch (error) {
        console.error('Error fetching teacher tutoring sessions:', error);
        res.status(500).json({ message: 'Error fetching teacher tutoring sessions' });
    }
};
exports.getTeacherTutoringSessions = getTeacherTutoringSessions;
// Get my tutoring sessions (for the current teacher)
const getMyTutoringSessions = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const sessions = await index_1.prisma.tutoringSession.findMany({
            where: {
                teacherId: req.user.id
            },
            include: {
                availability: true,
                reviews: true,
                requests: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(sessions);
    }
    catch (error) {
        console.error('Error fetching my tutoring sessions:', error);
        res.status(500).json({ message: 'Error fetching my tutoring sessions' });
    }
};
exports.getMyTutoringSessions = getMyTutoringSessions;
// Create a new tutoring session
const createTutoringSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { subject, description, pricePerHour, locationType, maxStudents = 1, prerequisites = [], level, tags = [], availability = [] } = req.body;
        // Validate required fields
        if (!subject || !pricePerHour || !locationType) {
            return res.status(400).json({ message: 'Subject, price per hour, and location type are required' });
        }
        // Create the tutoring session
        const session = await index_1.prisma.tutoringSession.create({
            data: {
                teacherId: req.user.id,
                subject,
                description,
                pricePerHour,
                locationType,
                maxStudents,
                prerequisites,
                level,
                tags,
                status: client_1.TutoringStatus.pending
            }
        });
        // Create availability slots if provided
        if (availability.length > 0) {
            await index_1.prisma.tutoringAvailability.createMany({
                data: availability.map((slot) => ({
                    sessionId: session.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
                    endTime: new Date(`1970-01-01T${slot.endTime}:00Z`)
                }))
            });
        }
        res.status(201).json({
            message: 'Tutoring session created successfully',
            sessionId: session.id
        });
    }
    catch (error) {
        console.error('Error creating tutoring session:', error);
        res.status(500).json({ message: 'Error creating tutoring session' });
    }
};
exports.createTutoringSession = createTutoringSession;
// Update a tutoring session
const updateTutoringSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { id } = req.params;
        const { subject, description, pricePerHour, locationType, maxStudents, prerequisites, level, tags, availability } = req.body;
        // Check if session exists and belongs to the user
        const sessionExists = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            select: { teacherId: true }
        });
        if (!sessionExists) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        if (sessionExists.teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this session' });
        }
        // Update session
        const updatedSession = await index_1.prisma.tutoringSession.update({
            where: { id },
            data: {
                subject,
                description,
                pricePerHour,
                locationType,
                maxStudents,
                prerequisites,
                level,
                tags,
                updatedAt: new Date()
            }
        });
        // Update availability if provided
        if (availability) {
            // Delete existing availability
            await index_1.prisma.tutoringAvailability.deleteMany({
                where: { sessionId: id }
            });
            // Create new availability
            if (availability.length > 0) {
                await index_1.prisma.tutoringAvailability.createMany({
                    data: availability.map((slot) => ({
                        sessionId: id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
                        endTime: new Date(`1970-01-01T${slot.endTime}:00Z`)
                    }))
                });
            }
        }
        res.status(200).json({
            message: 'Tutoring session updated successfully',
            sessionId: updatedSession.id
        });
    }
    catch (error) {
        console.error('Error updating tutoring session:', error);
        res.status(500).json({ message: 'Error updating tutoring session' });
    }
};
exports.updateTutoringSession = updateTutoringSession;
// Delete a tutoring session
const deleteTutoringSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { id } = req.params;
        // Check if session exists and belongs to the user
        const session = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            select: { teacherId: true }
        });
        if (!session) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        if (session.teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this session' });
        }
        // Delete session (this will cascade to related records due to foreign key constraints)
        await index_1.prisma.tutoringSession.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Tutoring session deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting tutoring session:', error);
        res.status(500).json({ message: 'Error deleting tutoring session' });
    }
};
exports.deleteTutoringSession = deleteTutoringSession;
