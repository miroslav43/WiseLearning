"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePointsPackageStatus = exports.deletePointsPackage = exports.updatePointsPackage = exports.createPointsPackage = exports.getAllPointsPackages = void 0;
const index_1 = require("../../index");
/**
 * Get all points packages
 */
const getAllPointsPackages = async (_req, res) => {
    try {
        const packages = await index_1.prisma.pointsPackage.findMany({
            orderBy: { points: 'asc' }
        });
        res.status(200).json(packages);
    }
    catch (error) {
        console.error('Error fetching points packages:', error);
        res.status(500).json({ message: 'Error fetching points packages' });
    }
};
exports.getAllPointsPackages = getAllPointsPackages;
/**
 * Create a new points package
 */
const createPointsPackage = async (req, res) => {
    try {
        const { name, description, points, price, active } = req.body;
        if (!name || !points || !price) {
            return res.status(400).json({ message: 'Name, points, and price are required' });
        }
        const newPackage = await index_1.prisma.pointsPackage.create({
            data: {
                name,
                description,
                points: Number(points),
                price: Number(price),
                active: active !== undefined ? active : true
            }
        });
        res.status(201).json(newPackage);
    }
    catch (error) {
        console.error('Error creating points package:', error);
        res.status(500).json({ message: 'Error creating points package' });
    }
};
exports.createPointsPackage = createPointsPackage;
/**
 * Update an existing points package
 */
const updatePointsPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, points, price, active } = req.body;
        const existingPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id }
        });
        if (!existingPackage) {
            return res.status(404).json({ message: 'Points package not found' });
        }
        const updatedPackage = await index_1.prisma.pointsPackage.update({
            where: { id },
            data: {
                name: name !== undefined ? name : existingPackage.name,
                description: description !== undefined ? description : existingPackage.description,
                points: points !== undefined ? Number(points) : existingPackage.points,
                price: price !== undefined ? Number(price) : existingPackage.price,
                active: active !== undefined ? active : existingPackage.active
            }
        });
        res.status(200).json(updatedPackage);
    }
    catch (error) {
        console.error('Error updating points package:', error);
        res.status(500).json({ message: 'Error updating points package' });
    }
};
exports.updatePointsPackage = updatePointsPackage;
/**
 * Delete a points package
 */
const deletePointsPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id }
        });
        if (!existingPackage) {
            return res.status(404).json({ message: 'Points package not found' });
        }
        await index_1.prisma.pointsPackage.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Points package deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting points package:', error);
        res.status(500).json({ message: 'Error deleting points package' });
    }
};
exports.deletePointsPackage = deletePointsPackage;
/**
 * Toggle active status of a points package
 */
const togglePointsPackageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPackage = await index_1.prisma.pointsPackage.findUnique({
            where: { id }
        });
        if (!existingPackage) {
            return res.status(404).json({ message: 'Points package not found' });
        }
        const updatedPackage = await index_1.prisma.pointsPackage.update({
            where: { id },
            data: {
                active: !existingPackage.active
            }
        });
        res.status(200).json(updatedPackage);
    }
    catch (error) {
        console.error('Error toggling points package status:', error);
        res.status(500).json({ message: 'Error toggling points package status' });
    }
};
exports.togglePointsPackageStatus = togglePointsPackageStatus;
