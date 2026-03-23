import pool from '../../config/database';

export class SubjectRepository {
  async findAll(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT id, title, description, instructor_id, instructor_name, category, thumbnail_url, 
                slug, level, price, is_published, language, language_pair_id, total_lessons, duration_hours
         FROM subjects 
         WHERE is_published = 1`
      );
      return rows as any[];
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<any> {
    try {
      const [rows] = await pool.execute(
        `SELECT id, title, description, instructor_id, instructor_name, category, thumbnail_url, 
                slug, level, price, is_published, language, language_pair_id, total_lessons, duration_hours
         FROM subjects 
         WHERE id = ?`,
        [id]
      );
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }

  async findByLanguagePair(id: number, language: string): Promise<any> {
    try {
      const currentCourse = await this.findById(id);
      if (!currentCourse) return null;

      if (currentCourse.language === language) return currentCourse;

      if (currentCourse.language_pair_id) {
        const [rows] = await pool.execute(
          `SELECT id, title, description, instructor_id, category, thumbnail_url, 
                  slug, level, price, is_published, language, language_pair_id
           FROM subjects 
           WHERE id = ?`,
          [currentCourse.language_pair_id]
        );
        return (rows as any[])[0] || null;
      }

      return null;
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }

  async getAvailableLanguages(id: number): Promise<string[]> {
    try {
      const course = await this.findById(id);
      const languages = [course.language || 'English'];
      
      if (course.language_pair_id) {
        const paired = await this.findById(course.language_pair_id);
        if (paired && paired.language) {
          languages.push(paired.language);
        }
      }
      
      return languages;
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }

  async findLessonsBySubjectId(subjectId: number): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT id, title, video_url, duration_minutes, order_index 
         FROM lessons 
         WHERE subject_id = ? 
         ORDER BY order_index ASC`,
        [subjectId]
      );
      return rows as any[];
    } catch (error) {
      console.error('Repository error:', error);
      throw error;
    }
  }
}