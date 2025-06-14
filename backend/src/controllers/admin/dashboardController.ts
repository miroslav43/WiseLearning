import { CourseStatus, TutoringStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Get dashboard statistics for admin
 * Provides overview of users, courses, tutoring, enrollments and payments
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });
    
    // Get courses stats
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({
      where: { status: CourseStatus.published }
    });
    const coursesThisMonth = await prisma.course.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)) // First day of current month
        }
      }
    });
    
    // Get tutoring stats
    const totalTutoringSessions = await prisma.tutoringSession.count();
    const activeTutoringSessions = await prisma.tutoringSession.count({
      where: { status: TutoringStatus.approved }
    });
    
    // Get enrollments stats
    const totalEnrollments = await prisma.enrollment.count();
    const enrollmentsThisMonth = await prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: new Date(new Date().setDate(1)) // First day of current month
        }
      }
    });
    
    // Get payments stats
    const totalPayments = await prisma.payment.count();
    const completedPayments = await prisma.payment.count({
      where: { status: 'completed' }
    });
    
    // Get revenue stats
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'completed' },
      _sum: {
        amount: true
      }
    });
    
    // Get recent activity
    const recentEnrollments = await prisma.enrollment.findMany({
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
    
    const recentPayments = await prisma.payment.findMany({
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
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

/**
 * Get user growth data for dashboard charts
 */
export const getUserGrowthData = async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateRange: Date;
    if (period === 'year') {
      dateRange = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    } else {
      dateRange = new Date(new Date().setMonth(new Date().getMonth() - 1));
    }
    
    const userGrowth = await prisma.user.groupBy({
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
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    res.status(500).json({ message: 'Error fetching user growth data' });
  }
};

/**
 * Get course performance data for dashboard charts
 */
export const getCoursePerformanceData = async (req: Request, res: Response) => {
  try {
    const coursePerformance = await prisma.course.findMany({
      where: {
        status: CourseStatus.published
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
  } catch (error) {
    console.error('Error fetching course performance data:', error);
    res.status(500).json({ message: 'Error fetching course performance data' });
  }
};

/**
 * Get approval requests data for dashboard
 */
export const getApprovalRequests = async (req: Request, res: Response) => {
  try {
    // Get pending courses
    const pendingCourses = await prisma.course.count({
      where: { status: CourseStatus.draft }
    });
    
    // Get pending tutoring sessions
    const pendingTutoring = await prisma.tutoringSession.count({
      where: { status: TutoringStatus.pending }
    });
    
    // Get recent pending courses
    const recentPendingCourses = await prisma.course.findMany({
      where: { status: CourseStatus.draft },
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
    const recentPendingTutoring = await prisma.tutoringSession.findMany({
      where: { status: TutoringStatus.pending },
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
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    res.status(500).json({ message: 'Error fetching approval requests' });
  }
}; 