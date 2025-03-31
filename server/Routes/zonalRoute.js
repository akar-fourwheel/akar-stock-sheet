import express from 'express'
import cors from 'cors'
const dealerRoute = express.Router();
import zonalController from '../Controller/zonalController.js'


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

dealerRoute.get('/zonal-data',cors(corsOptions),zonalController);

export default dealerRoute;