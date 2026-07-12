import { Router } from 'express';
import {
  placeOrder,
  getOrder,
  adminGetOrders,
  updateOrderStatus
} from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', placeOrder);
router.get('/:id', getOrder);

// Admin routes
router.get('/admin/all', authMiddleware, adminGetOrders);
router.put('/admin/:id/status', authMiddleware, updateOrderStatus);

export default router;
