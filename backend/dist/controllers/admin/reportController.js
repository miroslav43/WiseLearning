"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrollmentStats = exports.getPaymentsReport = void 0;
const index_1 = require("../../index");
/**
 * Get payments report
 * Generates a report of payments with filtering options
 */
const getPaymentsReport = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        // Build query filters
        const filters = {};
        if (startDate) {
            filters.createdAt = {
                gte: new Date(startDate)
            };
        }
        if (endDate) {
            if (!filters.createdAt)
                filters.createdAt = {};
            filters.createdAt.lte = new Date(endDate);
        }
        if (status) {
            filters.status = status;
        }
        const payments = await index_1.prisma.payment.findMany({
            where: filters,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        // Calculate summary statistics
        const totalAmount = payments.reduce((sum, payment) => {
            return payment.status === 'completed'
                ? sum + (Number(payment.amount) || 0)
                : sum;
        }, 0);
        const countByStatus = payments.reduce((acc, payment) => {
            acc[payment.status] = (acc[payment.status] || 0) + 1;
            return acc;
        }, {});
        const countByType = payments.reduce((acc, payment) => {
            acc[payment.referenceType] = (acc[payment.referenceType] || 0) + 1;
            return acc;
        }, {});
        const summary = {
            totalPayments: payments.length,
            totalAmount,
            countByStatus,
            countByType
        };
        res.status(200).json({
            payments,
            summary
        });
    }
    catch (error) {
        console.error('Error fetching payments report:', error);
        res.status(500).json({ message: 'Error fetching payments report' });
    }
};
exports.getPaymentsReport = getPaymentsReport;
/**
 * Get enrollment statistics
 * Generates enrollment statistics including course popularity and trends
 */
const getEnrollmentStats = async (req, res) => {
    try {
        // Get total enrollments
        const totalEnrollments = await index_1.prisma.enrollment.count();
        // Get enrollments by course
        const enrollmentsByCourse = await index_1.prisma.enrollment.groupBy({
            by: ['courseId'],
            _count: {
                id: true
            }
        });
        // Get course details for the enrollments
        const courseDetails = await index_1.prisma.course.findMany({
            where: {
                id: {
                    in: enrollmentsByCourse.map((e) => e.courseId)
                }
            },
            select: {
                id: true,
                title: true,
                teacherId: true,
                teacher: {
                    select: {
                        name: true
                    }
                }
            }
        });
        // Combine enrollment counts with course details
        const coursesWithEnrollments = enrollmentsByCourse.map((enrollment) => {
            const course = courseDetails.find((c) => c.id === enrollment.courseId);
            return {
                courseId: enrollment.courseId,
                courseTitle: course?.title || 'Unknown Course',
                teacherName: course?.teacher.name || 'Unknown Teacher',
                enrollmentCount: enrollment._count.id
            };
        }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        // Get monthly enrollment statistics for the last 12 months
        const today = new Date();
        const monthlyStats = [];
        for (let i = 0; i < 12; i++) {
            const startDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const endDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
            const count = await index_1.prisma.enrollment.count({
                where: {
                    enrolledAt: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            });
            monthlyStats.push({
                month: startDate.toLocaleString('default', { month: 'long' }),
                year: startDate.getFullYear(),
                count
            });
        }
        res.status(200).json({
            totalEnrollments,
            topCourses: coursesWithEnrollments,
            monthlyStats: monthlyStats.reverse() // Show oldest to newest
        });
    }
    catch (error) {
        console.error('Error fetching enrollment statistics:', error);
        res.status(500).json({ message: 'Error fetching enrollment statistics' });
    }
};
exports.getEnrollmentStats = getEnrollmentStats;
