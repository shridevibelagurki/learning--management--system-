import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const controller = new ProgressController();

// All progress routes require authentication
router.post('/lesson', authMiddleware, controller.updateProgress.bind(controller));

export default router;
