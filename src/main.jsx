import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from './pages/Homepage.jsx'
import './index.css'
import CharitiesPage from './pages/CharitiesPage.jsx';

import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';


const router = createBrowserRouter([
  {path: '/', element: <Homepage/>},
  {path: '/CharitiesPage', element: <CharitiesPage/>},

  {path: '/ContactPage', element: <ContactPage/>},
  {path: '/AboutPage', element: <AboutPage/>},

  {path: '/ServicePage', element: <ServicePage/>},
  {path: '/RegisterPage', element: <RegisterPage/>}

 


])


createRoot(document.getElementById('index')).render(
  <StrictMode>
    <RouterProvider router={router}/>
      </StrictMode>,
)
