import express from 'express'

import initialFetch from '../Controller/schemeSheet/initialFetchController.js'
import schemeController from '../Controller/schemeSheet/schemeController.js';

const schemeSheetRoute = express.Router();

schemeSheetRoute.get('/scheme',initialFetch);
schemeSheetRoute.get('/scheme-data',schemeController);

export default schemeSheetRoute;
