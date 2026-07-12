import { Router } from 'express';
import {
  getCategories,
  adminGetCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getCategories);

// Admin routes
router.get('/admin/all', authMiddleware, adminGetCategories);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
