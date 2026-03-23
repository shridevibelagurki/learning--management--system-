"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subject_service_1 = require("./subject.service");
const subjectService = new subject_service_1.SubjectService();
class SubjectController {
    async getSubjects(req, res, next) {
        try {
            console.log('Getting subjects...');
            // Get userId from authenticated user (if logged in)
            const userId = req.user?.userId;
            const result = await subjectService.getSubjects(userId);
            console.log('Subjects result:', result);
            res.json(result);
        }
        catch (error) {
            console.error('Detailed controller error:', error);
            next(error);
        }
    }
    async getSubjectById(req, res, next) {
        try {
            const { subjectId } = req.params;
            console.log('Getting subject by ID:', subjectId);
            const id = typeof subjectId === 'string' ? parseInt(subjectId) : parseInt(subjectId[0]);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid subject ID' });
            }
            const subject = await subjectService.getSubjectById(id);
            res.json(subject);
        }
        catch (error) {
            console.error('Error getting subject:', error);
            next(error);
        }
    }
    // NEW METHOD: Get subject with language options
    async getSubjectWithLanguages(req, res, next) {
        try {
            const { subjectId } = req.params;
            const language = req.query.lang || 'English';
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
        }
        catch (error) {
            console.error('Error getting subject with languages:', error);
            next(error);
        }
    }
}
exports.SubjectController = SubjectController;
