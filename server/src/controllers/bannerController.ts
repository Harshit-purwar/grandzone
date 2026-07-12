import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get active banners (public)
export const getBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Get all banners
export const adminGetBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Create banner
export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image, bgColor, link, active, order } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        image: image || null,
        bgColor: bgColor || 'from-primary-500 to-primary-700',
        link: link || null,
        active: active !== undefined ? active : true,
        order: order || 0
      }
    });
    return res.status(201).json(banner);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Update banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, image, bgColor, link, active, order } = req.body;
    const banner = await prisma.banner.update({
      where: { id: req.params.id as string },
      data: {
        ...(title !== undefined && { title: title as string }),
        ...(subtitle !== undefined && { subtitle: subtitle as string }),
        ...(image !== undefined && { image: image as string }),
        ...(bgColor !== undefined && { bgColor: bgColor as string }),
        ...(link !== undefined && { link: link as string }),
        ...(active !== undefined && { active }),
        ...(order !== undefined && { order: Number(order) })
      }
    });
    return res.json(banner);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Delete banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id as string } });
    return res.json({ message: 'Banner deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
