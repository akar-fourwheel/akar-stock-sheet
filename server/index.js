import express from 'express'
import 'dotenv/config'
import dealerRoute from './Routes/dealerRoutes.js'
import zonalRoute from './Routes/zonalRoute.js'
import plantRoute from './Routes/plantRoutes.js'
import zawlRoute from './Routes/zawlRoutes.js'

const app = express();
const PORT = 3000;
// require('dotenv').config()

app.use(dealerRoute);
app.use(zonalRoute);
app.use(plantRoute);
app.use(zawlRoute);

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});