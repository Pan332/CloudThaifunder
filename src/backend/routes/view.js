import express from 'express';
import { getUserInfo, updateUserInfo, getCampaignInfo, getAllCampaign, getCampaignById, CountAllCampaign, CountAllUser, CountAllAmount } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo);
router.put('/update-user-info', updateUserInfo);
router.get('/campaign-info', getCampaignInfo);
router.get('/Allcampaign', getAllCampaign);
router.get('/CampaignById/:id', getCampaignById);
router.get('/CountCampaigns', CountAllCampaign);
router.get('/CountUser', CountAllUser);
router.get('/CountAmount', CountAllAmount);


export default router;


