import express from 'express';
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from '../controllers/campaignControllers.js'; // Adjust import based on your directory structure
import { isAuthenticated } from '../middleware/backend/isAuth.js';
const router = express.Router();

<<<<<<< HEAD
router.post('/createcampaign',isAuthenticated, createCampaign);
router.get('/',isAuthenticated, getCampaigns);
router.put('/updatecampaign',isAuthenticated, updateCampaign);
router.delete('/deletecampaign',isAuthenticated, deleteCampaign);

export default router;
=======
router.post('/createcampaign', isAuthenticated, createCampaign);
router.get('/', isAuthenticated,getCampaigns);
router.put('/updatecampaign', isAuthenticated,updateCampaign);
router.delete('/deletecampaign', isAuthenticated,deleteCampaign);

export default router;
>>>>>>> 6d9184a65caaaa431edcf6efd8a9567c59aa4a50
