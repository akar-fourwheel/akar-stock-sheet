import express from 'express'
import { authenticateJWT, checkRole } from '../middleware/auth.js'
import initialFetch from '../Controller/schemeSheet/initialFetchController.js'
import schemeController from '../Controller/schemeSheet/schemeController.js';

const schemeSheetRoute = express.Router();

// Apply authentication and role check to all routes
schemeSheetRoute.use(authenticateJWT);
schemeSheetRoute.use(checkRole(['sales']));

schemeSheetRoute.get('/scheme',initialFetch);
schemeSheetRoute.get('/scheme-data',schemeController);

export default schemeSheetRoute;
