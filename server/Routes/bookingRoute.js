import express from 'express';

import bookingOptionsController from '../Controller/booking/bookingController.js'
import bookingController from '../Controller/booking/bookingController.js';

const bookingRoute = express.Router();

bookingRoute.get('/check-cars', bookingOptionsController);
bookingRoute.get('/book-car', bookingController);

export default bookingRoute;