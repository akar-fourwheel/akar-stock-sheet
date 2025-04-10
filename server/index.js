import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

import 'dotenv/config'

import corsOptions from './mixins/corsOptions.js';

import stockSheetRoute from './Routes/stockSheets.js';
import schemeSheetRoute from './Routes/schemeSheet.js';
import quotationRoute from './Routes/quotationRoute.js';
import pdfRoute from './Routes/pdfRoute.js';
import allQuotationRoute from './Routes/allQuotationsRoute.js';

const app = express();
const PORT = 8080;

app.use(cors(corsOptions))
app.use(bodyParser.json());

app.use(stockSheetRoute);
app.use(schemeSheetRoute);
app.use(quotationRoute);
app.use(pdfRoute);
app.use(allQuotationRoute);


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is live!`);
});