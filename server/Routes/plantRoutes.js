import express from 'express'
import cors from 'cors'
const plantRoute = express.Router();
import plantController from '../Controller/plantController.js'


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

plantRoute.get('/plant-data',cors(corsOptions),plantController);

export default plantRoute;