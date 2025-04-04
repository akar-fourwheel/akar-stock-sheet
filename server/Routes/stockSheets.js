import express from 'express'
import cors from 'cors'

import dealerController from '../Controller/stockSheet/dealerController.js'
import plantController from '../Controller/stockSheet/plantController.js'
import zawlController from '../Controller/stockSheet/zawlController.js'
import zonalController from '../Controller/stockSheet/zonalController.js'

const stockSheetRoute = express.Router();

stockSheetRoute.get('/stock/dealership-data',dealerController);
stockSheetRoute.get('/stock/plant-data',plantController);
stockSheetRoute.get('/stock/zawl-data',zawlController);
stockSheetRoute.get('/stock/zonal-data',zonalController);

export default stockSheetRoute;