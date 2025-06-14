"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApprovalRequests = exports.getCoursePerformanceData = exports.getUserGrowthData = exports.getDashboardStats = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../../index");
/**
 * Get dashboard statistics for admin
 * Provides overview of users, courses, tutoring, enrollments and payments
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await index_1.prisma.user.count();
        // Get users by role
        const usersByRole = await index_1.prisma.user.groupBy({
            by: ['role'],
            _count: {
                id: true
            }
        });
        // Get courses stats
        const totalCourses = await index_1.prisma.course.count();
        const publishedCourses = await index_1.prisma.course.count({
            where: { status: client_1.CourseStatus.published }
        });
        const coursesThisMonth = await index_1.prisma.course.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(1)) // First day of current month
                }
            }
        });
        // Get tutoring stats
        const totalTutoringSessions = await index_1.prisma.tutoringSession.count();
        const activeTutoringSessions = await index_1.prisma.tutoringSession.count({
            where: { status: client_1.TutoringStatus.approved }
        });
        // Get enrollments stats
        const totalEnrollments = await index_1.prisma.enrollment.count();
        const enrollmentsThisMonth = await index_1.prisma.enrollment.count({
            where: {
                enrolledAt: {
                    gte: new Date(new Date().setDate(1)) // First day of current month
                }
            }
        });
        // Get payments stats
        const totalPayments = await index_1.prisma.payment.count();
        const completedPayments = await index_1.prisma.payment.count({
            where: { status: 'completed' }
        });
        // Get revenue stats
        const totalRevenue = await index_1.prisma.payment.aggregate({
            where: { status: 'completed' },
            _sum: {
                amount: true
            }
        });
        // Get recent activity
        const recentEnrollments = await index_1.prisma.enrollment.findMany({
            take: 10,
            orderBy: { enrolledAt: 'desc' },
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
                        title: true,
                        price: true
                    }
                }
            }
        });
        const recentPayments = await index_1.prisma.payment.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            users: {
                total: totalUsers,
                byRole: usersByRole,
            },
            courses: {
                total: totalCourses,
                published: publishedCourses,
                thisMonth: coursesThisMonth
            },
            tutoring: {
                total: totalTutoringSessions,
                active: activeTutoringSessions
            },
            enrollments: {
                total: totalEnrollments,
                thisMonth: enrollmentsThisMonth
            },
            payments: {
                total: totalPayments,
                completed: completedPayments,
                totalRevenue: totalRevenue._sum.amount || 0
            },
            recentActivity: {
                enrollments: recentEnrollments,
                payments: recentPayments
            }
        });
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
/**
 * Get user growth data for dashboard charts
 */
const getUserGrowthData = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        let dateRange;
        if (period === 'year') {
            dateRange = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        }
        else {
            dateRange = new Date(new Date().setMonth(new Date().getMonth() - 1));
        }
        const userGrowth = await index_1.prisma.user.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: dateRange
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        // Format data for charts
        const formattedData = userGrowth.map(item => ({
            date: item.createdAt.toISOString().split('T')[0],
            users: item._count.id
        }));
        res.status(200).json(formattedData);
    }
    catch (error) {
        console.error('Error fetching user growth data:', error);
        res.status(500).json({ message: 'Error fetching user growth data' });
    }
};
exports.getUserGrowthData = getUserGrowthData;
/**
 * Get course performance data for dashboard charts
 */
const getCoursePerformanceData = async (req, res) => {
    try {
        const coursePerformance = await index_1.prisma.course.findMany({
            where: {
                status: client_1.CourseStatus.published
            },
            select: {
                id: true,
                title: true,
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            },
            orderBy: {
                enrollments: {
                    _count: 'desc'
                }
            },
            take: 10
        });
        const formattedData = coursePerformance.map(course => ({
            courseId: course.id,
            title: course.title,
            enrollments: course._count.enrollments
        }));
        res.status(200).json(formattedData);
    }
    catch (error) {
        console.error('Error fetching course performance data:', error);
        res.status(500).json({ message: 'Error fetching course performance data' });
    }
};
exports.getCoursePerformanceData = getCoursePerformanceData;
/**
 * Get approval requests data for dashboard
 */
const getApprovalRequests = async (req, res) => {
    try {
        // Get pending courses
        const pendingCourses = await index_1.prisma.course.count({
            where: { status: client_1.CourseStatus.draft }
        });
        // Get pending tutoring sessions
        const pendingTutoring = await index_1.prisma.tutoringSession.count({
            where: { status: client_1.TutoringStatus.pending }
        });
        // Get recent pending courses
        const recentPendingCourses = await index_1.prisma.course.findMany({
            where: { status: client_1.CourseStatus.draft },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        // Get recent pending tutoring sessions
        const recentPendingTutoring = await index_1.prisma.tutoringSession.findMany({
            where: { status: client_1.TutoringStatus.pending },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        res.status(200).json({
            summary: {
                pendingCourses,
                pendingTutoring,
                total: pendingCourses + pendingTutoring
            },
            recentRequests: {
                courses: recentPendingCourses,
                tutoring: recentPendingTutoring
            }
        });
    }
    catch (error) {
        console.error('Error fetching approval requests:', error);
        res.status(500).json({ message: 'Error fetching approval requests' });
    }
};
exports.getApprovalRequests = getApprovalRequests;
