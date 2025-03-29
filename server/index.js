import express from 'express'
import 'dotenv/config'
import dealerRoute from './Routes/dealerRoutes.js'
import plantRoute from './Routes/plantRoutes.js'

const app = express();
const PORT = 3000;
// require('dotenv').config()

app.use(dealerRoute);
app.use(plantRoute);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});