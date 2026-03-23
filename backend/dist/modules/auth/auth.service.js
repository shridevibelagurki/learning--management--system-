"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const password_1 = require("../../utils/password");
const crypto_1 = __importDefault(require("crypto"));
// Replace the import line with:
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
class AuthService {
    async register(email, password, name) {
        // Check if user exists
        const [existingUsers] = await database_1.default.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            throw new Error('User already exists with this email');
        }
        // Hash password
        const passwordHash = await (0, password_1.hashPassword)(password);
        // Insert user
        const [result] = await database_1.default.execute('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [email, passwordHash, name]);
        const userId = result.insertId;
        // Generate tokens
        const payload = { userId, email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        // Store refresh token
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await database_1.default.execute('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [userId, tokenHash, expiresAt]);
        return {
            user: { id: userId, email, name },
            accessToken,
            refreshToken
        };
    }
    async login(email, password) {
        // Find user
        const [users] = await database_1.default.execute('SELECT id, email, password_hash, name FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new Error('Invalid email or password');
        }
        const user = users[0];
        // Verify password
        const isValid = await (0, password_1.comparePassword)(password, user.password_hash);
        if (!isValid) {
            throw new Error('Invalid email or password');
        }
        // Generate tokens
        const payload = { userId: user.id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        // Store refresh token
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        // Revoke old refresh tokens
        await database_1.default.execute('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [user.id]);
        // Insert new refresh token
        await database_1.default.execute('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [user.id, tokenHash, expiresAt]);
        return {
            user: { id: user.id, email: user.email, name: user.name },
            accessToken,
            refreshToken
        };
    }
    async refresh(refreshToken) {
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const [tokens] = await database_1.default.execute(`SELECT id, user_id, expires_at, revoked_at 
       FROM refresh_tokens 
       WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()`, [tokenHash]);
        if (tokens.length === 0) {
            throw new Error('Invalid or expired refresh token');
        }
        const tokenRecord = tokens[0];
        const [users] = await database_1.default.execute('SELECT id, email, name FROM users WHERE id = ?', [tokenRecord.user_id]);
        if (users.length === 0) {
            throw new Error('User not found');
        }
        const user = users[0];
        const payload = { userId: user.id, email: user.email };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);
        const newTokenHash = crypto_1.default.createHash('sha256').update(newRefreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await database_1.default.execute('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?', [tokenRecord.id]);
        await database_1.default.execute('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [user.id, newTokenHash, expiresAt]);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(refreshToken) {
        const tokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        await database_1.default.execute('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL', [tokenHash]);
    }
}
exports.AuthService = AuthService;
