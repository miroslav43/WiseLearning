"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectTutoringSession = exports.approveTutoringSession = exports.updateTutoringStatus = exports.manageTutoringApprovals = void 0;
const index_1 = require("../../index");
/**
 * Manage tutoring session approvals
 * Retrieves tutoring sessions for admin approval with optional status filtering
 */
const manageTutoringApprovals = async (req, res) => {
    try {
        const { status } = req.query;
        // Build query filters
        const filters = {};
        if (status) {
            filters.status = status;
        }
        const tutoringSessions = await index_1.prisma.tutoringSession.findMany({
            where: filters,
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        res.status(200).json(tutoringSessions);
    }
    catch (error) {
        console.error('Error fetching tutoring sessions for approval:', error);
        res.status(500).json({ message: 'Error fetching tutoring sessions for approval' });
    }
};
exports.manageTutoringApprovals = manageTutoringApprovals;
/**
 * Update tutoring session status
 * Changes a tutoring session's status and notifies the teacher
 */
const updateTutoringStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Check if tutoring session exists
        const tutoringSession = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            include: {
                teacher: true
            }
        });
        if (!tutoringSession) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        // Update tutoring session status
        const updatedSession = await index_1.prisma.tutoringSession.update({
            where: { id },
            data: {
                status: status,
                updatedAt: new Date()
            }
        });
        // Create notification for the teacher
        await index_1.prisma.notification.create({
            data: {
                userId: tutoringSession.teacherId,
                title: `Tutoring Session ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                message: `Your tutoring session for "${tutoringSession.subject}" has been ${status === 'approved' ? 'approved' : 'rejected'}.`,
                type: status === 'approved' ? 'success' : 'warning',
                link: `/teacher/tutoring/${tutoringSession.id}`,
                read: false
            }
        });
        res.status(200).json({
            message: `Tutoring session status updated to ${status}`,
            sessionId: updatedSession.id,
            status: updatedSession.status
        });
    }
    catch (error) {
        console.error('Error updating tutoring session status:', error);
        res.status(500).json({ message: 'Error updating tutoring session status' });
    }
};
exports.updateTutoringStatus = updateTutoringStatus;
/**
 * Approve tutoring session and send notification
 */
const approveTutoringSession = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if tutoring session exists
        const tutoringSession = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            include: {
                teacher: true
            }
        });
        if (!tutoringSession) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        // Update tutoring session status to approved
        const updatedSession = await index_1.prisma.tutoringSession.update({
            where: { id },
            data: {
                status: 'approved',
                updatedAt: new Date()
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });
        // Create notification for the teacher
        await index_1.prisma.notification.create({
            data: {
                userId: tutoringSession.teacherId,
                title: 'Sesiune de tutoriat aprobată',
                message: `Sesiunea ta de tutoriat pentru "${tutoringSession.subject}" a fost aprobată și este acum disponibilă pentru studenți.`,
                type: 'success',
                link: `/teacher/tutoring/${tutoringSession.id}`,
                read: false
            }
        });
        res.status(200).json({
            message: 'Tutoring session approved successfully',
            session: updatedSession
        });
    }
    catch (error) {
        console.error('Error approving tutoring session:', error);
        res.status(500).json({ message: 'Error approving tutoring session' });
    }
};
exports.approveTutoringSession = approveTutoringSession;
/**
 * Reject tutoring session and send notification
 */
const rejectTutoringSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        // Check if tutoring session exists
        const tutoringSession = await index_1.prisma.tutoringSession.findUnique({
            where: { id },
            include: {
                teacher: true
            }
        });
        if (!tutoringSession) {
            return res.status(404).json({ message: 'Tutoring session not found' });
        }
        // Update tutoring session status to rejected
        const updatedSession = await index_1.prisma.tutoringSession.update({
            where: { id },
            data: {
                status: 'rejected',
                updatedAt: new Date()
            },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });
        // Create notification for the teacher
        await index_1.prisma.notification.create({
            data: {
                userId: tutoringSession.teacherId,
                title: 'Sesiune de tutoriat respinsă',
                message: `Sesiunea ta de tutoriat pentru "${tutoringSession.subject}" a fost respinsă.${reason ? ` Motiv: ${reason}` : ''}`,
                type: 'warning',
                link: `/teacher/tutoring/${tutoringSession.id}`,
                read: false
            }
        });
        res.status(200).json({
            message: 'Tutoring session rejected successfully',
            session: updatedSession
        });
    }
    catch (error) {
        console.error('Error rejecting tutoring session:', error);
        res.status(500).json({ message: 'Error rejecting tutoring session' });
    }
};
exports.rejectTutoringSession = rejectTutoringSession;
