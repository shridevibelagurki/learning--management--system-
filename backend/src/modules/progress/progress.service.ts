import { ProgressRepository } from './progress.repository';

export class ProgressService {
  private repository = new ProgressRepository();

  async updateLessonProgress(userId: number, lessonId: number, subject_id: number, isCompleted: boolean, watchPercent: number = 0) {
    try {
      await this.repository.upsertLessonProgress(userId, lessonId, subject_id, isCompleted, watchPercent);
      return { message: 'Progress updated successfully' };
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async getLessonProgress(userId: number, lessonId: number) {
    try {
      return await this.repository.getLessonProgress(userId, lessonId);
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}
