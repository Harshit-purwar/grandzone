import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Generate unique order number
const generateOrderNumber = () => {
  const prefix = 'GZ';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Place order (customer)
export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { name, mobile, address, pincode, landmark, items } = req.body;

    if (!name || !mobile || !address || !pincode || !items || items.length === 0) {
      return res.status(400).json({ error: 'Name, mobile, address, pincode and items are required.' });
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    const orderItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: `Product not found.` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        name,
        mobile,
        address,
        pincode,
        landmark: landmark || null,
        totalAmount,
        items: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Get order by ID (customer)
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: { items: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Get all orders
export const adminGetOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status as string;

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status: status as string },
      include: { items: { include: { product: true } } }
    });

    // If cancelled, restore stock
    if (status === 'Cancelled') {
      for (const item of (order as any).items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
