"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const progress_service_1 = require("./progress.service");
const progressService = new progress_service_1.ProgressService();
class ProgressController {
    async updateProgress(req, res, next) {
        try {
            const userId = req.user?.userId;
            const { lessonId, subjectId, isCompleted, watchPercent } = req.body;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const result = await progressService.updateLessonProgress(userId, parseInt(lessonId), parseInt(subjectId), isCompleted, watchPercent || 0);
            res.json(result);
        }
        catch (error) {
            console.error('Controller error:', error);
            next(error);
        }
    }
}
exports.ProgressController = ProgressController;
