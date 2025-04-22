import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";
import 'dotenv/config'
import connectDB from './config/db.js'

import corsOptions from './config/corsOptions.js';

import stockSheetRoute from './Routes/stockSheets.js';
import schemeSheetRoute from './Routes/schemeSheet.js';
import quotationRoute from './Routes/quotationRoute.js';
import pdfRoute from './Routes/pdfRoute.js';
import allQuotationRoute from './Routes/allQuotationsRoute.js';
import bookingRoute from './Routes/bookingRoute.js'
import authRoute from './Routes/authRoute.js'

const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(authRoute);
app.use(stockSheetRoute);
app.use(schemeSheetRoute);
app.use(quotationRoute);
app.use(pdfRoute);
app.use(allQuotationRoute);
app.use(bookingRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});