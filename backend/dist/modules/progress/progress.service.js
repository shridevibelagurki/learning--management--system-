"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const progress_repository_1 = require("./progress.repository");
class ProgressService {
    constructor() {
        this.repository = new progress_repository_1.ProgressRepository();
    }
    async updateLessonProgress(userId, lessonId, subject_id, isCompleted, watchPercent = 0) {
        try {
            await this.repository.upsertLessonProgress(userId, lessonId, subject_id, isCompleted, watchPercent);
            return { message: 'Progress updated successfully' };
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    async getLessonProgress(userId, lessonId) {
        try {
            return await this.repository.getLessonProgress(userId, lessonId);
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
}
exports.ProgressService = ProgressService;
