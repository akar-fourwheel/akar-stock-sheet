import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Token from '../models/Token.js';
import crypto from 'crypto';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Helper function to generate unique token
const generateUniqueToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to authenticate user
export const authenticateUser = async (username, password) => {
  try {
    console.log('Authenticating user:', username);
    const user = await User.findOne({ username: username.trim() });
    
    if (!user) {
      console.log('User not found:', username);
      return null;
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', username);
      return null;
    }
    
    console.log('User authenticated successfully:', username);
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Generate and store tokens
export const generateTokens = async (user) => {
  try {
    // Generate unique tokens
    const accessToken = generateUniqueToken();
    const refreshToken = generateUniqueToken();

    // Calculate expiration dates
    const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create token document
    const tokenDoc = new Token({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires
    });

    // Save token to database
    await tokenDoc.save();

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires
    };
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

// Middleware to verify access token
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Find token in database
    const tokenDoc = await Token.findOne({ 
      accessToken: token,
      accessTokenExpires: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(403).json({ 
        message: 'Invalid or expired token'
      });
    }

    // Get user information
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(403).json({ 
        message: 'User not found'
      });
    }

    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Verify refresh token
export const verifyRefreshToken = async (token) => {
  try {
    const tokenDoc = await Token.findOne({ 
      refreshToken: token,
      refreshTokenExpires: { $gt: new Date() }
    });

    if (!tokenDoc) {
      throw new Error('Invalid or expired refresh token');
    }

    return tokenDoc;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Role checking middleware
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRole: roles,
        currentRole: req.user.role
      });
    }
    next();
  };
};