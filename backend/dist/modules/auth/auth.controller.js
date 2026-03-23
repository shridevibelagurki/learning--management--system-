"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const errorHandler_1 = require("../../middleware/errorHandler");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                throw new errorHandler_1.AppError('Email, password, and name are required', 400);
            }
            const result = await authService.register(email, password, name);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
            res.status(201).json({
                message: 'Registration successful',
                user: result.user,
                accessToken: result.accessToken
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errorHandler_1.AppError('Email and password are required', 400);
            }
            const result = await authService.login(email, password);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.json({
                message: 'Login successful',
                user: result.user,
                accessToken: result.accessToken
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new errorHandler_1.AppError('Refresh token not found', 401);
            }
            const result = await authService.refresh(refreshToken);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            res.json({
                accessToken: result.accessToken
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            res.clearCookie('refreshToken');
            res.json({ message: 'Logout successful' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
