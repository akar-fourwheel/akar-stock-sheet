import { createBrowserRouter } from "react-router";
import App from '../App';

import StockPage from '../Pages/stockPage';
import SchemePage from '../Pages/schemePage';

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
    }
])

export default routes