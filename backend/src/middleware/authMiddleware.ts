import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Extend Express Request to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware to verify JWT token (used in adminRoutes)
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET as string
    ) as { id: string };
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user object to request
    req.user = {
      id: user.id,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Middleware to check if user is admin (used in adminRoutes)
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Middleware to authenticate user (similar to verifyToken but updates lastLogin)
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET as string
    ) as { id: string };
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user object to request
    req.user = {
      id: user.id,
      role: user.role
    };
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

// Middleware to restrict access based on user role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    
    next();
  };
};

// Middleware to validate ownership of a resource
export const checkOwnership = (resourceType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const resourceId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Admin can access any resource
      if (req.user?.role === 'admin') {
        return next();
      }
      
      let resource;
      
      // Check ownership based on resource type
      switch (resourceType) {
        case 'course':
          resource = await prisma.course.findUnique({
            where: { id: resourceId },
            select: { teacherId: true }
          });
          if (!resource || resource.teacherId !== userId) {
            return res.status(403).json({ message: 'Not authorized to access this course' });
          }
          break;
        
        case 'tutoring':
          resource = await prisma.tutoringSession.findUnique({
            where: { id: resourceId },
            select: { teacherId: true }
          });
          if (!resource || resource.teacherId !== userId) {
            return res.status(403).json({ message: 'Not authorized to access this tutoring session' });
          }
          break;
        
        // Add more resource types as needed
        
        default:
          return res.status(400).json({ message: 'Invalid resource type' });
      }
      
      next();
    } catch (error) {
      console.error('Error in checkOwnership middleware:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
}; 