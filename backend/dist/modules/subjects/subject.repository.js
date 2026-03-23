"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class SubjectRepository {
    async findAll() {
        try {
            const [rows] = await database_1.default.execute(`SELECT id, title, description, instructor_id, category, thumbnail_url, 
                slug, level, price, is_published, language, language_pair_id
         FROM subjects 
         WHERE is_published = 1`);
            return rows;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const [rows] = await database_1.default.execute(`SELECT id, title, description, instructor_id, category, thumbnail_url, 
                slug, level, price, is_published, language, language_pair_id
         FROM subjects 
         WHERE id = ?`, [id]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
    async findByLanguagePair(id, language) {
        try {
            const currentCourse = await this.findById(id);
            if (!currentCourse)
                return null;
            if (currentCourse.language === language)
                return currentCourse;
            if (currentCourse.language_pair_id) {
                const [rows] = await database_1.default.execute(`SELECT id, title, description, instructor_id, category, thumbnail_url, 
                  slug, level, price, is_published, language, language_pair_id
           FROM subjects 
           WHERE id = ?`, [currentCourse.language_pair_id]);
                return rows[0] || null;
            }
            return null;
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
    async getAvailableLanguages(id) {
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
        }
        catch (error) {
            console.error('Repository error:', error);
            throw error;
        }
    }
}
exports.SubjectRepository = SubjectRepository;
