import { Request, Response } from 'express';
import { prisma } from '../index';

// Get teacher profile
export const getTeacherProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const teacherProfile = await prisma.teacherProfile.findUnique({
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
    const tutoringSessions = await prisma.tutoringSession.findMany({
      where: {
        teacherId: id,
        status: 'approved'
      },
      take: 5
    });
    
    // Get teacher's courses
    const courses = await prisma.course.findMany({
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
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
};

// Get current user's teacher profile
export const getMyTeacherProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const teacherProfile = await prisma.teacherProfile.findUnique({
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
  } catch (error) {
    console.error('Error fetching my teacher profile:', error);
    res.status(500).json({ message: 'Error fetching my teacher profile' });
  }
};

// Update teacher profile
export const updateTeacherProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const {
      specialization,
      education,
      experience,
      certificates
    } = req.body;
    
    // Check if teacher profile exists
    const profileExists = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!profileExists) {
      // Create profile if it doesn't exist
      await prisma.teacherProfile.create({
        data: {
          userId: req.user.id,
          specialization: specialization || [],
          education: education || null,
          experience: experience || null,
          certificates: certificates || [],
          students: 0
        }
      });
    } else {
      // Update existing profile
      await prisma.teacherProfile.update({
        where: { userId: req.user.id },
        data: {
          specialization: specialization || undefined,
          education: education !== undefined ? education : undefined,
          experience: experience !== undefined ? experience : undefined,
          certificates: certificates || undefined
        }
      });
    }
    
    const updatedProfile = await prisma.teacherProfile.findUnique({
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
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    res.status(500).json({ message: 'Error updating teacher profile' });
  }
};

// Update teacher statistics (student count, etc.)
export const updateTeacherStats = async (req: Request, res: Response) => {
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
    const studentCount = await prisma.enrollment.count({
      where: {
        course: {
          teacherId
        }
      },
      distinct: ['userId']
    });
    
    // Calculate tutoring students
    const tutoringStudentCount = await prisma.tutoringRequest.count({
      where: {
        session: {
          teacherId
        },
        status: 'accepted'
      },
      distinct: ['studentId']
    });
    
    // Update teacher profile
    await prisma.teacherProfile.update({
      where: { userId: teacherId },
      data: {
        students: studentCount + tutoringStudentCount
      }
    });
    
    res.status(200).json({ 
      message: 'Teacher statistics updated',
      totalStudents: studentCount + tutoringStudentCount
    });
  } catch (error) {
    console.error('Error updating teacher stats:', error);
    res.status(500).json({ message: 'Error updating teacher stats' });
  }
};

// Get teacher dashboard data
export const getTeacherDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get basic profile
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    
    // Get course statistics
    const courseStats = await prisma.course.groupBy({
      by: ['status'],
      where: { teacherId: req.user.id },
      _count: true
    });
    
    // Get tutoring session statistics
    const tutoringStats = await prisma.tutoringSession.groupBy({
      by: ['status'],
      where: { teacherId: req.user.id },
      _count: true
    });
    
    // Get recent enrollments
    const recentEnrollments = await prisma.enrollment.findMany({
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
    const recentRequests = await prisma.tutoringRequest.findMany({
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
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    res.status(500).json({ message: 'Error fetching teacher dashboard' });
  }
}; 