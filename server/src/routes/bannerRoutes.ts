import { Router } from 'express';
import { getBanners, adminGetBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getBanners);

// Admin routes
router.get('/admin/all', authMiddleware, adminGetBanners);
router.post('/', authMiddleware, createBanner);
router.put('/:id', authMiddleware, updateBanner);
router.delete('/:id', authMiddleware, deleteBanner);

export default router;
