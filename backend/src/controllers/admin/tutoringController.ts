import { TutoringStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Manage tutoring session approvals
 * Retrieves tutoring sessions for admin approval with optional status filtering
 */
export const manageTutoringApprovals = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    // Build query filters
    const filters: any = {};
    
    if (status) {
      filters.status = status as TutoringStatus;
    }
    
    const tutoringSessions = await prisma.tutoringSession.findMany({
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
  } catch (error) {
    console.error('Error fetching tutoring sessions for approval:', error);
    res.status(500).json({ message: 'Error fetching tutoring sessions for approval' });
  }
};

/**
 * Update tutoring session status
 * Changes a tutoring session's status and notifies the teacher
 */
export const updateTutoringStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if tutoring session exists
    const tutoringSession = await prisma.tutoringSession.findUnique({
      where: { id },
      include: {
        teacher: true
      }
    });
    
    if (!tutoringSession) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    // Update tutoring session status
    const updatedSession = await prisma.tutoringSession.update({
      where: { id },
      data: {
        status: status as TutoringStatus,
        updatedAt: new Date()
      }
    });
    
    // Create notification for the teacher
    await prisma.notification.create({
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
  } catch (error) {
    console.error('Error updating tutoring session status:', error);
    res.status(500).json({ message: 'Error updating tutoring session status' });
  }
}; 