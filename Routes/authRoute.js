import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';

import loginController from '../Controller/authController/loginController.js';
import verifyController from '../Controller/authController/verifyController.js';
import refreshController from '../Controller/authController/refreshController.js';
import signupController from '../Controller/authController/signupController.js';

const authRoute = express.Router();

// Signup endpoint
authRoute.post('/auth/signup', signupController);

// Login endpoint
authRoute.post('/auth/login', loginController);

// Token verification endpoint
authRoute.get('/auth/verify', authenticateJWT, verifyController);

// Token refresh endpoint
authRoute.post('/auth/refresh-token', refreshController);

export default authRoute;