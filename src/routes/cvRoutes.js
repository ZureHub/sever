import { Router } from 'express';
import cvController, { upload } from '../controllers/cvController';
import { authMiddleware } from '../middleware/auth';
const router = Router();
// All routes require authentication
router.use(authMiddleware);
router.post('/upload', upload.single('cv'), cvController.uploadCV);
router.get('/', cvController.getUserCVs);
router.get('/:id', cvController.getCV);
router.delete('/:id', cvController.deleteCV);
export default router;
