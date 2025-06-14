"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseStatus = exports.manageCourseApprovals = void 0;
const index_1 = require("../../index");
/**
 * Manage course approvals
 * Retrieves courses for admin approval with optional status filtering
 */
const manageCourseApprovals = async (req, res) => {
    try {
        const { status } = req.query;
        // Build query filters
        const filters = {};
        if (status) {
            filters.status = status;
        }
        const courses = await index_1.prisma.course.findMany({
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
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching courses for approval:', error);
        res.status(500).json({ message: 'Error fetching courses for approval' });
    }
};
exports.manageCourseApprovals = manageCourseApprovals;
/**
 * Update course status
 * Changes a course's status and notifies the teacher
 */
const updateCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Check if course exists
        const course = await index_1.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: true
            }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Update course status
        const updatedCourse = await index_1.prisma.course.update({
            where: { id },
            data: {
                status: status,
                updatedAt: new Date()
            }
        });
        // Create notification for the teacher
        await index_1.prisma.notification.create({
            data: {
                userId: course.teacherId,
                title: `Course ${status === 'published' ? 'Approved' : 'Rejected'}`,
                message: `Your course "${course.title}" has been ${status === 'published' ? 'approved' : 'rejected'}.`,
                type: status === 'published' ? 'success' : 'warning',
                link: `/teacher/courses/${course.id}`,
                read: false
            }
        });
        res.status(200).json({
            message: `Course status updated to ${status}`,
            courseId: updatedCourse.id,
            status: updatedCourse.status
        });
    }
    catch (error) {
        console.error('Error updating course status:', error);
        res.status(500).json({ message: 'Error updating course status' });
    }
};
exports.updateCourseStatus = updateCourseStatus;
