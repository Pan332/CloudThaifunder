import express from 'express';
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from '../controllers/campaignControllers.js'; // Adjust import based on your directory structure
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import uploadAndConvert from '../middleware/multer.js';
import { verifyAdmin } from '../middleware/backend/isAdmin.js';

const router = express.Router();


router.post('/createcampaign',isAuthenticated, uploadAndConvert, createCampaign);
router.get('/', getCampaigns);
router.put('/updatecampaign',isAuthenticated, updateCampaign);
router.delete('/deletecampaign',verifyAdmin, deleteCampaign);

export default router;



