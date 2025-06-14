"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.authorize = exports.authenticate = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
// Middleware to verify JWT token (used in adminRoutes)
const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user in database
        const user = await index_1.prisma.user.findUnique({
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
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};
exports.verifyToken = verifyToken;
// Middleware to check if user is admin (used in adminRoutes)
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
exports.isAdmin = isAdmin;
// Middleware to authenticate user (similar to verifyToken but updates lastLogin)
const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user in database
        const user = await index_1.prisma.user.findUnique({
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
        await index_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid authentication token' });
    }
};
exports.authenticate = authenticate;
// Middleware to restrict access based on user role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden' });
        }
        next();
    };
};
exports.authorize = authorize;
// Middleware to validate ownership of a resource
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
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
                    resource = await index_1.prisma.course.findUnique({
                        where: { id: resourceId },
                        select: { teacherId: true }
                    });
                    if (!resource || resource.teacherId !== userId) {
                        return res.status(403).json({ message: 'Not authorized to access this course' });
                    }
                    break;
                case 'tutoring':
                case 'tutoringSession':
                    resource = await index_1.prisma.tutoringSession.findUnique({
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
        }
        catch (error) {
            console.error('Error in checkOwnership middleware:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    };
};
exports.checkOwnership = checkOwnership;
