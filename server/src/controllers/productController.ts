import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Get all active products (for customers)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const where: any = { active: true };

    if (category) where.categoryId = category;
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { brand: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }
    if (minPrice) where.price = { gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { price: 'asc' };
    else if (sort === 'price_high') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'name') orderBy = { name: 'asc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy
    });

    return res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Get single product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
      include: { category: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Get related products
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { categoryId, productId } = req.query;
    const products = await prisma.product.findMany({
      where: {
        categoryId: String(categoryId),
        id: { not: String(productId) },
        active: true
      },
      take: 8,
      include: { category: true }
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Get all products
export const adminGetProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, images, categoryId, brand, mrp, price, discount, stock } = req.body;

    if (!name || !categoryId || !mrp || !price) {
      return res.status(400).json({ error: 'Name, category, MRP and price are required.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        images: JSON.stringify(images || []),
        categoryId,
        brand: brand || null,
        mrp: Number(mrp),
        price: Number(price),
        discount: Number(discount) || 0,
        stock: Number(stock) || 0
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, images, categoryId, brand, mrp, price, discount, stock, active } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: {
        ...(name !== undefined && { name: name as string }),
        ...(description !== undefined && { description: description as string }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
        ...(categoryId !== undefined && { categoryId: categoryId as string }),
        ...(brand !== undefined && { brand: brand || null }),
        ...(mrp !== undefined && { mrp: Number(mrp) }),
        ...(price !== undefined && { price: Number(price) }),
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(active !== undefined && { active })
      }
    });

    return res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    return res.json({ message: 'Product deleted.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
