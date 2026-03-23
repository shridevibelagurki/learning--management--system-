import { Request, Response, NextFunction } from 'express';
import { ProgressService } from './progress.service';

const progressService = new ProgressService();

export class ProgressController {
  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { lessonId, subjectId, isCompleted, watchPercent } = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await progressService.updateLessonProgress(
        userId, 
        parseInt(lessonId), 
        parseInt(subjectId), 
        isCompleted, 
        watchPercent || 0
      );
      
      res.json(result);
    } catch (error) {
      console.error('Controller error:', error);
      next(error);
    }
  }
}
