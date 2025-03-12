import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Protected routes (require authentication)
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;