"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("./progress.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new progress_controller_1.ProgressController();
// All progress routes require authentication
router.post('/lesson', authMiddleware_1.authMiddleware, controller.updateProgress.bind(controller));
exports.default = router;
