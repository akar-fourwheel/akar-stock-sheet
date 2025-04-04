import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import corsOptions from './mixins/corsOptions.js';

import stockSheetRoute from './Routes/stockSheets.js';
import schemeSheetRoute from './Routes/schemeSheet.js';
import quotationRoute from './Routes/quotationRoute.js'

const app = express();
const PORT = 3000;

app.use(cors(corsOptions))

app.use(stockSheetRoute);
app.use(schemeSheetRoute);
app.use(quotationRoute);


app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});