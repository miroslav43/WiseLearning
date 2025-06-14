"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAvailability = exports.setUserAvailability = exports.updateTeacherProfile = exports.getTeacherProfile = exports.getUserPointsTransactions = exports.deleteUser = exports.updateUser = exports.updateCurrentUser = exports.getUserById = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../index");
// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await index_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                lastLogin: true,
                teacherProfile: true
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getAllUsers = getAllUsers;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await index_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                teacherProfile: true,
                certificates: {
                    take: 5,
                    orderBy: {
                        issueDate: 'desc'
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUserById = getUserById;
// Update current user's profile
const updateCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { name, bio, avatar, password } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (bio !== undefined)
            updateData.bio = bio;
        if (avatar)
            updateData.avatar = avatar;
        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt_1.default.genSalt(10);
            updateData.passwordHash = await bcrypt_1.default.hash(password, salt);
        }
        const updatedUser = await index_1.prisma.user.update({
            where: {
                id: req.user.id
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                teacherProfile: true
            }
        });
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
exports.updateCurrentUser = updateCurrentUser;
// Update user by ID (admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, bio, avatar, password } = req.body;
        // Check if user exists
        const userExists = await index_1.prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (bio !== undefined)
            updateData.bio = bio;
        if (avatar)
            updateData.avatar = avatar;
        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt_1.default.genSalt(10);
            updateData.passwordHash = await bcrypt_1.default.hash(password, salt);
        }
        const updatedUser = await index_1.prisma.user.update({
            where: {
                id
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true
            }
        });
        // If role is changed to teacher, create teacher profile if it doesn't exist
        if (role === 'teacher') {
            const teacherProfile = await index_1.prisma.teacherProfile.findUnique({
                where: { userId: id }
            });
            if (!teacherProfile) {
                await index_1.prisma.teacherProfile.create({
                    data: {
                        userId: id,
                        specialization: [],
                        students: 0,
                        certificates: []
                    }
                });
            }
        }
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if user exists
        const user = await index_1.prisma.user.findUnique({
            where: { id },
            select: { id: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete the user (this will cascade to related records)
        await index_1.prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
// Get user points transactions
const getUserPointsTransactions = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const transactions = await index_1.prisma.pointsTransaction.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to recent 50 transactions
        });
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Error fetching points transactions:', error);
        res.status(500).json({ message: 'Error fetching points transactions' });
    }
};
exports.getUserPointsTransactions = getUserPointsTransactions;
// Get teacher profile
const getTeacherProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await index_1.prisma.user.findUnique({
            where: { id },
            include: {
                teacherProfile: true,
                courses: {
                    where: { status: 'published' },
                    select: {
                        id: true,
                        title: true,
                        subject: true,
                        students: true,
                        rating: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        courses: {
                            where: { status: 'published' }
                        }
                    }
                }
            }
        });
        if (!user || user.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            teacherProfile: user.teacherProfile,
            courses: user.courses,
            coursesCount: user._count.courses
        });
    }
    catch (error) {
        console.error('Error fetching teacher profile:', error);
        res.status(500).json({ message: 'Error fetching teacher profile' });
    }
};
exports.getTeacherProfile = getTeacherProfile;
// Update teacher profile
const updateTeacherProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can update teacher profile' });
        }
        const { specialization, education, experience, certificates } = req.body;
        const updateData = {};
        if (specialization)
            updateData.specialization = specialization;
        if (education !== undefined)
            updateData.education = education;
        if (experience !== undefined)
            updateData.experience = experience;
        if (certificates)
            updateData.certificates = certificates;
        // Check if teacher profile exists
        const existingProfile = await index_1.prisma.teacherProfile.findUnique({
            where: { userId: req.user.id }
        });
        let teacherProfile;
        if (existingProfile) {
            teacherProfile = await index_1.prisma.teacherProfile.update({
                where: { userId: req.user.id },
                data: updateData
            });
        }
        else {
            teacherProfile = await index_1.prisma.teacherProfile.create({
                data: {
                    userId: req.user.id,
                    specialization: specialization || [],
                    education,
                    experience,
                    certificates: certificates || [],
                    students: 0
                }
            });
        }
        res.status(200).json({
            message: 'Teacher profile updated successfully',
            teacherProfile
        });
    }
    catch (error) {
        console.error('Error updating teacher profile:', error);
        res.status(500).json({ message: 'Error updating teacher profile' });
    }
};
exports.updateTeacherProfile = updateTeacherProfile;
// Set user availability
const setUserAvailability = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { availability } = req.body;
        if (!Array.isArray(availability)) {
            return res.status(400).json({ message: 'Availability must be an array' });
        }
        // Delete existing availability
        await index_1.prisma.userAvailability.deleteMany({
            where: { userId: req.user.id }
        });
        // Create new availability records
        const availabilityRecords = await Promise.all(availability.map((slot) => index_1.prisma.userAvailability.create({
            data: {
                userId: req.user.id,
                dayOfWeek: slot.dayOfWeek,
                startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
                endTime: new Date(`1970-01-01T${slot.endTime}:00Z`)
            }
        })));
        res.status(200).json({
            message: 'Availability updated successfully',
            availability: availabilityRecords
        });
    }
    catch (error) {
        console.error('Error setting user availability:', error);
        res.status(500).json({ message: 'Error setting user availability' });
    }
};
exports.setUserAvailability = setUserAvailability;
// Get user availability
const getUserAvailability = async (req, res) => {
    try {
        const { userId } = req.params;
        const availability = await index_1.prisma.userAvailability.findMany({
            where: { userId },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        res.status(200).json(availability);
    }
    catch (error) {
        console.error('Error fetching user availability:', error);
        res.status(500).json({ message: 'Error fetching user availability' });
    }
};
exports.getUserAvailability = getUserAvailability;
