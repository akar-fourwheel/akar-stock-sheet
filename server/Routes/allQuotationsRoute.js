import express from 'express';

import allQuotationController from '../Controller/allQuotations/allQuotationController.js';

const allQuotationRoute = express.Router();

allQuotationRoute.get('/all-quotations', allQuotationController);

export default allQuotationRoute;