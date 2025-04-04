import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import stockSheetRoute from './Routes/stockSheets.js'
import corsOptions from './mixins/corsOptions.js';

const app = express();
const PORT = 3000;
// require('dotenv').config()

app.use(cors(corsOptions))

app.use(stockSheetRoute);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});