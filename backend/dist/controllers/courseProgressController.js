"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseStatistics = exports.updateLessonPosition = exports.getLessonProgress = exports.markLessonIncomplete = exports.markLessonCompleted = exports.getCourseProgress = void 0;
const index_1 = require("../index");
// Get course progress for current user
const getCourseProgress = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Get all lessons in the course
        const course = await index_1.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                topics: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                            select: { id: true }
                        }
                    }
                }
            }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Get all lesson IDs
        const allLessonIds = course.topics.flatMap(topic => topic.lessons.map(lesson => lesson.id));
        // Get completed lessons
        const completedLessons = await index_1.prisma.lessonProgress.findMany({
            where: {
                userId,
                lessonId: { in: allLessonIds },
                completed: true
            },
            select: { lessonId: true }
        });
        const completedLessonIds = completedLessons.map(progress => progress.lessonId);
        const progressPercent = allLessonIds.length > 0
            ? Math.round((completedLessonIds.length / allLessonIds.length) * 100)
            : 0;
        res.status(200).json({
            completedLessons: completedLessonIds,
            progressPercent,
            totalLessons: allLessonIds.length,
            completedCount: completedLessonIds.length
        });
    }
    catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({ message: 'Error fetching course progress' });
    }
};
exports.getCourseProgress = getCourseProgress;
// Mark lesson as completed
const markLessonCompleted = async (req, res) => {
    try {
        const { id: courseId, lessonId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Verify lesson exists and belongs to the course
        const lesson = await index_1.prisma.lesson.findFirst({
            where: {
                id: lessonId,
                topic: {
                    courseId
                }
            }
        });
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found in this course' });
        }
        // Create or update lesson progress
        const progress = await index_1.prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: {
                completed: true,
                completedAt: new Date()
            },
            create: {
                userId,
                lessonId,
                completed: true,
                completedAt: new Date()
            }
        });
        res.status(200).json({ message: 'Lesson marked as completed', progress });
    }
    catch (error) {
        console.error('Error marking lesson as completed:', error);
        res.status(500).json({ message: 'Error marking lesson as completed' });
    }
};
exports.markLessonCompleted = markLessonCompleted;
// Mark lesson as incomplete
const markLessonIncomplete = async (req, res) => {
    try {
        const { id: courseId, lessonId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Verify lesson exists and belongs to the course
        const lesson = await index_1.prisma.lesson.findFirst({
            where: {
                id: lessonId,
                topic: {
                    courseId
                }
            }
        });
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found in this course' });
        }
        // Update or delete lesson progress
        const existingProgress = await index_1.prisma.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            }
        });
        if (existingProgress) {
            await index_1.prisma.lessonProgress.update({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId
                    }
                },
                data: {
                    completed: false,
                    completedAt: null
                }
            });
        }
        res.status(200).json({ message: 'Lesson marked as incomplete' });
    }
    catch (error) {
        console.error('Error marking lesson as incomplete:', error);
        res.status(500).json({ message: 'Error marking lesson as incomplete' });
    }
};
exports.markLessonIncomplete = markLessonIncomplete;
// Get lesson progress for a specific lesson
const getLessonProgress = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const progress = await index_1.prisma.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            }
        });
        res.status(200).json({
            progress: progress || {
                completed: false,
                completedAt: null,
                lastPosition: 0
            }
        });
    }
    catch (error) {
        console.error('Error fetching lesson progress:', error);
        res.status(500).json({ message: 'Error fetching lesson progress' });
    }
};
exports.getLessonProgress = getLessonProgress;
// Update lesson video position (for resume functionality)
const updateLessonPosition = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { position } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (typeof position !== 'number' || position < 0) {
            return res.status(400).json({ message: 'Invalid position value' });
        }
        // Verify lesson exists
        const lesson = await index_1.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true }
        });
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        // Update or create progress with position
        const progress = await index_1.prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: {
                lastPosition: position
            },
            create: {
                userId,
                lessonId,
                lastPosition: position,
                completed: false
            }
        });
        res.status(200).json({
            message: 'Lesson position updated',
            progress
        });
    }
    catch (error) {
        console.error('Error updating lesson position:', error);
        res.status(500).json({ message: 'Error updating lesson position' });
    }
};
exports.updateLessonPosition = updateLessonPosition;
// Get overall course statistics for user
const getCourseStatistics = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Get course with topics and lessons
        const course = await index_1.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                topics: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                progress: {
                                    where: { userId },
                                    select: {
                                        completed: true,
                                        completedAt: true,
                                        lastPosition: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Calculate statistics
        const topicStats = course.topics.map(topic => {
            const totalLessons = topic.lessons.length;
            const completedLessons = topic.lessons.filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed).length;
            return {
                topicId: topic.id,
                title: topic.title,
                totalLessons,
                completedLessons,
                progressPercent: totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0
            };
        });
        const totalLessons = course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
        const totalCompleted = topicStats.reduce((sum, topic) => sum + topic.completedLessons, 0);
        const overallProgress = totalLessons > 0
            ? Math.round((totalCompleted / totalLessons) * 100)
            : 0;
        res.status(200).json({
            courseId: course.id,
            courseTitle: course.title,
            overallProgress,
            totalLessons,
            completedLessons: totalCompleted,
            topicStats
        });
    }
    catch (error) {
        console.error('Error fetching course statistics:', error);
        res.status(500).json({ message: 'Error fetching course statistics' });
    }
};
exports.getCourseStatistics = getCourseStatistics;
