import { CourseStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Manage course approvals
 * Retrieves courses for admin approval with optional status filtering
 */
export const manageCourseApprovals = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    // Build query filters
    const filters: any = {};
    
    if (status) {
      filters.status = status as CourseStatus;
    }
    
    const courses = await prisma.course.findMany({
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
  } catch (error) {
    console.error('Error fetching courses for approval:', error);
    res.status(500).json({ message: 'Error fetching courses for approval' });
  }
};

/**
 * Update course status
 * Changes a course's status and notifies the teacher
 */
export const updateCourseStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true
      }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Update course status
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: status as CourseStatus,
        updatedAt: new Date()
      }
    });
    
    // Create notification for the teacher
    await prisma.notification.create({
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
  } catch (error) {
    console.error('Error updating course status:', error);
    res.status(500).json({ message: 'Error updating course status' });
  }
}; 