import express from 'express';

import bookingOptionsController from '../Controller/booking/bookingOptionsController.js'
import bookingPageController from '../Controller/booking/bookingPageController.js';
import bookingProcessController from '../Controller/booking/bookingProcessController.js';
import bookingColorController from '../Controller/booking/bookingColorController.js';

const bookingRoute = express.Router();

bookingRoute.get('/booking-page', bookingPageController);
bookingRoute.post('/booking-process', bookingProcessController);
bookingRoute.get('/booking-check-cars', bookingOptionsController);
bookingRoute.get('/booking-color', bookingColorController);

export default bookingRoute;