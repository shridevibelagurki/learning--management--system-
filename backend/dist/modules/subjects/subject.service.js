"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const subject_repository_1 = require("./subject.repository");
const database_1 = __importDefault(require("../../config/database"));
class SubjectService {
    constructor() {
        this.repository = new subject_repository_1.SubjectRepository();
    }
    async getSubjects(userId) {
        try {
            const subjects = await this.repository.findAll();
            // If user is logged in, calculate progress for each course
            if (userId) {
                for (let course of subjects) {
                    // Get total lessons in this course
                    const [totalResult] = await database_1.default.execute(`SELECT COUNT(*) as total FROM videos v 
             JOIN sections s ON v.section_id = s.id 
             WHERE s.subject_id = ?`, [course.id]);
                    const totalLessons = totalResult[0].total;
                    // Get completed lessons for this user in this course
                    const [completedResult] = await database_1.default.execute(`SELECT COUNT(*) as completed FROM lesson_progress lp
             JOIN videos v ON lp.lesson_id = v.id
             JOIN sections s ON v.section_id = s.id
             WHERE lp.user_id = ? AND s.subject_id = ? AND lp.is_completed = 1`, [userId, course.id]);
                    const completedLessons = completedResult[0].completed;
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
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    async getSubjectById(id) {
        try {
            console.log('Service: fetching subject with ID:', id);
            const subject = await this.repository.findById(id);
            if (!subject) {
                throw new Error('Subject not found');
            }
            return subject;
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    async getSubjectByLanguage(id, language) {
        try {
            const subject = await this.repository.findByLanguagePair(id, language);
            if (!subject) {
                throw new Error('Subject not found in selected language');
            }
            return subject;
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    async getAvailableLanguages(id) {
        try {
            return await this.repository.getAvailableLanguages(id);
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
}
exports.SubjectService = SubjectService;
