import { Request, Response, Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get reviews for a course
router.get('/course/:id', async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create a course review
router.post('/course/:id', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete a course review
router.delete('/course/:id', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get reviews for a tutoring session
router.get('/tutoring/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get all reviews for the tutoring session
    const reviews = await prisma.tutoringReview.findMany({
      where: { sessionId: id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching tutoring reviews:', error);
    res.status(500).json({ message: 'Error fetching tutoring reviews' });
  }
});

// Create a tutoring review
router.post('/tutoring/:id', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if session exists
    const session = await prisma.tutoringSession.findUnique({
      where: { id },
      select: { id: true, teacherId: true }
    });

    if (!session) {
      return res.status(404).json({ message: 'Tutoring session not found' });
    }

    // Check if user is not the teacher
    if (session.teacherId === req.user.id) {
      return res.status(400).json({ message: 'Teachers cannot review their own sessions' });
    }

    // Check if user already reviewed this session
    const existingReview = await prisma.tutoringReview.findUnique({
      where: {
        studentId_sessionId: {
          studentId: req.user.id,
          sessionId: id
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this session' });
    }

    // Create the review
    const review = await prisma.tutoringReview.create({
      data: {
        sessionId: id,
        studentId: req.user.id,
        rating,
        comment: comment || null
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating tutoring review:', error);
    res.status(500).json({ message: 'Error creating tutoring review' });
  }
});

// Delete a tutoring review
router.delete('/tutoring/:id', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    // Find the review
    const review = await prisma.tutoringReview.findFirst({
      where: {
        sessionId: id,
        studentId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review
    await prisma.tutoringReview.delete({
      where: { id: review.id }
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutoring review:', error);
    res.status(500).json({ message: 'Error deleting tutoring review' });
  }
});

export default router; 