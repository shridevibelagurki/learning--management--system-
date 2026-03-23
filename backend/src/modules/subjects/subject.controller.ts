import { Request, Response, NextFunction } from 'express';
import { SubjectService } from './subject.service';

const subjectService = new SubjectService();

export class SubjectController {
  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Getting subjects...');
      // Get userId from authenticated user (if logged in)
      const userId = (req as any).user?.userId;
      const result = await subjectService.getSubjects(userId);
      console.log('Subjects result:', result);
      res.json(result);
    } catch (error) {
      console.error('Detailed controller error:', error);
      next(error);
    }
  }

  async getSubjectById(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId } = req.params;
      const userId = (req as any).user?.userId; // Get user ID from token
      console.log('Getting subject by ID:', subjectId, 'for user:', userId);
      
      const id = typeof subjectId === 'string' ? parseInt(subjectId) : parseInt(subjectId[0]);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      
      const subject = await subjectService.getSubjectById(id, userId);
      res.json(subject);
    } catch (error) {
      console.error('Error getting subject:', error);
      next(error);
    }
  }

  // NEW METHOD: Get subject with language options
  async getSubjectWithLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId } = req.params;
      const language = (req.query.lang as string) || 'English';
      
      const id = typeof subjectId === 'string' ? parseInt(subjectId) : parseInt(subjectId[0]);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }
      
      // Get the course in requested language
      const subject = await subjectService.getSubjectByLanguage(id, language);
      const availableLanguages = await subjectService.getAvailableLanguages(id);
      
      res.json({
        ...subject,
        available_languages: availableLanguages,
        current_language: subject.language || 'English'
      });
    } catch (error) {
      console.error('Error getting subject with languages:', error);
      next(error);
    }
  }
}