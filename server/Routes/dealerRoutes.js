import express from 'express'
import cors from 'cors'
const dealerRoute = express.Router();
import dealerController from '../Controller/dealerController.js'


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

dealerRoute.get('/dealership-data',cors(corsOptions),dealerController);

export default dealerRoute;