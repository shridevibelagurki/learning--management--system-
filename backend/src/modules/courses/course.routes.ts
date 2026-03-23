import { Router } from 'express';
import { CourseController } from './course.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const courseController = new CourseController();

router.get('/videos/:videoId', authMiddleware, courseController.getVideo.bind(courseController));

export default router;