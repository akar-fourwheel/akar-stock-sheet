import express from 'express'
import 'dotenv/config'
import dealerRoute from './Routes/dealerRoutes.js'
import zonalRoute from './Routes/zonalRoute.js'

const app = express();
const PORT = 3000;
// require('dotenv').config()

app.use(dealerRoute);
app.use(zonalRoute);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});