import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import './index.css';
import Charities from './pages/CharitiesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import SignupForm from './pages/RegisterPage.jsx';
import ViewInfo from './components/ViewInfo.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/CharitiesPage', element: <Charities /> },
  { path: '/ContactPage', element: <ContactPage /> }, // Adjusted path to be more RESTful
  { path: '/AboutPage', element: <AboutPage /> }, // Adjusted path to be more RESTful
  { path: '/ServicePage', element: <ServicePage /> }, // Adjusted path to be more RESTful
  { path: '/signup', element: <SignupForm /> }, // Fixed the missing comma
  { path: '/ViewInfo', element: <ViewInfo /> }
]);

createRoot(document.getElementById('index')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);