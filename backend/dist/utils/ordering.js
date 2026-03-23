"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoSequence = getVideoSequence;
exports.getPreviousVideoId = getPreviousVideoId;
exports.getNextVideoId = getNextVideoId;
exports.isVideoUnlocked = isVideoUnlocked;
const database_1 = __importDefault(require("../config/database"));
async function getVideoSequence(subjectId) {
    const [rows] = await database_1.default.execute(`SELECT 
      v.id as videoId,
      v.order_index as orderIndex,
      s.order_index as sectionOrder
    FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE s.subject_id = ?
    ORDER BY s.order_index ASC, v.order_index ASC`, [subjectId]);
    return rows;
}
async function getPreviousVideoId(subjectId, currentVideoId) {
    const sequence = await getVideoSequence(subjectId);
    const currentIndex = sequence.findIndex(v => v.videoId === currentVideoId);
    if (currentIndex > 0) {
        return sequence[currentIndex - 1].videoId;
    }
    return null;
}
async function getNextVideoId(subjectId, currentVideoId) {
    const sequence = await getVideoSequence(subjectId);
    const currentIndex = sequence.findIndex(v => v.videoId === currentVideoId);
    if (currentIndex < sequence.length - 1) {
        return sequence[currentIndex + 1].videoId;
    }
    return null;
}
async function isVideoUnlocked(userId, subjectId, videoId) {
    const previousVideoId = await getPreviousVideoId(subjectId, videoId);
    if (!previousVideoId) {
        return true;
    }
    const [rows] = await database_1.default.execute(`SELECT is_completed FROM video_progress 
     WHERE user_id = ? AND video_id = ?`, [userId, previousVideoId]);
    const progress = rows[0];
    return progress?.is_completed === true;
}
