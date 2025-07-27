import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// In-memory blacklist for access tokens (in production, consider using Redis)
const tokenBlacklist = new Set();

export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000) // issued at time
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRES_IN 
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

export const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // Auto-remove from blacklist after token expiry (1 hour by default)
  const expiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, expiryTime);
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const invalidateTokens = async (userId, currentAccessToken = null) => {
  // Add current access token to blacklist if provided
  if (currentAccessToken) {
    blacklistToken(currentAccessToken);
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      refreshToken: null,
      lastLoginAt: new Date() 
    }
  });
};