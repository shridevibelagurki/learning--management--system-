import { SubjectRepository } from './subject.repository';
import pool from '../../config/database';

export class SubjectService {
  private repository = new SubjectRepository();

  private isLessonProgressMissing(error: any): boolean {
    // MySQL error code when a table does not exist
    return (
      error?.code === 'ER_NO_SUCH_TABLE' &&
      typeof error?.sqlMessage === 'string' &&
      error.sqlMessage.toLowerCase().includes('lesson_progress')
    );
  }

  async getSubjects(userId?: number) {
    try {
      const subjects = await this.repository.findAll();

      // Compute "how much students watched" (overall average watch_percent per subject)
      // so the UI always has a meaningful watch bar.
      for (let course of subjects) {
        try {
          const [avgWatchResult] = await pool.execute(
            `SELECT COALESCE(ROUND(AVG(lp.watch_percent)), 0) as avg_watch_percent
             FROM lesson_progress lp
             WHERE lp.subject_id = ?`,
            [course.id]
          );

          course.students_watch_percentage = (avgWatchResult as any[])[0].avg_watch_percent || 0;
        } catch (err) {
          // If the progress table isn't created yet, keep UI working.
          if (this.isLessonProgressMissing(err)) {
            course.students_watch_percentage = 0;
          } else {
            throw err;
          }
        }

        // If user is logged in, also calculate personal progress for each course.
        if (userId) {
          try {
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
          } catch (err) {
            if (this.isLessonProgressMissing(err)) {
              // Leave personal progress as 0/undefined; frontend will still render.
              course.progress_percentage = 0;
              course.completed_lessons = 0;
              course.total_lessons = course.total_lessons || 0;
            } else {
              throw err;
            }
          }
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
        let lessonProgressTableMissing = false;
        for (let lesson of lessons) {
          if (lessonProgressTableMissing) {
            lesson.is_completed = false;
            lesson.watch_percent = 0;
            continue;
          }

          try {
            const [progressResult] = await pool.execute(
              `SELECT is_completed, watch_percent FROM lesson_progress 
               WHERE user_id = ? AND lesson_id = ?`,
              [userId, lesson.id]
            );
            const progress = (progressResult as any[])[0];
            lesson.is_completed = progress ? progress.is_completed === 1 : false;
            lesson.watch_percent = progress ? progress.watch_percent : 0;
          } catch (err) {
            if (this.isLessonProgressMissing(err)) {
              lessonProgressTableMissing = true;
              lesson.is_completed = false;
              lesson.watch_percent = 0;
            } else {
              throw err;
            }
          }
        }

        // Also calculate overall progress for this specific subject
        const totalLessonsCount = subject.total_lessons || lessons.length || 1;
        try {
          const [completedResult] = await pool.execute(
            `SELECT COUNT(*) as completed FROM lesson_progress 
             WHERE user_id = ? AND subject_id = ? AND is_completed = 1`,
            [userId, id]
          );
          const completedCount = (completedResult as any[])[0].completed;
          subject.progress_percentage = Math.round((completedCount / totalLessonsCount) * 100);
          subject.completed_lessons = completedCount;
        } catch (err) {
          if (this.isLessonProgressMissing(err)) {
            subject.progress_percentage = 0;
            subject.completed_lessons = 0;
          } else {
            throw err;
          }
        }
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

      // Attach lessons so the frontend can embed the correct YouTube videos.
      const lessons = await this.repository.findLessonsBySubjectId(subject.id);

      return {
        ...subject,
        lessons,
      };
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