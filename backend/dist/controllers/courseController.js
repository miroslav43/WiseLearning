"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getMyCourses = exports.getTeacherCourses = exports.getAllPublishedCourses = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../index");
const courseService_1 = require("../services/courseService");
// Get all published courses (for students)
const getAllPublishedCourses = async (req, res) => {
    try {
        const { subject, search, featured } = req.query;
        // Build query filters
        const filters = {
            status: client_1.CourseStatus.published
        };
        if (subject) {
            filters.subject = subject;
        }
        if (search) {
            filters.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (featured === 'true') {
            filters.featured = true;
        }
        const courses = await index_1.prisma.course.findMany({
            where: filters,
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        teacherProfile: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        }
                    }
                },
                topics: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                orderIndex: 'asc'
                            }
                        }
                    }
                }
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
};
exports.getAllPublishedCourses = getAllPublishedCourses;
// Get courses by teacher ID
const getTeacherCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const courses = await index_1.prisma.course.findMany({
            where: {
                teacherId: id
            },
            include: {
                topics: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                orderIndex: 'asc'
                            }
                        }
                    }
                },
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching teacher courses:', error);
        res.status(500).json({ message: 'Error fetching teacher courses' });
    }
};
exports.getTeacherCourses = getTeacherCourses;
// Get my courses (for current teacher)
const getMyCourses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const courses = await index_1.prisma.course.findMany({
            where: {
                teacherId: req.user.id
            },
            include: {
                topics: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                orderIndex: 'asc'
                            }
                        }
                    }
                },
                reviews: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching my courses:', error);
        res.status(500).json({ message: 'Error fetching my courses' });
    }
};
exports.getMyCourses = getMyCourses;
// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await index_1.prisma.course.findUnique({
            where: { id },
            include: {
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        teacherProfile: true
                    }
                },
                topics: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                orderIndex: 'asc'
                            },
                            include: {
                                quiz: {
                                    include: {
                                        questions: {
                                            orderBy: {
                                                orderIndex: 'asc'
                                            }
                                        }
                                    }
                                },
                                assignment: true
                            }
                        }
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // If user is not the teacher and course is not published, return error
        if ((!req.user || req.user.id !== course.teacherId) &&
            course.status !== client_1.CourseStatus.published &&
            req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Course not available' });
        }
        res.status(200).json(course);
    }
    catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course' });
    }
};
exports.getCourseById = getCourseById;
// Create a new course
const createCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { title, description, subject, image, price, pointsPrice, topics = [], status = 'draft' } = req.body;
        // Input validation
        if (!title || !subject) {
            return res.status(400).json({ message: 'Title and subject are required' });
        }
        // Create course
        const course = await index_1.prisma.course.create({
            data: {
                title,
                description,
                subject,
                image,
                price: price || 0,
                pointsPrice: pointsPrice || 0,
                teacherId: req.user.id,
                status: status
            }
        });
        // Create topics and lessons using service
        if (topics.length > 0) {
            await (0, courseService_1.updateCourseTopics)(course.id, topics);
        }
        res.status(201).json({
            message: 'Course created successfully',
            courseId: course.id
        });
    }
    catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course' });
    }
};
exports.createCourse = createCourse;
// Update a course
const updateCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { id } = req.params;
        const { title, description, subject, image, price, pointsPrice, status, featured, topics } = req.body;
        // Check if course exists and belongs to the user
        const courseExists = await index_1.prisma.course.findUnique({
            where: { id },
            select: { teacherId: true }
        });
        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if user is authorized (teacher or admin)
        if (courseExists.teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }
        // Update course basic info
        const updatedCourse = await index_1.prisma.course.update({
            where: { id },
            data: {
                title,
                description,
                subject,
                image,
                price: price !== undefined ? price : undefined,
                pointsPrice: pointsPrice !== undefined ? pointsPrice : undefined,
                status: status !== undefined ? status : undefined,
                featured: featured !== undefined ? featured : undefined,
                updatedAt: new Date()
            }
        });
        // Handle topics update if provided
        if (topics) {
            await (0, courseService_1.updateCourseTopics)(id, topics);
        }
        res.status(200).json({
            message: 'Course updated successfully',
            courseId: updatedCourse.id
        });
    }
    catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Error updating course' });
    }
};
exports.updateCourse = updateCourse;
// Delete a course
const deleteCourse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { id } = req.params;
        // Check if course exists and belongs to the user
        const course = await index_1.prisma.course.findUnique({
            where: { id },
            select: { teacherId: true }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if user is authorized (teacher or admin)
        if (course.teacherId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }
        // Delete course with cascade using service
        await (0, courseService_1.deleteCourseWithCascade)(id);
        res.status(200).json({ message: 'Course deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Error deleting course' });
    }
};
exports.deleteCourse = deleteCourse;
