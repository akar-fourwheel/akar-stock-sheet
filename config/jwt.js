
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_CONFIG = {
  // Token expiration times
  expiresIn: {
    accessToken: '15m',    // Short-lived for security
    refreshToken: '7d',    // Longer-lived for session persistence
  },
  // Token types
  tokenTypes: {
    ACCESS: 'access',
    REFRESH: 'refresh',
  },
};

// Generate tokens
const generateToken = (userId, role, tokenType) => {
  const secret = tokenType === JWT_CONFIG.tokenTypes.ACCESS 
    ? process.env.JWT_ACCESS_SECRET 
    : process.env.JWT_REFRESH_SECRET;
    
  const expiresIn = tokenType === JWT_CONFIG.tokenTypes.ACCESS 
    ? JWT_CONFIG.expiresIn.accessToken 
    : JWT_CONFIG.expiresIn.refreshToken;

  return jwt.sign(
    {
      sub: userId,
      role,
      type: tokenType,
    },
    secret,
    { expiresIn }
  );
};

// Verify token
const verifyToken = (token, tokenType) => {
  const secret = tokenType === JWT_CONFIG.tokenTypes.ACCESS 
    ? process.env.JWT_ACCESS_SECRET 
    : process.env.JWT_REFRESH_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Generate token pair (access + refresh)
const generateTokenPair = (userId, role) => {
  return {
    accessToken: generateToken(userId, role, JWT_CONFIG.tokenTypes.ACCESS),
    refreshToken: generateToken(userId, role, JWT_CONFIG.tokenTypes.REFRESH),
  };
};

export default {
  JWT_CONFIG,
  generateToken,
  verifyToken,
  generateTokenPair,
};