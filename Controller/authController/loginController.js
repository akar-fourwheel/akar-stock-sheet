import { authenticateUser, generateTokens } from "../../middleware/auth.js";

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }

    const user = await authenticateUser(username, password);
    console.log('Authentication result:', user ? 'Success' : 'Failed');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const tokens = await generateTokens(user);
    console.log(tokens);
    
    console.log('Tokens generated:', !!tokens.accessToken, !!tokens.refreshToken);
    
    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error('Failed to generate tokens');
    }

    // Structure response for localStorage storage
    const response = {
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        auth: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: 'Bearer'
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

export default loginController;