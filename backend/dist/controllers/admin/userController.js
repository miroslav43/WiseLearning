"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingTeachers = exports.manageUsers = void 0;
const index_1 = require("../../index");
/**
 * Get all users for admin management
 * Retrieves users with optional role and search filtering
 */
const manageUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        // Build query filters
        const filters = {};
        if (role) {
            filters.role = role;
        }
        if (search) {
            filters.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const users = await index_1.prisma.user.findMany({
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
    }
    catch (error) {
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.manageUsers = manageUsers;
/**
 * Get pending teachers for approval
 */
const getPendingTeachers = async (req, res) => {
    try {
        // For now, return teachers with incomplete profiles that might need approval
        const pendingTeachers = await index_1.prisma.user.findMany({
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
    }
    catch (error) {
        console.error('Error fetching pending teachers:', error);
        res.status(500).json({ message: 'Error fetching pending teachers' });
    }
};
exports.getPendingTeachers = getPendingTeachers;
