"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const database_1 = __importDefault(require("../../config/database"));
class CourseController {
    async getVideo(req, res, next) {
        try {
            const { videoId } = req.params;
            const id = typeof videoId === 'string' ? parseInt(videoId) : parseInt(videoId[0]);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid video ID' });
            }
            const [videos] = await database_1.default.execute(`SELECT v.id, v.title, v.youtube_url, v.youtube_id, 
                sub.title as course_title
         FROM videos v
         JOIN sections s ON v.section_id = s.id
         JOIN subjects sub ON s.subject_id = sub.id
         WHERE v.id = ?`, [id]);
            if (videos.length === 0) {
                return res.status(404).json({ message: 'Video not found' });
            }
            const video = videos[0];
            const [allVideos] = await database_1.default.execute(`SELECT v.id, v.order_index, s.order_index as section_order
         FROM videos v
         JOIN sections s ON v.section_id = s.id
         WHERE s.subject_id = (SELECT subject_id FROM sections WHERE id = (SELECT section_id FROM videos WHERE id = ?))
         ORDER BY s.order_index, v.order_index`, [id]);
            const videoList = allVideos;
            const currentIndex = videoList.findIndex((v) => v.id === id);
            const prevVideoId = currentIndex > 0 ? videoList[currentIndex - 1].id : null;
            const nextVideoId = currentIndex < videoList.length - 1 ? videoList[currentIndex + 1].id : null;
            res.json({
                id: video.id,
                title: video.title,
                youtube_url: video.youtube_url,
                youtube_id: video.youtube_id,
                course_title: video.course_title,
                prev_video_id: prevVideoId,
                next_video_id: nextVideoId
            });
        }
        catch (error) {
            console.error('Error:', error);
            next(error);
        }
    }
}
exports.CourseController = CourseController;
