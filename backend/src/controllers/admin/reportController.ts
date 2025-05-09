import { Request, Response } from 'express';
import { prisma } from '../../index';
import { PaymentSummary } from './types';

/**
 * Get payments report
 * Generates a report of payments with filtering options
 */
export const getPaymentsReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    // Build query filters
    const filters: any = {};
    
    if (startDate) {
      filters.createdAt = {
        gte: new Date(startDate as string)
      };
    }
    
    if (endDate) {
      if (!filters.createdAt) filters.createdAt = {};
      filters.createdAt.lte = new Date(endDate as string);
    }
    
    if (status) {
      filters.status = status;
    }
    
    const payments = await prisma.payment.findMany({
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
    const totalAmount = payments.reduce((sum: number, payment: any) => {
      return payment.status === 'completed' 
        ? sum + (Number(payment.amount) || 0) 
        : sum;
    }, 0);
    
    const countByStatus = payments.reduce((acc: Record<string, number>, payment: any) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {});
    
    const countByType = payments.reduce((acc: Record<string, number>, payment: any) => {
      acc[payment.referenceType] = (acc[payment.referenceType] || 0) + 1;
      return acc;
    }, {});
    
    const summary: PaymentSummary = {
      totalPayments: payments.length,
      totalAmount,
      countByStatus,
      countByType
    };
    
    res.status(200).json({
      payments,
      summary
    });
  } catch (error) {
    console.error('Error fetching payments report:', error);
    res.status(500).json({ message: 'Error fetching payments report' });
  }
};

/**
 * Get enrollment statistics
 * Generates enrollment statistics including course popularity and trends
 */
export const getEnrollmentStats = async (req: Request, res: Response) => {
  try {
    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count();
    
    // Get enrollments by course
    const enrollmentsByCourse = await prisma.enrollment.groupBy({
      by: ['courseId'],
      _count: {
        id: true
      }
    });
    
    // Get course details for the enrollments
    const courseDetails = await prisma.course.findMany({
      where: {
        id: {
          in: enrollmentsByCourse.map((e: any) => e.courseId)
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
    const coursesWithEnrollments = enrollmentsByCourse.map((enrollment: any) => {
      const course = courseDetails.find((c: any) => c.id === enrollment.courseId);
      return {
        courseId: enrollment.courseId,
        courseTitle: course?.title || 'Unknown Course',
        teacherName: course?.teacher.name || 'Unknown Teacher',
        enrollmentCount: enrollment._count.id
      };
    }).sort((a: any, b: any) => b.enrollmentCount - a.enrollmentCount);
    
    // Get monthly enrollment statistics for the last 12 months
    const today = new Date();
    const monthlyStats = [];
    
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const count = await prisma.enrollment.count({
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
  } catch (error) {
    console.error('Error fetching enrollment statistics:', error);
    res.status(500).json({ message: 'Error fetching enrollment statistics' });
  }
}; 