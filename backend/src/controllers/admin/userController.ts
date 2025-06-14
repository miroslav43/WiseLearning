import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Get all users for admin management
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        points: true,
        teacherProfile: {
          select: {
            specialization: true,
            rating: true,
            students: true,
            education: true,
            experience: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**
 * Get pending teachers for approval
 */
export const getPendingTeachers = async (req: Request, res: Response) => {
  try {
    // For now, return teachers with incomplete profiles that might need approval
    const pendingTeachers = await prisma.user.findMany({
      where: {
        role: 'teacher',
        teacherProfile: {
          OR: [
            { specialization: { equals: [] } },
            { education: null },
            { experience: null }
          ]
        }
      },
      include: {
        teacherProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(pendingTeachers);
  } catch (error) {
    console.error('Error fetching pending teachers:', error);
    res.status(500).json({ message: 'Error fetching pending teachers' });
  }
}; 