import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import './index.css';
import Charities from './pages/Charities.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import SignupForm from './pages/signup.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/charities', element: <Charities /> },
  { path: '/contact', element: <ContactPage /> }, // Adjusted path to be more RESTful
  { path: '/about', element: <AboutPage /> }, // Adjusted path to be more RESTful
  { path: '/service', element: <ServicePage /> }, // Adjusted path to be more RESTful
  { path: '/signup', element: <SignupForm /> } // Fixed the missing comma
]);

createRoot(document.getElementById('index')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
