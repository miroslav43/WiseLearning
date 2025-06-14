"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourseBundle = exports.upsertCourseBundle = exports.getCourseBundles = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../../index");
/**
 * Get all course bundles
 * Retrieves all course bundles with included courses
 */
const getCourseBundles = async (req, res) => {
    try {
        const bundles = await index_1.prisma.courseBundle.findMany({
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: [
                { price: 'asc' }
            ]
        });
        res.status(200).json(bundles);
    }
    catch (error) {
        console.error('Error fetching course bundles:', error);
        res.status(500).json({ message: 'Error fetching course bundles' });
    }
};
exports.getCourseBundles = getCourseBundles;
/**
 * Create or update course bundle
 * Handles both creation and updates of course bundles
 */
const upsertCourseBundle = async (req, res) => {
    try {
        const { id, name, description, price, originalPrice, discount, featuredBenefit, benefits, imageUrl, courseIds } = req.body;
        // Validate course IDs
        if (courseIds && courseIds.length > 0) {
            const courseCount = await index_1.prisma.course.count({
                where: {
                    id: { in: courseIds },
                    status: client_1.CourseStatus.published
                }
            });
            if (courseCount !== courseIds.length) {
                return res.status(400).json({ message: 'Some courses are invalid or not published' });
            }
        }
        let bundle;
        // Start a transaction to ensure all operations succeed or fail together
        await index_1.prisma.$transaction(async (tx) => {
            if (id) {
                // Update existing bundle
                bundle = await tx.courseBundle.update({
                    where: { id },
                    data: {
                        name,
                        description,
                        price,
                        originalPrice,
                        discount,
                        featuredBenefit,
                        benefits,
                        imageUrl
                    }
                });
                // Delete existing course associations
                await tx.bundleCourse.deleteMany({
                    where: { bundleId: id }
                });
            }
            else {
                // Create new bundle
                bundle = await tx.courseBundle.create({
                    data: {
                        name,
                        description,
                        price,
                        originalPrice,
                        discount,
                        featuredBenefit,
                        benefits: benefits || [],
                        imageUrl
                    }
                });
            }
            // Add new course associations
            if (courseIds && courseIds.length > 0) {
                for (const courseId of courseIds) {
                    await tx.bundleCourse.create({
                        data: {
                            bundleId: bundle.id,
                            courseId
                        }
                    });
                }
            }
        });
        // Fetch the updated bundle with courses
        const updatedBundle = await index_1.prisma.courseBundle.findUnique({
            where: { id: bundle.id },
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            }
        });
        res.status(200).json({
            message: id ? 'Course bundle updated' : 'Course bundle created',
            bundle: updatedBundle
        });
    }
    catch (error) {
        console.error('Error managing course bundle:', error);
        res.status(500).json({ message: 'Error managing course bundle' });
    }
};
exports.upsertCourseBundle = upsertCourseBundle;
/**
 * Delete course bundle
 * Removes a course bundle if it has no active owners
 */
const deleteCourseBundle = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if bundle exists
        const bundle = await index_1.prisma.courseBundle.findUnique({
            where: { id },
            include: {
                owners: true
            }
        });
        if (!bundle) {
            return res.status(404).json({ message: 'Course bundle not found' });
        }
        // Check if bundle has owners
        if (bundle.owners.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete bundle with active owners. Update the bundle instead.'
            });
        }
        // Delete bundle courses
        await index_1.prisma.bundleCourse.deleteMany({
            where: { bundleId: id }
        });
        // Delete bundle
        await index_1.prisma.courseBundle.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Course bundle deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting course bundle:', error);
        res.status(500).json({ message: 'Error deleting course bundle' });
    }
};
exports.deleteCourseBundle = deleteCourseBundle;
