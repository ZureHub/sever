import { Router } from 'express';
import prisma from '../services/prismaService.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Try to run a simple query to test DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;