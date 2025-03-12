import { Router } from 'express';
import interviewController from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
// All routes require authentication
router.use(authMiddleware);
router.post('/', interviewController.createInterview);
router.get('/', interviewController.getUserInterviews);
router.get('/:id', interviewController.getInterview);
router.delete('/:id', interviewController.deleteInterview);
export default router;
