import express from 'express';
import cors from 'cors';
import path from 'path';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import bannerRoutes from './routes/bannerRoutes';
import prisma from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/banners', bannerRoutes);

// Health check
app.get('/api/health', async (_req, res) => {
  const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  
  let dbStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e: any) {
    dbStatus = `error: ${e.message?.substring(0, 100)}`;
  }
  
  res.json({ 
    status: 'ok', 
    message: 'GrandZone API is running',
    database: dbStatus,
    databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@') || 'not set',
    cloudinary: hasCloudinary ? 'configured' : 'not configured',
  });
});

// DB setup endpoint - run schema push manually
app.post('/api/setup-db', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('npx prisma db push --skip-generate --accept-data-loss', { 
      cwd: process.cwd(),
      timeout: 30000,
      stdio: 'pipe'
    });
    res.json({ success: true, message: 'Database schema pushed successfully' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message?.substring(0, 200) });
  }
});

// Seed endpoint
app.post('/api/seed', async (_req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('npx tsx prisma/seed.ts', { 
      cwd: process.cwd(),
      timeout: 30000,
      stdio: 'pipe'
    });
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message?.substring(0, 200) });
  }
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`GrandZone server running on port ${PORT}`);
  console.log(`DB URL: ${process.env.DATABASE_URL?.replace(/:[^:]+@/, ':***@') || 'not set'}`);
});

export default app;
