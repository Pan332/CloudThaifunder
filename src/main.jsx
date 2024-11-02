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
import CategoriesPage from './pages/CategoriesPage.jsx';
import EducationPage from './pages/EducationPage.jsx';

import GamesPage from './pages/GamesPage.jsx';
import MusicPage from './pages/MusicPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TechnologyPage from './pages/TechnologyPage.jsx';

import ViewInfo from './components/ViewInfo.jsx';
import Campaign from './pages/CampaignManager.jsx';


const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/CharitiesPage', element: <Charities /> },
  { path: '/ContactPage', element: <ContactPage /> }, // Adjusted path to be more RESTful
  { path: '/AboutPage', element: <AboutPage /> }, // Adjusted path to be more RESTful
  { path: '/ServicePage', element: <ServicePage /> }, // Adjusted path to be more RESTful
  { path: '/RegisterPage', element: <SignupForm /> }, // Fixed the missing comma
  { path: '/ViewInfo', element: <ViewInfo /> },
  { path: '/CampaignManager', element: <Campaign /> },
  { path: '/CategoriesPage', element: <CategoriesPage /> },
  { path: '/GamesPage', element: <GamesPage /> },
  { path: '/MusicPage', element: <MusicPage /> },
  { path: '/BooksPage', element: <BooksPage /> },
  { path: '/TechnologyPage', element: <TechnologyPage /> },
  { path: '/EducationPage', element: <EducationPage /> },

]);

createRoot(document.getElementById('index')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);