import { createBrowserRouter,RouterProvider } from 'react-router'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './Routes/routes.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
