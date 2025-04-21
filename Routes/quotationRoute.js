import express from 'express';

import initialFetch from '../Controller/quotation/initialFetchController.js';
import quotationController from '../Controller/quotation/quotationController.js';

const quotationRoute = express.Router();

quotationRoute.get('/quotation',initialFetch);
quotationRoute.get('/quotation-data',quotationController);

export default quotationRoute;