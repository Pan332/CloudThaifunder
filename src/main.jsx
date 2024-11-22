import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import './index.css';
import DetailsPage from './pages/CampaignsDetailsPage.jsx';
import Charities from './pages/CharitiesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import SignupForm from './pages/RegisterPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import MedicalPage from './pages/MedicalPage.jsx';
import FashionPage from './pages/FashionPage.jsx';
import DesignPage from './pages/DesignPage.jsx';
import FilmPage from './pages/FilmPage.jsx';
import ArtPage from './pages/ArtPage.jsx';
import BusinessPage from './pages/BusinessPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import MusicPage from './pages/MusicPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TechnologyPage from './pages/TechnologyPage.jsx';
import ViewInfo from './components/ViewInfo.jsx';
import ViewCampaign from './components/ViewCampaign.jsx';
import AlluserAdmin from './components/AlluserAdmin.jsx';
import AllcampaignsAdmin from './components/AllcampaignsAdmin.jsx';
import CampaignsValidate from './components/CampaignsValidate.jsx';
import DeleteAccount from './components/DeleteAccount.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import Campaign from './pages/CampaignManager.jsx';
import BadgeManager from './pages/BadgeManager.jsx';
import CampaignsDetailsPage from './pages/CampaignsDetailsPage';
import { CampaignProvider } from './components/CampaignContext';
import ProtectedAdmin from './backend/middleware/frontend/adminonly.js';
import ProtectedRoute from './backend/middleware/frontend/protected.js';
const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/DetailsPage', element: <DetailsPage /> },
  { path: '/CharitiesPage', element: <Charities /> },
  { path: '/ContactPage', element: <ContactPage /> }, // Adjusted path to be more RESTful
  { path: '/AboutPage', element: <AboutPage /> }, // Adjusted path to be more RESTful
  { path: '/ServicePage', element: <ServicePage /> }, // Adjusted path to be more RESTful
  { path: '/RegisterPage', element: <SignupForm /> }, // Fixed the missing comma
  { path: '/ViewInfo', element: <ViewInfo /> },
  { path: '/ViewCampaign', element: <ViewCampaign /> },
  { path: '/AlluserAdmin', element: <AlluserAdmin /> },
  { path: '/AllcampaignsAdmin', element: <AllcampaignsAdmin /> },
  { path: '/CampaignsValidate', element: <CampaignsValidate /> },
  { path: '/DeleteAccount', element: <DeleteAccount /> },

  { path: '/Unauthorized', element: <Unauthorized /> },
  { path: '/BadgeManager', element: <BadgeManager /> },
  { path: '/CampaignManager', element: <ProtectedRoute element={ <Campaign />}/>, },
  { path: '/CategoriesPage', element: <CategoriesPage /> },
  { path: '/GamesPage', element: <GamesPage /> },
  { path: '/BusinessPage', element: <BusinessPage /> },

  { path: '/MusicPage', element: <MusicPage /> },
  { path: '/BooksPage', element: <BooksPage /> },
  { path: '/MedicalPage', element: <MedicalPage /> },
  { path: '/TechnologyPage', element: <TechnologyPage /> },
  { path: '/EducationPage', element: <EducationPage /> },
  { path: '/FashionPage', element: <FashionPage /> },
  { path: '/DesignPage', element: <DesignPage /> },
  { path: '/FilmPage', element: <FilmPage /> },
  { path: '/ArtPage', element: <ArtPage /> },



  { path: '/CampaignsDetailsPage/:id/:title/:name', element: <CampaignsDetailsPage /> },


]);

createRoot(document.getElementById('index')).render(
  <CampaignProvider>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
  </CampaignProvider>
);