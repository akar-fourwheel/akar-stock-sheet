import express from 'express';

import bookingOptionsController from '../Controller/booking/bookingOptionsController.js'
import bookingPageController from '../Controller/booking/bookingPageController.js';
import bookingProcessController from '../Controller/booking/bookingProcessController.js';

const bookingRoute = express.Router();

bookingRoute.get('/booking-page', bookingPageController);
bookingRoute.post('/booking-process', bookingProcessController);
bookingRoute.get('/booking-check-cars', bookingOptionsController);

export default bookingRoute;