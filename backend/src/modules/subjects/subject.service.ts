import { SubjectRepository } from './subject.repository';
import pool from '../../config/database';

export class SubjectService {
  private repository = new SubjectRepository();

  async getSubjects(userId?: number) {
    try {
      const subjects = await this.repository.findAll();
      
      // If user is logged in, calculate progress for each course
      if (userId) {
        for (let course of subjects) {
          // Get total lessons from the course object itself (added to schema)
          const totalLessons = course.total_lessons || 0;
          
          // Get completed lessons for this user in this course
          const [completedResult] = await pool.execute(
            `SELECT COUNT(*) as completed FROM lesson_progress 
             WHERE user_id = ? AND subject_id = ? AND is_completed = 1`,
            [userId, course.id]
          );
          const completedLessons = (completedResult as any[])[0].completed;
          
          course.progress_percentage = totalLessons > 0 
            ? Math.round((completedLessons / totalLessons) * 100) 
            : 0;
          course.completed_lessons = completedLessons;
          course.total_lessons = totalLessons;
        }
      }
      
      return {
        subjects,
        total: subjects.length
      };
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async getSubjectById(id: number, userId?: number) {
    try {
      console.log('Service: fetching subject with ID:', id);
      const subject = await this.repository.findById(id);
      if (!subject) {
        throw new Error('Subject not found');
      }

      // Fetch lessons for this subject
      const lessons = await this.repository.findLessonsBySubjectId(id);
      
      // If user is logged in, fetch progress for each lesson
      if (userId) {
        for (let lesson of lessons) {
          const [progressResult] = await pool.execute(
            `SELECT is_completed, watch_percent FROM lesson_progress 
             WHERE user_id = ? AND lesson_id = ?`,
            [userId, lesson.id]
          );
          const progress = (progressResult as any[])[0];
          lesson.is_completed = progress ? progress.is_completed === 1 : false;
          lesson.watch_percent = progress ? progress.watch_percent : 0;
        }

        // Also calculate overall progress for this specific subject
        const totalLessonsCount = subject.total_lessons || lessons.length || 1;
        const [completedResult] = await pool.execute(
          `SELECT COUNT(*) as completed FROM lesson_progress 
           WHERE user_id = ? AND subject_id = ? AND is_completed = 1`,
          [userId, id]
        );
        const completedCount = (completedResult as any[])[0].completed;
        subject.progress_percentage = Math.round((completedCount / totalLessonsCount) * 100);
        subject.completed_lessons = completedCount;
      }

      subject.lessons = lessons;
      return subject;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async getSubjectByLanguage(id: number, language: string) {
    try {
      const subject = await this.repository.findByLanguagePair(id, language);
      if (!subject) {
        throw new Error('Subject not found in selected language');
      }
      return subject;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async getAvailableLanguages(id: number) {
    try {
      return await this.repository.getAvailableLanguages(id);
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}