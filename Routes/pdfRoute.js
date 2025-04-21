import express from 'express';

import generatePDF from '../mixins/pdfGenerater.js';

const pdfRoute = express.Router();

pdfRoute.post('/generate-pdf', generatePDF);

export default pdfRoute;