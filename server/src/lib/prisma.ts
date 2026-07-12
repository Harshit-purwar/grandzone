import { PrismaClient } from '@prisma/client';
import path from 'path';

// Use absolute path for production (Render disk mount)
const databaseUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, '../../prisma/dev.db')}`;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

export default prisma;
