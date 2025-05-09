import { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get all subscription plans
router.get('/plans', async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Subscribe to a plan
router.post('/subscribe', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get current user's subscription
router.get('/my', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Cancel subscription
router.put('/:id/cancel', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Get course bundles
router.get('/bundles', async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Purchase a bundle
router.post('/bundles/:id/purchase', authenticate, async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router; 