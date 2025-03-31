import express from 'express'
import cors from 'cors'
const zawlRoute = express.Router();
import zawlController from '../Controller/zawlController.js'


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

zawlRoute.get('/zawl-data',cors(corsOptions),zawlController);

export default zawlRoute;