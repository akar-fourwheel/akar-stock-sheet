import express from 'express';
import { authenticateJWT, checkRole } from '../middleware/auth.js';

import initialFetch from '../Controller/quotation/initialFetchController.js';
import quotationController from '../Controller/quotation/quotationController.js';

const quotationRoute = express.Router();

// Apply authentication and role check to all routes
quotationRoute.use(authenticateJWT);
quotationRoute.use(checkRole(['sales']));

quotationRoute.get('/quotation', initialFetch);
quotationRoute.get('/quotation-data', quotationController);

export default quotationRoute;