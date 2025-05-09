import { Request, Response, Router } from 'express';
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
  res.status(501).json({ message: 'Not implemented yet' });
});

// Create a tutoring review
router.post('/tutoring/:id', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Delete a tutoring review
router.delete('/tutoring/:id', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 