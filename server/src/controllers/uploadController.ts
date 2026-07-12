import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../lib/cloudinary';

// Fallback: local storage if Cloudinary not configured
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

// Local storage fallback
const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  }
});

// Memory storage for Cloudinary (needs buffer)
const memoryStorage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed.'));
};

export const upload = multer({
  storage: useCloudinary ? memoryStorage : localStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload single image
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    if (useCloudinary) {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'grandzone/products', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      return res.json({ url: result.secure_url });
    } else {
      // Fallback: local storage
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      return res.json({ url: imageUrl });
    }
  } catch (error: any) {
    console.error('Upload error:', error?.message || error);
    return res.status(500).json({ error: 'Upload failed.', details: error?.message || 'Unknown error' });
  }
};

// Upload multiple images
export const uploadImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded.' });

    if (useCloudinary) {
      const urls: string[] = [];
      for (const file of files) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'grandzone/products', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        urls.push(result.secure_url);
      }
      return res.json({ urls });
    } else {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const urls = files.map(f => `${baseUrl}/uploads/${f.filename}`);
      return res.json({ urls });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed.' });
  }
};
