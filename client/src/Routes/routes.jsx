import { createBrowserRouter } from "react-router";
import App from '../App';

import StockPage from '../Pages/stockPage';
import SchemePage from '../Pages/schemePage';
import QuotationPage from '../Pages/quotationPage'
import AllQuotation from "../Pages/AllQuotation";
import QuotationForBooking from '../Pages/quotationForBooking'
import BookingPage from "../Pages/booking/BookingPage";
import BookingForm from "../Pages/booking/BookingForm";
import bookingSuccess from "../Pages/booking/bookingSuccess";

export const routes = createBrowserRouter([
    {
        path:'/',
        Component:App,
    },
    {
        path:'/stock-sheet',
        Component:StockPage
    },
    {
        path:'/scheme-sheet',
        Component: SchemePage
    },
    {
        path:'/quotation',
        Component:QuotationPage
    },
    {
        path:'/quotation-list',
        Component:QuotationForBooking
    },
    {
        path:'/booking-list',
        Component:BookingPage
    },
    {
        path:'/booking-form/:id',
        Component:BookingForm
    },
    {
        path:'/booking-success/:chassis',
        Component:bookingSuccess
    },
    {
        path:'/545d65n85g',
        Component:AllQuotation
    }
])

export default routes