import { TutoringLocationType, TutoringStatus } from '@prisma/client';
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
    
    // Calculate average rating for each session
    const sessionsWithRatings = sessions.map(session => {
      const reviews = session.reviews;
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...session,
        rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
      };
    });
    
    res.status(200).json(sessionsWithRatings);
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
    
    // Allow access if:
    // 1. Session is approved (public access)
    // 2. User is the teacher who owns the session (can access their own regardless of status)
    // 3. User is an admin
    const isOwner = req.user && req.user.id === session.teacherId;
    const isAdmin = req.user && req.user.role === 'admin';
    const isApproved = session.status === TutoringStatus.approved;
    
    if (!isApproved && !isOwner && !isAdmin) {
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
    const session = await prisma.tutoringSession.create({
      data: {
        teacherId: req.user.id,
        subject,
        description,
        pricePerHour,
        locationType,
        maxStudents,
        prerequisites,
        level,
        tags,
        status: TutoringStatus.pending
      }
    });
    
    // Create availability slots if provided
    if (availability.length > 0) {
      await prisma.tutoringAvailability.createMany({
        data: availability.map((slot: any) => ({
          sessionId: session.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
          endTime: new Date(`1970-01-01T${slot.endTime}:00Z`)
        }))
      });
    }
    
    res.status(201).json({
      message: 'Tutoring session created successfully',
      sessionId: session.id
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
      availability
    } = req.body;
    
    // Check if session exists and belongs to the user
    const sessionExists = await prisma.tutoringSession.findUnique({
      where: { id },
      select: { teacherId: true }
    });
    
    if (!sessionExists) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    if (sessionExists.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }
    
    // Update session
    const updatedSession = await prisma.tutoringSession.update({
      where: { id },
      data: {
        subject,
        description,
        pricePerHour,
        locationType,
        maxStudents,
        prerequisites,
        level,
        tags,
        updatedAt: new Date()
      }
    });
    
    // Update availability if provided
    if (availability) {
      // Delete existing availability
      await prisma.tutoringAvailability.deleteMany({
        where: { sessionId: id }
      });
      
      // Create new availability
      if (availability.length > 0) {
        await prisma.tutoringAvailability.createMany({
          data: availability.map((slot: any) => ({
            sessionId: id,
            dayOfWeek: slot.dayOfWeek,
            startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
            endTime: new Date(`1970-01-01T${slot.endTime}:00Z`)
          }))
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
      select: { teacherId: true }
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }
    
    if (session.teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this session' });
    }
    
    // Delete session (this will cascade to related records due to foreign key constraints)
    await prisma.tutoringSession.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Tutoring session deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutoring session:', error);
    res.status(500).json({ message: 'Error deleting tutoring session' });
  }
}; 