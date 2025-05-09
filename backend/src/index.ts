import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

// Import routes
import achievementRoutes from './routes/achievementRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import calendarRoutes from './routes/calendarRoutes';
import certificateRoutes from './routes/certificateRoutes';
import courseRoutes from './routes/courseRoutes';
import messagingRoutes from './routes/messagingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import tutoringRoutes from './routes/tutoringRoutes';
import userRoutes from './routes/userRoutes';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Initialize Prisma client
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tutoring', tutoringRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Not found middleware
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
  process.exit(0);
});

export default app; 