import { Router } from 'express';
import { upload, uploadImage, uploadImages } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/single', authMiddleware, upload.single('image'), uploadImage);
router.post('/multiple', authMiddleware, upload.array('images', 10), uploadImages);

export default router;
