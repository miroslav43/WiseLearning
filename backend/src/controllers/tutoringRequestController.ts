import { TutoringRequestStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../index';

// Create a new tutoring request
export const createTutoringRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { sessionId } = req.params;
    const { message, preferredDates } = req.body;
    
    // Check if session exists and is approved
    const session = await prisma.tutoringSession.findUnique({
      where: { id: sessionId },
      select: { 
        id: true, 
        teacherId: true, 
        status: true, 
        subject: true 
      }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    if (session.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot request tutoring for unapproved sessions' });
    }
    
    // Check if user is not the teacher
    if (session.teacherId === req.user.id) {
      return res.status(400).json({ message: 'Teachers cannot request their own tutoring sessions' });
    }
    
    // Check if user already has a pending request for this session
    const existingRequest = await prisma.tutoringRequest.findFirst({
      where: {
        sessionId,
        studentId: req.user.id,
        status: 'pending'
      }
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this session' });
    }
    
    // Create the request
    const request = await prisma.tutoringRequest.create({
      data: {
        sessionId,
        studentId: req.user.id,
        message,
        preferredDates: preferredDates || [],
        status: TutoringRequestStatus.pending
      },
      include: {
        session: {
          select: {
            id: true,
            subject: true,
            teacher: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Create notification for the teacher
    await prisma.notification.create({
      data: {
        userId: request.session.teacher.id,
        title: 'Cerere nouă de tutoriat',
        message: `${request.student.name} a trimis o cerere pentru sesiunea de ${request.session.subject}`,
        type: 'TUTORING_REQUEST',
        link: `/teacher/tutoring/requests`
      }
    });

    res.status(201).json({
      message: 'Tutoring request created successfully',
      request
    });
  } catch (error) {
    console.error('Error creating tutoring request:', error);
    res.status(500).json({ message: 'Error creating tutoring request' });
  }
};

// Get requests for a specific session (teacher only)
export const getSessionRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { sessionId } = req.params;
    
    // Verify the session belongs to the current user
    const session = await prisma.tutoringSession.findUnique({
      where: { id: sessionId },
      select: { teacherId: true }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these requests' });
    }
    
    const requests = await prisma.tutoringRequest.findMany({
      where: { sessionId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        appointment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching session requests:', error);
    res.status(500).json({ message: 'Error fetching session requests' });
  }
};

// Get my requests (student view)
export const getMyRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const requests = await prisma.tutoringRequest.findMany({
      where: { studentId: req.user.id },
      include: {
        session: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        appointment: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    res.status(500).json({ message: 'Error fetching my requests' });
  }
};

// Update request status (accept/reject)
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId } = req.params;
    const { status, scheduledAt, duration, notes, meetingLink } = req.body;
    
    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
    }
    
    // Get the request with session info
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      include: {
        session: {
          select: {
            teacherId: true,
            pricePerHour: true
          }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if user is the teacher
    if (request.session.teacherId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }
    
    // Check if request is still pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending requests' });
    }
    
    if (status === 'accepted') {
      // Validate required fields for acceptance
      if (!scheduledAt || !duration) {
        return res.status(400).json({ message: 'Scheduled time and duration are required for acceptance' });
      }
      
      // Calculate price
      const price = Number(request.session.pricePerHour) * (duration / 60);
      
      // Create appointment and update request in transaction
      await prisma.$transaction(async (tx) => {
        // Update request status
        await tx.tutoringRequest.update({
          where: { id: requestId },
          data: { 
            status: TutoringRequestStatus.accepted,
            updatedAt: new Date()
          }
        });
        
        // Create appointment
        await tx.tutoringAppointment.create({
          data: {
            requestId,
            sessionId: request.sessionId,
            teacherId: request.session.teacherId,
            studentId: request.studentId,
            scheduledAt: new Date(scheduledAt),
            duration,
            notes,
            meetingLink,
            price,
            status: 'confirmed'
          }
        });
      });
      
      res.status(200).json({ message: 'Request accepted and appointment created' });
    } else {
      // Reject the request
      await prisma.tutoringRequest.update({
        where: { id: requestId },
        data: { 
          status: TutoringRequestStatus.rejected,
          updatedAt: new Date()
        }
      });
      
      res.status(200).json({ message: 'Request rejected' });
    }
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
};

// Cancel a request (student only, if still pending)
export const cancelRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId } = req.params;
    
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      select: { 
        studentId: true, 
        status: true 
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }
    
    await prisma.tutoringRequest.delete({
      where: { id: requestId }
    });
    
    res.status(200).json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Error cancelling request' });
  }
}; 