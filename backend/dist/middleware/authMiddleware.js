"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// Import from JavaScript file
const { verifyAccessToken } = require('../utils/jwt');
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided. Please log in.'
            });
        }
        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);
        req.user = {
            userId: payload.userId,
            email: payload.email
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please log in again.'
        });
    }
};
exports.authMiddleware = authMiddleware;
