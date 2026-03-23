const jwt = require('jsonwebtoken');
require('dotenv').config();

const accessSecret = process.env.JWT_ACCESS_SECRET || 'my-secret-key';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'my-refresh-key';
const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '30d';

function generateAccessToken(payload) {
    return jwt.sign(payload, accessSecret, { expiresIn: accessExpiry });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiry });
}

function verifyAccessToken(token) {
    return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, refreshSecret);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};