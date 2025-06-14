"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBulkSaved = exports.getAllFavorites = exports.checkLikedStatus = exports.checkSavedStatus = exports.getLikedCourses = exports.getSavedCourses = exports.toggleLikedCourse = exports.toggleSavedCourse = void 0;
const index_1 = require("../index");
// Save/unsave a course for current user
const toggleSavedCourse = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Check if course exists
        const course = await index_1.prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, title: true }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if already saved
        const existingSaved = await index_1.prisma.savedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        if (existingSaved) {
            // Remove from saved
            await index_1.prisma.savedCourse.delete({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                }
            });
            res.status(200).json({ saved: false, message: 'Course removed from saved' });
        }
        else {
            // Add to saved
            await index_1.prisma.savedCourse.create({
                data: {
                    userId,
                    courseId
                }
            });
            res.status(200).json({ saved: true, message: 'Course saved' });
        }
    }
    catch (error) {
        console.error('Error toggling saved course:', error);
        res.status(500).json({ message: 'Error toggling saved course' });
    }
};
exports.toggleSavedCourse = toggleSavedCourse;
// Like/unlike a course for current user
const toggleLikedCourse = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Check if course exists
        const course = await index_1.prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, title: true }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if already liked
        const existingLiked = await index_1.prisma.likedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        if (existingLiked) {
            // Remove like
            await index_1.prisma.likedCourse.delete({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                }
            });
            res.status(200).json({ liked: false, message: 'Course unliked' });
        }
        else {
            // Add like
            await index_1.prisma.likedCourse.create({
                data: {
                    userId,
                    courseId
                }
            });
            res.status(200).json({ liked: true, message: 'Course liked' });
        }
    }
    catch (error) {
        console.error('Error toggling liked course:', error);
        res.status(500).json({ message: 'Error toggling liked course' });
    }
};
exports.toggleLikedCourse = toggleLikedCourse;
// Get saved courses for current user
const getSavedCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const savedCourses = await index_1.prisma.savedCourse.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        },
                        reviews: {
                            select: {
                                rating: true
                            }
                        }
                    }
                }
            },
            orderBy: { savedAt: 'desc' }
        });
        const courses = savedCourses.map((saved) => ({
            ...saved.course,
            savedAt: saved.savedAt
        }));
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching saved courses:', error);
        res.status(500).json({ message: 'Error fetching saved courses' });
    }
};
exports.getSavedCourses = getSavedCourses;
// Get liked courses for current user
const getLikedCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const likedCourses = await index_1.prisma.likedCourse.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        },
                        reviews: {
                            select: {
                                rating: true
                            }
                        }
                    }
                }
            },
            orderBy: { likedAt: 'desc' }
        });
        const courses = likedCourses.map((liked) => ({
            ...liked.course,
            likedAt: liked.likedAt
        }));
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching liked courses:', error);
        res.status(500).json({ message: 'Error fetching liked courses' });
    }
};
exports.getLikedCourses = getLikedCourses;
// Check if course is saved by current user
const checkSavedStatus = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const savedCourse = await index_1.prisma.savedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        res.status(200).json({
            isSaved: !!savedCourse,
            savedAt: savedCourse?.savedAt || null
        });
    }
    catch (error) {
        console.error('Error checking saved status:', error);
        res.status(500).json({ message: 'Error checking saved status' });
    }
};
exports.checkSavedStatus = checkSavedStatus;
// Check if course is liked by current user
const checkLikedStatus = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const likedCourse = await index_1.prisma.likedCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });
        res.status(200).json({
            isLiked: !!likedCourse,
            likedAt: likedCourse?.likedAt || null
        });
    }
    catch (error) {
        console.error('Error checking liked status:', error);
        res.status(500).json({ message: 'Error checking liked status' });
    }
};
exports.checkLikedStatus = checkLikedStatus;
// Get all favorites (saved + liked) for current user
const getAllFavorites = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const [savedCourses, likedCourses] = await Promise.all([
            index_1.prisma.savedCourse.findMany({
                where: { userId },
                select: {
                    courseId: true,
                    savedAt: true
                }
            }),
            index_1.prisma.likedCourse.findMany({
                where: { userId },
                select: {
                    courseId: true,
                    likedAt: true
                }
            })
        ]);
        const savedCourseIds = savedCourses.map(saved => saved.courseId);
        const likedCourseIds = likedCourses.map(liked => liked.courseId);
        res.status(200).json({
            savedCourses: savedCourseIds,
            likedCourses: likedCourseIds,
            savedDetails: savedCourses.reduce((acc, saved) => {
                acc[saved.courseId] = { savedAt: saved.savedAt };
                return acc;
            }, {}),
            likedDetails: likedCourses.reduce((acc, liked) => {
                acc[liked.courseId] = { likedAt: liked.likedAt };
                return acc;
            }, {})
        });
    }
    catch (error) {
        console.error('Error fetching all favorites:', error);
        res.status(500).json({ message: 'Error fetching all favorites' });
    }
};
exports.getAllFavorites = getAllFavorites;
// Remove multiple courses from saved
const removeBulkSaved = async (req, res) => {
    try {
        const { courseIds } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({ message: 'Course IDs array is required' });
        }
        await index_1.prisma.savedCourse.deleteMany({
            where: {
                userId,
                courseId: { in: courseIds }
            }
        });
        res.status(200).json({
            message: `Removed ${courseIds.length} courses from saved`,
            removedCount: courseIds.length
        });
    }
    catch (error) {
        console.error('Error removing bulk saved courses:', error);
        res.status(500).json({ message: 'Error removing bulk saved courses' });
    }
};
exports.removeBulkSaved = removeBulkSaved;
