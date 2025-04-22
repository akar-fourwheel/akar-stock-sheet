import { authenticateJWT } from "../../middleware/auth.js";

const verifyController = async (req, res) => {
  try {
    // The authenticateJWT middleware will handle the token verification
    // If we reach this point, the token is valid
    
    res.json({
      message: 'Token is valid',
      user: {
        id: req.user.userId,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export default verifyController; 