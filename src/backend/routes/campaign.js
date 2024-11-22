import express from 'express';
import { createCampaign, getCampaigns, editCampaign,  deleteCampaign } from '../controllers/campaignControllers.js'; // Adjust import based on your directory structure
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import uploadAndConvert from '../middleware/multer.js';

const router = express.Router();


router.post('/createcampaign' , isAuthenticated, uploadAndConvert, createCampaign);
router.get('/', getCampaigns);
router.patch('/editCampaign/:id',isAuthenticated, editCampaign);
router.delete('/deletecampaign', isAuthenticated, deleteCampaign);

export default router;



