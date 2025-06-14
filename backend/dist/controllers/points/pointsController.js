"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseCoursesWithPoints = exports.purchasePointsPackage = exports.createPointsPackagePaymentIntent = exports.deductPoints = exports.addPoints = exports.getPointsPackages = exports.getPointsTransactions = exports.getPointsBalance = void 0;
const index_1 = require("../../index");
const paymentService_1 = __importDefault(require("../../services/paymentService"));
// Get user's points balance
const getPointsBalance = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { points: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ points: user.points || 0 });
    }
    catch (error) {
        console.error('Error fetching points balance:', error);
        res.status(500).json({ message: 'Error fetching points balance' });
    }
};
exports.getPointsBalance = getPointsBalance;
// Get user's transactions
const getPointsTransactions = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const transactions = await index_1.prisma.pointsTransaction.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Error fetching points transactions:', error);
        res.status(500).json({ message: 'Error fetching points transactions' });
    }
};
exports.getPointsTransactions = getPointsTransactions;
// Get available points packages
const getPointsPackages = async (_req, res) => {
    try {
        const packages = await index_1.prisma.pointsPackage.findMany({
            where: { active: true },
            orderBy: { points: 'asc' }
        });
        res.status(200).json(packages);
    }
    catch (error) {
        console.error('Error fetching points packages:', error);
        res.status(500).json({ message: 'Error fetching points packages' });
    }
};
exports.getPointsPackages = getPointsPackages;
// Add points to user account
const addPoints = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { amount, type, description } = req.body;
        if (!amount || !type || !description) {
            return res.status(400).json({ message: 'Amount, type, and description are required' });
        }
        const transaction = await index_1.prisma.pointsTransaction.create({
            data: {
                userId: req.user.id,
                amount,
                type,
                description
            }
        });
        // Update user points
        await index_1.prisma.user.update({
            where: { id: req.user.id },
            data: { points: { increment: amount } }
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ message: 'Error adding points' });
    }
};
exports.addPoints = addPoints;
// Deduct points from user account
const deductPoints = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { amount, type, description } = req.body;
        if (!amount || !type || !description) {
            return res.status(400).json({ message: 'Amount, type, and description are required' });
        }
        // Check if user has enough points
        const user = await index_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { points: true }
        });
        if (!user || (user.points || 0) < amount) {
            return res.status(400).json({ message: 'Insufficient points' });
        }
        const transaction = await index_1.prisma.pointsTransaction.create({
            data: {
                userId: req.user.id,
                amount: -amount, // Store negative amount for deductions
                type,
                description
            }
        });
        // Update user points
        await index_1.prisma.user.update({
            where: { id: req.user.id },
            data: { points: { decrement: amount } }
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error('Error deducting points:', error);
        res.status(500).json({ message: 'Error deducting points' });
    }
};
exports.deductPoints = deductPoints;
// Create payment intent for purchasing a points package
const createPointsPackagePaymentIntent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { packageId } = req.body;
        if (!packageId) {
            return res.status(400).json({ message: 'Package ID is required' });
        }
        // Find the package
        const pointsPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id: packageId }
        });
        if (!pointsPackage || !pointsPackage.active) {
            return res.status(404).json({ message: 'Points package not found or inactive' });
        }
        // Create a payment intent
        const paymentIntent = await paymentService_1.default.createPaymentIntent(Math.round(pointsPackage.price * 100), // Convert to cents
        'eur', {
            referenceType: 'points_package',
            referenceId: pointsPackage.id,
            userId: req.user.id,
            packageName: pointsPackage.name,
            pointsAmount: pointsPackage.points.toString()
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            packageDetails: {
                id: pointsPackage.id,
                name: pointsPackage.name,
                points: pointsPackage.points,
                price: pointsPackage.price
            }
        });
    }
    catch (error) {
        console.error('Error creating payment intent for points package:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
};
exports.createPointsPackagePaymentIntent = createPointsPackagePaymentIntent;
// Purchase points package (legacy method - will be deprecated)
const purchasePointsPackage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { packageId, paymentMethod } = req.body;
        if (!packageId || !paymentMethod) {
            return res.status(400).json({ message: 'Package ID and payment method are required' });
        }
        // Find the package
        const pointsPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id: packageId }
        });
        if (!pointsPackage || !pointsPackage.active) {
            return res.status(404).json({ message: 'Points package not found or inactive' });
        }
        // Create a mock payment record
        const payment = await index_1.prisma.payment.create({
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
        const transaction = await index_1.prisma.pointsTransaction.create({
            data: {
                userId: req.user.id,
                amount: pointsPackage.points,
                type: 'purchase',
                description: `Purchased ${pointsPackage.name} package`,
            }
        });
        // Update user points
        await index_1.prisma.user.update({
            where: { id: req.user.id },
            data: { points: { increment: pointsPackage.points } }
        });
        res.status(200).json({
            transaction,
            success: true,
            message: `Successfully purchased ${pointsPackage.points} points`
        });
    }
    catch (error) {
        console.error('Error purchasing points package:', error);
        res.status(500).json({ message: 'Error purchasing points package' });
    }
};
exports.purchasePointsPackage = purchasePointsPackage;
// Purchase courses with points
const purchaseCoursesWithPoints = async (req, res) => {
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
        const user = await index_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { points: true }
        });
        if (!user || (user.points || 0) < totalPointsPrice) {
            return res.status(400).json({ message: 'Insufficient points' });
        }
        // Verify courses exist and calculate total points price
        const courses = await index_1.prisma.course.findMany({
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
        const existingEnrollments = await index_1.prisma.enrollment.findMany({
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
        const result = await index_1.prisma.$transaction(async (tx) => {
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
            const enrollments = await Promise.all(courseIds.map((courseId) => tx.enrollment.create({
                data: {
                    userId: req.user.id,
                    courseId,
                    enrolledAt: new Date(),
                    status: 'active'
                }
            })));
            return { transaction, enrollments };
        });
        res.status(201).json({
            success: true,
            message: `Successfully purchased ${courses.length} course(s) with ${totalPointsPrice} points`,
            transaction: result.transaction,
            enrollments: result.enrollments
        });
    }
    catch (error) {
        console.error('Error purchasing courses with points:', error);
        res.status(500).json({ message: 'Error purchasing courses with points' });
    }
};
exports.purchaseCoursesWithPoints = purchaseCoursesWithPoints;
