import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getRelatedProducts,
  adminGetProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/related', getRelatedProducts);
router.get('/:id', getProduct);

// Admin routes
router.get('/admin/all', authMiddleware, adminGetProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
