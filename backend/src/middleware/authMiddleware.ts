import { Request, Response, NextFunction } from 'express';

// Import from JavaScript file
const { verifyAccessToken } = require('../utils/jwt');

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid or expired token. Please log in again.' 
    });
  }
};