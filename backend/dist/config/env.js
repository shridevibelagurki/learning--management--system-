"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000'),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        name: process.env.DB_NAME || 'lms_db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    cookie: {
        domain: process.env.COOKIE_DOMAIN || 'localhost',
    },
};
