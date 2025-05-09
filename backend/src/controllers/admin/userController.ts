import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Manage users
 * Retrieves users with optional role and search filtering
 */
export const manageUsers = async (req: Request, res: Response) => {
  try {
    const { role, search } = req.query;
    
    // Build query filters
    const filters: any = {};
    
    if (role) {
      filters.role = role as Role;
    }
    
    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const users = await prisma.user.findMany({
      where: filters,
      include: {
        teacherProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}; 