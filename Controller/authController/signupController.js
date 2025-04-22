import User from '../../models/User.js';
import { generateTokens } from '../../middleware/auth.js';

const signupController = async (req, res) => {
  try {
      const { username, password, role } = req.body;
      
      console.log(username,password);

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }

    // Validate role
    const validRoles = ['admin', 'sales'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be either admin or sales'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      role: role || 'sales' // Default to sales role if not specified
    });

    // Save user to database
    await newUser.save();

    // Generate tokens
    const tokens = generateTokens(newUser);

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role
        },
        auth: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: 'Bearer'
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

export default signupController; 