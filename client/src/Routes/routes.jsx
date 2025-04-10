import { createBrowserRouter } from "react-router";
import App from '../App';

import StockPage from '../Pages/stockPage';
import SchemePage from '../Pages/schemePage';
import QuotationPage from '../Pages/quotationPage'
import AllQuotation from "../Pages/AllQuotation";

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
        path:'/all-quotation',
        Component:AllQuotation
    }
])

export default routes