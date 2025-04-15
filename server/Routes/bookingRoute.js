import express from 'express';

import bookingOptionsController from '../Controller/booking/bookingOptionsController.js'
import bookingFormController from '../Controller/booking/bookingFormController.js';
import bookingProcessController from '../Controller/booking/bookingProcessController.js';
import bookingColorController from '../Controller/booking/bookingColorController.js';
import bookingDetails from '../Controller/booking/bookingDetailsController.js';
import bookingPageController from '../Controller/booking/bookingPageController.js';

const bookingRoute = express.Router();

bookingRoute.get('/booking-page',bookingPageController);
bookingRoute.get('/booking-form', bookingFormController);
bookingRoute.post('/booking-process', bookingProcessController);
bookingRoute.get('/booking-check-cars', bookingOptionsController);
bookingRoute.get('/booking-color', bookingColorController);
bookingRoute.get('/booking-details',bookingDetails);

export default bookingRoute;