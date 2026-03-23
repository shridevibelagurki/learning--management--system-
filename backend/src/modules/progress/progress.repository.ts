import pool from '../../config/database';

export class ProgressRepository {
  async upsertLessonProgress(userId: number, lessonId: number, subject_id: number, isCompleted: boolean, watchPercent: number = 0) {
    try {
      const isCompletedNum = isCompleted ? 1 : 0;
      const query = `
        INSERT INTO lesson_progress (user_id, lesson_id, subject_id, is_completed, watch_percent)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          is_completed = VALUES(is_completed),
          watch_percent = VALUES(watch_percent),
          updated_at = CURRENT_TIMESTAMP
      `;
      await pool.execute(query, [userId, lessonId, subject_id, isCompletedNum, watchPercent]);
      
      // Also ensure enrollment exists
      const enrollQuery = `
        INSERT IGNORE INTO enrollments (user_id, subject_id)
        VALUES (?, ?)
      `;
      await pool.execute(enrollQuery, [userId, subject_id]);
      
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }

  async getLessonProgress(userId: number, lessonId: number) {
    try {
      const [rows] = await pool.execute(
        `SELECT is_completed, watch_percent FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`,
        [userId, lessonId]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }
}
