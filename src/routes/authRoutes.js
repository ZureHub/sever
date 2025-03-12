import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
export default router;
