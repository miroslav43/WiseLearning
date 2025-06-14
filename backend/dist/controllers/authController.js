"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getCurrentUser = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
// Register a new user
const register = async (req, res) => {
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
        const existingUser = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // Hash password
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        // Generate referral code
        const referralCode = generateReferralCode(name);
        // Create user
        const user = await index_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role,
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
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        // If the role is teacher, create a teacher profile
        if (role === 'teacher') {
            await index_1.prisma.teacherProfile.create({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user. Please try again later.' });
    }
};
exports.register = register;
// Login existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        // Find user
        const user = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Get additional role-specific data
        let roleSpecificData = null;
        if (user.role === 'teacher') {
            roleSpecificData = await index_1.prisma.teacherProfile.findUnique({
                where: { userId: user.id }
            });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
        // Update last login time
        await index_1.prisma.user.update({
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in. Please try again later.' });
    }
};
exports.login = login;
// Get current user's profile
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const userId = req.user.id;
        const user = await index_1.prisma.user.findUnique({
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
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Error fetching user profile. Please try again later.' });
    }
};
exports.getCurrentUser = getCurrentUser;
// Helper function to generate a referral code
const generateReferralCode = (name) => {
    const namePart = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${namePart}${randomPart}`;
};
// Update user profile
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const userId = req.user.id;
        const { name, bio, avatar, points } = req.body;
        // Validate input - now also accepts points
        if (!name && bio === undefined && avatar === undefined && points === undefined) {
            return res.status(400).json({ message: 'Please provide at least one field to update' });
        }
        // Prepare update data
        const updateData = {};
        if (name)
            updateData.name = name;
        if (bio !== undefined)
            updateData.bio = bio;
        if (avatar !== undefined)
            updateData.avatar = avatar;
        if (points !== undefined)
            updateData.points = points;
        // Update user
        const updatedUser = await index_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                points: true,
                referralCode: true,
                createdAt: true
            }
        });
        // Update teacher profile if needed and if user is a teacher
        if (req.user.role === 'teacher' && req.body.teacherProfile) {
            const { specialization, education, experience, certificates } = req.body.teacherProfile;
            const teacherUpdateData = {};
            if (specialization)
                teacherUpdateData.specialization = specialization;
            if (education !== undefined)
                teacherUpdateData.education = education;
            if (experience !== undefined)
                teacherUpdateData.experience = experience;
            if (certificates)
                teacherUpdateData.certificates = certificates;
            await index_1.prisma.teacherProfile.update({
                where: { userId },
                data: teacherUpdateData
            });
        }
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile. Please try again later.' });
    }
};
exports.updateProfile = updateProfile;
