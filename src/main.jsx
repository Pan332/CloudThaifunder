import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from './pages/Homepage.jsx'
import './index.css'
import Charities from './pages/Charities.jsx';

import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicePage from './pages/ServicePage.jsx';

const router = createBrowserRouter([
  {path: '/', element: <Homepage/>},
  {path: '/Charities', element: <Charities/>},

  {path: '/ContactPage', element: <ContactPage/>},
  {path: '/AboutPage', element: <AboutPage/>},

  {path: '/ServicePage', element: <ServicePage/>}

 


])


createRoot(document.getElementById('index')).render(
  <StrictMode>
    <RouterProvider router={router}/>
      </StrictMode>,
)
