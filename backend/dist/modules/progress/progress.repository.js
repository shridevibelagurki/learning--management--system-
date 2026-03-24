"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class ProgressRepository {
    async upsertLessonProgress(userId, lessonId, subject_id, isCompleted, watchPercent = 0) {
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
            await database_1.default.execute(query, [userId, lessonId, subject_id, isCompletedNum, watchPercent]);
            // Also ensure enrollment exists
            const enrollQuery = `
        INSERT IGNORE INTO enrollments (user_id, subject_id)
        VALUES (?, ?)
      `;
            await database_1.default.execute(enrollQuery, [userId, subject_id]);
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
    async getLessonProgress(userId, lessonId) {
        try {
            const [rows] = await database_1.default.execute(`SELECT is_completed, watch_percent FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`, [userId, lessonId]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
}
exports.ProgressRepository = ProgressRepository;
