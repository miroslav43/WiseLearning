import { Request, Response } from 'express';
import { prisma } from '../../index';

/**
 * Get all points packages
 */
export const getAllPointsPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.pointsPackage.findMany({
      orderBy: { points: 'asc' }
    });
    
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching points packages:', error);
    res.status(500).json({ message: 'Error fetching points packages' });
  }
};

/**
 * Create a new points package
 */
export const createPointsPackage = async (req: Request, res: Response) => {
  try {
    const { name, description, points, price, active } = req.body;
    
    if (!name || !points || !price) {
      return res.status(400).json({ message: 'Name, points, and price are required' });
    }
    
    const newPackage = await prisma.pointsPackage.create({
      data: {
        name,
        description,
        points: Number(points),
        price: Number(price),
        active: active !== undefined ? active : true
      }
    });
    
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error creating points package:', error);
    res.status(500).json({ message: 'Error creating points package' });
  }
};

/**
 * Update an existing points package
 */
export const updatePointsPackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, points, price, active } = req.body;
    
    const existingPackage = await prisma.pointsPackage.findUnique({
      where: { id }
    });
    
    if (!existingPackage) {
      return res.status(404).json({ message: 'Points package not found' });
    }
    
    const updatedPackage = await prisma.pointsPackage.update({
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
  } catch (error) {
    console.error('Error updating points package:', error);
    res.status(500).json({ message: 'Error updating points package' });
  }
};

/**
 * Delete a points package
 */
export const deletePointsPackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingPackage = await prisma.pointsPackage.findUnique({
      where: { id }
    });
    
    if (!existingPackage) {
      return res.status(404).json({ message: 'Points package not found' });
    }
    
    await prisma.pointsPackage.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Points package deleted successfully' });
  } catch (error) {
    console.error('Error deleting points package:', error);
    res.status(500).json({ message: 'Error deleting points package' });
  }
};

/**
 * Toggle active status of a points package
 */
export const togglePointsPackageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingPackage = await prisma.pointsPackage.findUnique({
      where: { id }
    });
    
    if (!existingPackage) {
      return res.status(404).json({ message: 'Points package not found' });
    }
    
    const updatedPackage = await prisma.pointsPackage.update({
      where: { id },
      data: {
        active: !existingPackage.active
      }
    });
    
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error('Error toggling points package status:', error);
    res.status(500).json({ message: 'Error toggling points package status' });
  }
}; 