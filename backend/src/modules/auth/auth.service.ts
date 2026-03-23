import pool from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import { RowDataPacket, OkPacket } from 'mysql2';
import crypto from 'crypto';


// Replace the import line with:
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
// Define TokenPayload interface

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export interface RefreshTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
}

export class AuthService {
  async register(email: string, password: string, name: string) {
    // Check if user exists
    const [existingUsers] = await pool.execute<UserRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Insert user
    const [result] = await pool.execute<OkPacket>(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name]
    );

    const userId = result.insertId;

    // Generate tokens
    const payload: TokenPayload = { userId, email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, tokenHash, expiresAt]
    );

    return {
      user: { id: userId, email, name },
      accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string) {
    // Find user
    const [users] = await pool.execute<UserRow[]>(
      'SELECT id, email, password_hash, name FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const payload: TokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Revoke old refresh tokens
    await pool.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
      [user.id]
    );

    // Insert new refresh token
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const [tokens] = await pool.execute<RefreshTokenRow[]>(
      `SELECT id, user_id, expires_at, revoked_at 
       FROM refresh_tokens 
       WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()`,
      [tokenHash]
    );

    if (tokens.length === 0) {
      throw new Error('Invalid or expired refresh token');
    }

    const tokenRecord = tokens[0];

    const [users] = await pool.execute<UserRow[]>(
      'SELECT id, email, name FROM users WHERE id = ?',
      [tokenRecord.user_id]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];

    const payload: TokenPayload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await pool.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?',
      [tokenRecord.id]
    );

    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, newTokenHash, expiresAt]
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    await pool.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL',
      [tokenHash]
    );
  }
}