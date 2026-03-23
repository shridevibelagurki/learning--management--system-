"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
const courseController = new course_controller_1.CourseController();
router.get('/videos/:videoId', authMiddleware_1.authMiddleware, courseController.getVideo.bind(courseController));
exports.default = router;
