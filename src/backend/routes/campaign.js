import express from 'express';
import { createCampaign, getCampaigns, updateCampaign, deleteCampaign } from '../controllers/campaignControllers.js'; // Adjust import based on your directory structure

const router = express.Router();

router.post('/createcampaign', createCampaign);
router.get('/', getCampaigns);
router.put('/updatecampaign', updateCampaign);
router.delete('/deletecampaign', deleteCampaign);

export default router;