import express from 'express';

import generatePDF from '../services/pdfGenerater.js';

const pdfRoute = express.Router();

pdfRoute.post('/generate-pdf', generatePDF);

export default pdfRoute;