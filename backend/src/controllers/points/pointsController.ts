import { Request, Response } from 'express';
import { prisma } from '../../index';
import paymentService from '../../services/paymentService';

// Get user's points balance
export const getPointsBalance = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ points: user.points || 0 });
  } catch (error) {
    console.error('Error fetching points balance:', error);
    res.status(500).json({ message: 'Error fetching points balance' });
  }
};

// Get user's transactions
export const getPointsTransactions = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching points transactions:', error);
    res.status(500).json({ message: 'Error fetching points transactions' });
  }
};

// Get available points packages
export const getPointsPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.pointsPackage.findMany({
      where: { active: true },
      orderBy: { points: 'asc' }
    });
    
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching points packages:', error);
    res.status(500).json({ message: 'Error fetching points packages' });
  }
};

// Add points to user account
export const addPoints = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { amount, type, description } = req.body;
    
    if (!amount || !type || !description) {
      return res.status(400).json({ message: 'Amount, type, and description are required' });
    }
    
    const transaction = await prisma.pointsTransaction.create({
      data: {
        userId: req.user.id,
        amount,
        type,
        description
      }
    });
    
    // Update user points
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { increment: amount } }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Error adding points' });
  }
};

// Deduct points from user account
export const deductPoints = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { amount, type, description } = req.body;
    
    if (!amount || !type || !description) {
      return res.status(400).json({ message: 'Amount, type, and description are required' });
    }
    
    // Check if user has enough points
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });
    
    if (!user || (user.points || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    const transaction = await prisma.pointsTransaction.create({
      data: {
        userId: req.user.id,
        amount: -amount, // Store negative amount for deductions
        type,
        description
      }
    });
    
    // Update user points
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { decrement: amount } }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error deducting points:', error);
    res.status(500).json({ message: 'Error deducting points' });
  }
};

// Create payment intent for purchasing a points package
export const createPointsPackagePaymentIntent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { packageId } = req.body;
    
    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    
    // Find the package
    const pointsPackage = await prisma.pointsPackage.findUnique({
      where: { id: packageId }
    });
    
    if (!pointsPackage || !pointsPackage.active) {
      return res.status(404).json({ message: 'Points package not found or inactive' });
    }
    
    // Create a payment intent
    const paymentIntent = await paymentService.createPaymentIntent(
      Math.round(pointsPackage.price * 100), // Convert to cents
      'eur',
      {
        referenceType: 'points_package',
        referenceId: pointsPackage.id,
        userId: req.user.id,
        packageName: pointsPackage.name,
        pointsAmount: pointsPackage.points.toString()
      }
    );
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      packageDetails: {
        id: pointsPackage.id,
        name: pointsPackage.name,
        points: pointsPackage.points,
        price: pointsPackage.price
      }
    });
  } catch (error) {
    console.error('Error creating payment intent for points package:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Purchase points package (legacy method - will be deprecated)
export const purchasePointsPackage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { packageId, paymentMethod } = req.body;
    
    if (!packageId || !paymentMethod) {
      return res.status(400).json({ message: 'Package ID and payment method are required' });
    }
    
    // Find the package
    const pointsPackage = await prisma.pointsPackage.findUnique({
      where: { id: packageId }
    });
    
    if (!pointsPackage || !pointsPackage.active) {
      return res.status(404).json({ message: 'Points package not found or inactive' });
    }
    
    // Create a mock payment record
    const payment = await prisma.payment.create({
      data: {
        referenceId: `mock_${Date.now()}`,
        amount: pointsPackage.price,
        status: 'completed',
        paymentMethod,
        metadata: {
          referenceType: 'points_package',
          referenceId: pointsPackage.id,
          userId: req.user.id,
          packageName: pointsPackage.name,
          pointsAmount: pointsPackage.points.toString()
        }
      }
    });
    
    // Create a points transaction
    const transaction = await prisma.pointsTransaction.create({
      data: {
        userId: req.user.id,
        amount: pointsPackage.points,
        type: 'purchase',
        description: `Purchased ${pointsPackage.name} package`,
      }
    });
    
    // Update user points
    await prisma.user.update({
      where: { id: req.user.id },
      data: { points: { increment: pointsPackage.points } }
    });
    
    res.status(200).json({
      transaction,
      success: true,
      message: `Successfully purchased ${pointsPackage.points} points`
    });
  } catch (error) {
    console.error('Error purchasing points package:', error);
    res.status(500).json({ message: 'Error purchasing points package' });
  }
};

// Purchase courses with points
export const purchaseCoursesWithPoints = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { courseIds, totalPointsPrice, description } = req.body;
    
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'Course IDs are required' });
    }
    
    if (!totalPointsPrice || !description) {
      return res.status(400).json({ message: 'Total points price and description are required' });
    }
    
    // Check if user has enough points
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });
    
    if (!user || (user.points || 0) < totalPointsPrice) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Verify courses exist and calculate total points price
    const courses = await prisma.course.findMany({
      where: { 
        id: { in: courseIds },
        status: 'published'
      },
      select: { id: true, title: true, pointsPrice: true }
    });
    
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: 'Some courses are invalid or not published' });
    }
    
    const calculatedTotal = courses.reduce((sum, course) => sum + course.pointsPrice, 0);
    if (calculatedTotal !== totalPointsPrice) {
      return res.status(400).json({ message: 'Points price mismatch' });
    }
    
    // Check if user is already enrolled in any of these courses
    const existingEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: req.user.id,
        courseId: { in: courseIds }
      }
    });
    
    if (existingEnrollments.length > 0) {
      return res.status(400).json({ 
        message: 'You are already enrolled in one or more of these courses' 
      });
    }
    
    // Start transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points
      await tx.user.update({
        where: { id: req.user.id },
        data: { points: { decrement: totalPointsPrice } }
      });
      
      // Create points transaction
      const transaction = await tx.pointsTransaction.create({
        data: {
          userId: req.user.id,
          amount: -totalPointsPrice, // Store negative amount for deductions
          type: 'course_purchase',
          description
        }
      });
      
      // Create enrollments for all courses
      const enrollments = await Promise.all(
        courseIds.map((courseId: string) =>
          tx.enrollment.create({
            data: {
              userId: req.user.id,
              courseId,
              enrolledAt: new Date(),
              status: 'active'
            }
          })
        )
      );
      
      return { transaction, enrollments };
    });
    
    res.status(201).json({
      success: true,
      message: `Successfully purchased ${courses.length} course(s) with ${totalPointsPrice} points`,
      transaction: result.transaction,
      enrollments: result.enrollments
    });
  } catch (error) {
    console.error('Error purchasing courses with points:', error);
    res.status(500).json({ message: 'Error purchasing courses with points' });
  }
}; 