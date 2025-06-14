"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvailabilitySlot = exports.removeAvailabilitySlot = exports.addAvailabilitySlot = exports.getMyAvailability = exports.getUserAvailability = exports.setUserAvailability = void 0;
const index_1 = require("../index");
// Set user availability
const setUserAvailability = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { availability } = req.body;
        if (!availability || !Array.isArray(availability)) {
            return res.status(400).json({ message: 'Availability data is required' });
        }
        // Delete existing availability slots
        await index_1.prisma.userAvailability.deleteMany({
            where: { userId: req.user.id }
        });
        // Create new availability slots
        if (availability.length > 0) {
            await Promise.all(availability.map(async (slot) => {
                await index_1.prisma.userAvailability.create({
                    data: {
                        userId: req.user.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: new Date(`1970-01-01T${slot.startTime}:00`),
                        endTime: new Date(`1970-01-01T${slot.endTime}:00`)
                    }
                });
            }));
        }
        // Get updated availability
        const updatedAvailability = await index_1.prisma.userAvailability.findMany({
            where: { userId: req.user.id },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        res.status(200).json({
            message: 'Availability updated successfully',
            availability: updatedAvailability
        });
    }
    catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ message: 'Error updating availability' });
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
// Get my availability
const getMyAvailability = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const availability = await index_1.prisma.userAvailability.findMany({
            where: { userId: req.user.id },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        res.status(200).json(availability);
    }
    catch (error) {
        console.error('Error fetching my availability:', error);
        res.status(500).json({ message: 'Error fetching my availability' });
    }
};
exports.getMyAvailability = getMyAvailability;
// Add single availability slot
const addAvailabilitySlot = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { dayOfWeek, startTime, endTime } = req.body;
        if (!dayOfWeek || !startTime || !endTime) {
            return res.status(400).json({ message: 'Day of week, start time, and end time are required' });
        }
        // Check for overlapping slots
        const existingSlots = await index_1.prisma.userAvailability.findMany({
            where: {
                userId: req.user.id,
                dayOfWeek,
                OR: [
                    {
                        startTime: {
                            lt: new Date(`1970-01-01T${endTime}:00`)
                        },
                        endTime: {
                            gt: new Date(`1970-01-01T${startTime}:00`)
                        }
                    }
                ]
            }
        });
        if (existingSlots.length > 0) {
            return res.status(400).json({ message: 'Time slot overlaps with existing availability' });
        }
        const newSlot = await index_1.prisma.userAvailability.create({
            data: {
                userId: req.user.id,
                dayOfWeek,
                startTime: new Date(`1970-01-01T${startTime}:00`),
                endTime: new Date(`1970-01-01T${endTime}:00`)
            }
        });
        res.status(201).json({
            message: 'Availability slot added successfully',
            slot: newSlot
        });
    }
    catch (error) {
        console.error('Error adding availability slot:', error);
        res.status(500).json({ message: 'Error adding availability slot' });
    }
};
exports.addAvailabilitySlot = addAvailabilitySlot;
// Remove availability slot
const removeAvailabilitySlot = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { slotId } = req.params;
        // Check if slot exists and belongs to user
        const slot = await index_1.prisma.userAvailability.findUnique({
            where: { id: slotId },
            select: { userId: true }
        });
        if (!slot) {
            return res.status(404).json({ message: 'Availability slot not found' });
        }
        if (slot.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to remove this slot' });
        }
        await index_1.prisma.userAvailability.delete({
            where: { id: slotId }
        });
        res.status(200).json({ message: 'Availability slot removed successfully' });
    }
    catch (error) {
        console.error('Error removing availability slot:', error);
        res.status(500).json({ message: 'Error removing availability slot' });
    }
};
exports.removeAvailabilitySlot = removeAvailabilitySlot;
// Update availability slot
const updateAvailabilitySlot = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { slotId } = req.params;
        const { dayOfWeek, startTime, endTime } = req.body;
        // Check if slot exists and belongs to user
        const slot = await index_1.prisma.userAvailability.findUnique({
            where: { id: slotId },
            select: { userId: true }
        });
        if (!slot) {
            return res.status(404).json({ message: 'Availability slot not found' });
        }
        if (slot.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this slot' });
        }
        // Check for overlapping slots (excluding current slot)
        if (dayOfWeek && startTime && endTime) {
            const existingSlots = await index_1.prisma.userAvailability.findMany({
                where: {
                    userId: req.user.id,
                    dayOfWeek,
                    id: { not: slotId },
                    OR: [
                        {
                            startTime: {
                                lt: new Date(`1970-01-01T${endTime}:00`)
                            },
                            endTime: {
                                gt: new Date(`1970-01-01T${startTime}:00`)
                            }
                        }
                    ]
                }
            });
            if (existingSlots.length > 0) {
                return res.status(400).json({ message: 'Time slot overlaps with existing availability' });
            }
        }
        const updateData = {};
        if (dayOfWeek)
            updateData.dayOfWeek = dayOfWeek;
        if (startTime)
            updateData.startTime = new Date(`1970-01-01T${startTime}:00`);
        if (endTime)
            updateData.endTime = new Date(`1970-01-01T${endTime}:00`);
        const updatedSlot = await index_1.prisma.userAvailability.update({
            where: { id: slotId },
            data: updateData
        });
        res.status(200).json({
            message: 'Availability slot updated successfully',
            slot: updatedSlot
        });
    }
    catch (error) {
        console.error('Error updating availability slot:', error);
        res.status(500).json({ message: 'Error updating availability slot' });
    }
};
exports.updateAvailabilitySlot = updateAvailabilitySlot;
