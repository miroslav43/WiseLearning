import { TutoringLocationType, TutoringRequestStatus, TutoringStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../index';

// Get all approved tutoring sessions
export const getAllTutoringSessions = async (req: Request, res: Response) => {
  try {
    const { subject, locationType, featured } = req.query;
    
    // Build query filters
    const filters: any = {
      status: TutoringStatus.approved
    };
    
    if (subject) {
      filters.subject = subject as string;
    }
    
    if (locationType) {
      filters.locationType = locationType as TutoringLocationType;
    }
    
    if (featured === 'true') {
      filters.featured = true;
    }
    
    const sessions = await prisma.tutoringSession.findMany({
      where: filters,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            avatar: true,
            teacherProfile: true
          }
        },
        availability: true,
        reviews: {
          include: {
            student: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching tutoring sessions:', error);
    res.status(500).json({ message: 'Error fetching tutoring sessions' });
  }
};

// Get tutoring session by ID
export const getTutoringSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const session = await prisma.tutoringSession.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            avatar: true,
            teacherProfile: true
          }
        },
        availability: true,
        reviews: {
          include: {
            student: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    // If session is not approved and the user is not the teacher or admin, deny access
    if (
      session.status !== TutoringStatus.approved && 
      (!req.user || (req.user.id !== session.teacherId && req.user.role !== 'admin'))
    ) {
      return res.status(403).json({ message: 'Tutoring session not available' });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching tutoring session:', error);
    res.status(500).json({ message: 'Error fetching tutoring session' });
  }
};

// Get tutoring sessions by teacher ID
export const getTeacherTutoringSessions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const sessions = await prisma.tutoringSession.findMany({
      where: {
        teacherId: id,
        status: TutoringStatus.approved
      },
      include: {
        availability: true,
        reviews: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching teacher tutoring sessions:', error);
    res.status(500).json({ message: 'Error fetching teacher tutoring sessions' });
  }
};

// Get my tutoring sessions (for the current teacher)
export const getMyTutoringSessions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const sessions = await prisma.tutoringSession.findMany({
      where: {
        teacherId: req.user.id
      },
      include: {
        availability: true,
        reviews: true,
        requests: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching my tutoring sessions:', error);
    res.status(500).json({ message: 'Error fetching my tutoring sessions' });
  }
};

// Create a new tutoring session
export const createTutoringSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const {
      subject,
      description,
      pricePerHour,
      locationType,
      maxStudents = 1,
      prerequisites = [],
      level,
      tags = [],
      availability = []
    } = req.body;
    
    // Validate required fields
    if (!subject || !pricePerHour || !locationType) {
      return res.status(400).json({ message: 'Subject, price per hour, and location type are required' });
    }
    
    // Create the tutoring session
    const tutoringSession = await prisma.tutoringSession.create({
      data: {
        teacherId: req.user.id,
        subject,
        description,
        pricePerHour,
        locationType: locationType as TutoringLocationType,
        status: TutoringStatus.pending,
        maxStudents,
        prerequisites,
        level,
        tags,
        featured: false
      }
    });
    
    // Create availability slots
    if (availability.length > 0) {
      const availabilityData = availability.map((slot: any) => ({
        sessionId: tutoringSession.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: new Date(`1970-01-01T${slot.startTime}:00`),
        endTime: new Date(`1970-01-01T${slot.endTime}:00`)
      }));
      
      await prisma.tutoringAvailability.createMany({
        data: availabilityData
      });
    }
    
    res.status(201).json({
      message: 'Tutoring session created successfully',
      sessionId: tutoringSession.id
    });
  } catch (error) {
    console.error('Error creating tutoring session:', error);
    res.status(500).json({ message: 'Error creating tutoring session' });
  }
};

// Update a tutoring session
export const updateTutoringSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    const {
      subject,
      description,
      pricePerHour,
      locationType,
      maxStudents,
      prerequisites,
      level,
      tags,
      availability,
      status
    } = req.body;
    
    // Check if session exists and belongs to the user
    const sessionExists = await prisma.tutoringSession.findUnique({
      where: { id },
      select: { teacherId: true }
    });
    
    if (!sessionExists) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    // Check if user is authorized (teacher or admin)
    if (sessionExists.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this tutoring session' });
    }
    
    // Update session basic info
    const updatedSession = await prisma.tutoringSession.update({
      where: { id },
      data: {
        subject,
        description,
        pricePerHour,
        locationType: locationType as TutoringLocationType,
        maxStudents,
        prerequisites,
        level,
        tags,
        status: status as TutoringStatus,
        updatedAt: new Date()
      }
    });
    
    // Update availability if provided
    if (availability) {
      // First delete all existing availability slots
      await prisma.tutoringAvailability.deleteMany({
        where: { sessionId: id }
      });
      
      // Then create new ones
      if (availability.length > 0) {
        const availabilityData = availability.map((slot: any) => ({
          sessionId: id,
          dayOfWeek: slot.dayOfWeek,
          startTime: new Date(`1970-01-01T${slot.startTime}:00`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00`)
        }));
        
        await prisma.tutoringAvailability.createMany({
          data: availabilityData
        });
      }
    }
    
    res.status(200).json({
      message: 'Tutoring session updated successfully',
      sessionId: updatedSession.id
    });
  } catch (error) {
    console.error('Error updating tutoring session:', error);
    res.status(500).json({ message: 'Error updating tutoring session' });
  }
};

// Delete a tutoring session
export const deleteTutoringSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    
    // Check if session exists and belongs to the user
    const session = await prisma.tutoringSession.findUnique({
      where: { id },
      include: {
        requests: true,
        appointments: true
      }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    // Check if user is authorized (teacher or admin)
    if (session.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this tutoring session' });
    }
    
    // Check if there are confirmed appointments
    const hasConfirmedAppointments = session.appointments.some(
      appointment => appointment.status === 'confirmed' || appointment.status === 'completed'
    );
    
    if (hasConfirmedAppointments) {
      return res.status(400).json({ 
        message: 'Cannot delete a tutoring session with confirmed or completed appointments' 
      });
    }
    
    // Delete all related records
    // Delete availability
    await prisma.tutoringAvailability.deleteMany({
      where: { sessionId: id }
    });
    
    // Delete messages in requests
    for (const request of session.requests) {
      await prisma.tutoringMessage.deleteMany({
        where: { requestId: request.id }
      });
    }
    
    // Delete appointments
    await prisma.tutoringAppointment.deleteMany({
      where: { requestId: { in: session.requests.map(req => req.id) } }
    });
    
    // Delete requests
    await prisma.tutoringRequest.deleteMany({
      where: { sessionId: id }
    });
    
    // Delete reviews
    await prisma.tutoringReview.deleteMany({
      where: { sessionId: id }
    });
    
    // Delete certificates
    await prisma.certificate.deleteMany({
      where: { tutoringId: id }
    });
    
    // Finally, delete the session
    await prisma.tutoringSession.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Tutoring session deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutoring session:', error);
    res.status(500).json({ message: 'Error deleting tutoring session' });
  }
};

// Create a tutoring request
export const createTutoringRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const {
      sessionId,
      message,
      preferredDates
    } = req.body;
    
    // Validate required fields
    if (!sessionId || !preferredDates || !preferredDates.length) {
      return res.status(400).json({ message: 'Session ID and preferred dates are required' });
    }
    
    // Check if session exists and is approved
    const session = await prisma.tutoringSession.findUnique({
      where: { 
        id: sessionId,
        status: TutoringStatus.approved
      }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found or not available' });
    }
    
    // Check if user already has a pending or accepted request for this session
    const existingRequest = await prisma.tutoringRequest.findFirst({
      where: {
        sessionId,
        studentId: req.user.id,
        status: {
          in: [TutoringRequestStatus.pending, TutoringRequestStatus.accepted]
        }
      }
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending or accepted request for this tutoring session' 
      });
    }
    
    // Create the request
    const tutoringRequest = await prisma.tutoringRequest.create({
      data: {
        sessionId,
        studentId: req.user.id,
        message,
        preferredDates: preferredDates.map((date: string) => new Date(date)),
        status: TutoringRequestStatus.pending
      }
    });
    
    // Create initial message
    if (message) {
      await prisma.tutoringMessage.create({
        data: {
          requestId: tutoringRequest.id,
          senderId: req.user.id,
          message,
          read: false
        }
      });
    }
    
    res.status(201).json({
      message: 'Tutoring request sent successfully',
      requestId: tutoringRequest.id
    });
  } catch (error) {
    console.error('Error creating tutoring request:', error);
    res.status(500).json({ message: 'Error creating tutoring request' });
  }
};

// Get tutoring requests for a session
export const getSessionRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    
    // Check if session exists and belongs to the user
    const session = await prisma.tutoringSession.findUnique({
      where: { id },
      select: { teacherId: true }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    // Only the teacher or admin can see requests
    if (session.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these requests' });
    }
    
    const requests = await prisma.tutoringRequest.findMany({
      where: { sessionId: id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        appointment: true,
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1 // Just get the latest message
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching session requests:', error);
    res.status(500).json({ message: 'Error fetching session requests' });
  }
};

// Get current user's tutoring requests
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
        appointment: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Just get the latest message
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    res.status(500).json({ message: 'Error fetching my requests' });
  }
};

// Update tutoring request status
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    const { status, scheduledAt, duration, notes, meetingLink } = req.body;
    
    // Find the request
    const request = await prisma.tutoringRequest.findUnique({
      where: { id },
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
      return res.status(404).json({ message: 'Tutoring request not found' });
    }
    
    // Check authorization
    const isTeacher = req.user.id === request.session.teacherId;
    const isStudent = req.user.id === request.studentId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isTeacher && !isStudent && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }
    
    // Validate status transitions
    if (status === TutoringRequestStatus.accepted) {
      // Only teacher can accept
      if (!isTeacher && !isAdmin) {
        return res.status(403).json({ message: 'Only the teacher can accept the request' });
      }
      
      // Need appointment details to accept
      if (!scheduledAt || !duration) {
        return res.status(400).json({ 
          message: 'Scheduled date and duration are required to accept a request' 
        });
      }
    }
    
    // Update the request status
    const updatedRequest = await prisma.tutoringRequest.update({
      where: { id },
      data: {
        status: status as TutoringRequestStatus,
        updatedAt: new Date()
      }
    });
    
    // Create or update appointment if needed
    if (status === TutoringRequestStatus.accepted) {
      // Calculate price based on duration and hourly rate
      const price = request.session.pricePerHour * (duration / 60);
      
      // Check if appointment already exists
      const existingAppointment = await prisma.tutoringAppointment.findUnique({
        where: { requestId: id }
      });
      
      if (existingAppointment) {
        // Update existing appointment
        await prisma.tutoringAppointment.update({
          where: { id: existingAppointment.id },
          data: {
            scheduledAt: new Date(scheduledAt),
            duration,
            notes,
            meetingLink,
            price
          }
        });
      } else {
        // Create new appointment
        await prisma.tutoringAppointment.create({
          data: {
            requestId: id,
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
      }
    }
    
    res.status(200).json({
      message: 'Tutoring request updated successfully',
      requestId: updatedRequest.id,
      status: updatedRequest.status
    });
  } catch (error) {
    console.error('Error updating tutoring request:', error);
    res.status(500).json({ message: 'Error updating tutoring request' });
  }
};

// Send a message in a tutoring request
export const sendTutoringMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { requestId, message } = req.body;
    
    if (!requestId || !message) {
      return res.status(400).json({ message: 'Request ID and message are required' });
    }
    
    // Find the request
    const request = await prisma.tutoringRequest.findUnique({
      where: { id: requestId },
      include: {
        session: {
          select: { teacherId: true }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Tutoring request not found' });
    }
    
    // Check if user is involved in the request
    const isTeacher = req.user.id === request.session.teacherId;
    const isStudent = req.user.id === request.studentId;
    
    if (!isTeacher && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to send messages in this request' });
    }
    
    // Create the message
    const tutoringMessage = await prisma.tutoringMessage.create({
      data: {
        requestId,
        senderId: req.user.id,
        message,
        read: false
      }
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      messageId: tutoringMessage.id
    });
  } catch (error) {
    console.error('Error sending tutoring message:', error);
    res.status(500).json({ message: 'Error sending tutoring message' });
  }
};

// Get messages for a tutoring request
export const getRequestMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { id } = req.params;
    
    // Find the request
    const request = await prisma.tutoringRequest.findUnique({
      where: { id },
      include: {
        session: {
          select: { teacherId: true }
        }
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Tutoring request not found' });
    }
    
    // Check if user is involved in the request
    const isTeacher = req.user.id === request.session.teacherId;
    const isStudent = req.user.id === request.studentId;
    
    if (!isTeacher && !isStudent && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view messages in this request' });
    }
    
    // Get the messages
    const messages = await prisma.tutoringMessage.findMany({
      where: { requestId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Mark messages as read
    await prisma.tutoringMessage.updateMany({
      where: {
        requestId: id,
        senderId: { not: req.user.id },
        read: false
      },
      data: { read: true }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching tutoring messages:', error);
    res.status(500).json({ message: 'Error fetching tutoring messages' });
  }
}; 