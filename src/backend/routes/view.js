import express from 'express';
import { getUserInfo, updateUserInfo, getCampaignInfo, getAllCampaign } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo);
router.put('/update-user-info', updateUserInfo);
router.get('/campaign-info', getCampaignInfo);
router.get('/Allcampaign', getAllCampaign);


export default router;


