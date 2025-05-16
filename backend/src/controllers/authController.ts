import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, and password' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Validate role
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be student, teacher, or admin' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Generate referral code
    const referralCode = generateReferralCode(name);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as Role,
        referralCode,
        createdAt: new Date(),
        points: 0
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        createdAt: true,
        avatar: true,
        bio: true,
        points: true
      }
    });
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // If the role is teacher, create a teacher profile
    if (role === 'teacher') {
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          specialization: [],
          students: 0,
          certificates: []
        }
      });
    }
    
    // Return user data and token
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user. Please try again later.' });
  }
};

// Login existing user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({ 
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Get additional role-specific data
    let roleSpecificData = null;
    
    if (user.role === 'teacher') {
      roleSpecificData = await prisma.teacherProfile.findUnique({
        where: { userId: user.id }
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    // Return user data and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        points: user.points,
        referralCode: user.referralCode,
        teacherProfile: roleSpecificData
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
};

// Get current user's profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacherProfile: req.user.role === 'teacher',
        pointsTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        achievements: {
          include: {
            achievement: true
          }
        },
        certificates: {
          orderBy: { issueDate: 'desc' },
          take: 5
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data (excluding passwordHash)
    const { passwordHash, ...userData } = user;
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error fetching user profile. Please try again later.' });
  }
};

// Helper function to generate a referral code
const generateReferralCode = (name: string): string => {
  const namePart = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${namePart}${randomPart}`;
}; 