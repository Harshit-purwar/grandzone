import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateToken } from '../middleware/auth';

// Admin login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(admin.id);
    return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Get admin profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).adminId;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true }
    });
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    return res.json(admin);
  } catch (error) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
