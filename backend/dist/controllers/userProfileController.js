"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeacherDashboard = exports.updateTeacherStats = exports.updateTeacherProfile = exports.getMyTeacherProfile = exports.getTeacherProfile = void 0;
const index_1 = require("../index");
// Get teacher profile
const getTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherProfile = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });
        if (!teacherProfile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }
        // Get teacher's tutoring sessions
        const tutoringSessions = await index_1.prisma.tutoringSession.findMany({
            where: {
                teacherId: id,
                status: 'approved'
            },
            take: 5
        });
        // Get teacher's courses
        const courses = await index_1.prisma.course.findMany({
            where: {
                teacherId: id,
                status: 'published'
            },
            take: 5
        });
        res.status(200).json({
            ...teacherProfile,
            tutoringSessions,
            courses
        });
    }
    catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({ message: 'Error fetching teacher profile' });
    }
};
exports.getTeacherProfile = getTeacherProfile;
// Get current user's teacher profile
const getMyTeacherProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const teacherProfile = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });
        if (!teacherProfile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }
        res.status(200).json(teacherProfile);
    }
    catch (error) {
        console.error('Error fetching my teacher profile:', error);
        res.status(500).json({ message: 'Error fetching my teacher profile' });
    }
};
exports.getMyTeacherProfile = getMyTeacherProfile;
// Update teacher profile
const updateTeacherProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { specialization, education, experience, certificates } = req.body;
        // Check if teacher profile exists
        const profileExists = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user.id }
        });
        if (!profileExists) {
            // Create profile if it doesn't exist
            await index_1.prisma.teacherProfile.create({
                data: {
                    userId: req.user.id,
                    specialization: specialization || [],
                    education: education || null,
                    experience: experience || null,
                    certificates: certificates || [],
                    students: 0
                }
            });
        }
        else {
            // Update existing profile
            await index_1.prisma.teacherProfile.update({
                where: { userId: req.user.id },
                data: {
                    specialization: specialization || undefined,
                    education: education !== undefined ? education : undefined,
                    experience: experience !== undefined ? experience : undefined,
                    certificates: certificates || undefined
                }
            });
        }
        const updatedProfile = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        bio: true
                    }
                }
            }
        });
        res.status(200).json({
            message: 'Teacher profile updated successfully',
            profile: updatedProfile
        });
    }
    catch (error) {
        console.error('Error updating teacher profile:', error);
        res.status(500).json({ message: 'Error updating teacher profile' });
    }
};
exports.updateTeacherProfile = updateTeacherProfile;
// Update teacher statistics (student count, etc.)
const updateTeacherStats = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { teacherId } = req.params;
        // Only admin or the teacher themselves can update stats
        if (req.user.id !== teacherId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // Calculate student count from enrollments
        const studentCount = await index_1.prisma.enrollment.count({
            where: {
                course: {
                    teacherId
                }
            },
            distinct: ['userId']
        });
        // Calculate tutoring students
        const tutoringStudentCount = await index_1.prisma.tutoringRequest.count({
            where: {
                session: {
                    teacherId
                },
                status: 'accepted'
            },
            distinct: ['studentId']
        });
        // Update teacher profile
        await index_1.prisma.teacherProfile.update({
            where: { userId: teacherId },
            data: {
                students: studentCount + tutoringStudentCount
            }
        });
        res.status(200).json({
            message: 'Teacher statistics updated',
            totalStudents: studentCount + tutoringStudentCount
        });
    }
    catch (error) {
        console.error('Error updating teacher stats:', error);
        res.status(500).json({ message: 'Error updating teacher stats' });
    }
};
exports.updateTeacherStats = updateTeacherStats;
// Get teacher dashboard data
const getTeacherDashboard = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Get basic profile
        const profile = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user.id }
        });
        if (!profile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }
        // Get course statistics
        const courseStats = await index_1.prisma.course.groupBy({
            by: ['status'],
            where: { teacherId: req.user.id },
            _count: true
        });
        // Get tutoring session statistics
        const tutoringStats = await index_1.prisma.tutoringSession.groupBy({
            by: ['status'],
            where: { teacherId: req.user.id },
            _count: true
        });
        // Get recent enrollments
        const recentEnrollments = await index_1.prisma.enrollment.findMany({
            where: {
                course: {
                    teacherId: req.user.id
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                course: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { enrolledAt: 'desc' },
            take: 10
        });
        // Get recent tutoring requests
        const recentRequests = await index_1.prisma.tutoringRequest.findMany({
            where: {
                session: {
                    teacherId: req.user.id
                }
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                session: {
                    select: {
                        id: true,
                        subject: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.status(200).json({
            profile,
            courseStats,
            tutoringStats,
            recentEnrollments,
            recentRequests
        });
    }
    catch (error) {
        console.error('Error fetching teacher dashboard:', error);
        res.status(500).json({ message: 'Error fetching teacher dashboard' });
    }
};
exports.getTeacherDashboard = getTeacherDashboard;
