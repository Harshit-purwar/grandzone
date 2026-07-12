import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get all active categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Get all categories
export const adminGetCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, image } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required.' });

    const category = await prisma.category.create({
      data: { name, icon: icon || null, image: image || null }
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, icon, image, active } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id as string },
      data: {
        ...(name !== undefined && { name: name as string }),
        ...(icon !== undefined && { icon: icon as string }),
        ...(image !== undefined && { image: image as string }),
        ...(active !== undefined && { active })
      }
    });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id as string } });
    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
