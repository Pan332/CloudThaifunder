import express from 'express';
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import { verifyAdmin } from '../middleware/backend/isAdmin.js';
import uploadAndConvert from '../middleware/multer.js';

import { getUserInfo, updateUserInfo, getCampaignInfo, getAllCampaign, getCampaignById, CountAllCampaign, CountAllUser, CountAllAmount } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo); // for viewinfo
router.put('/update-user-info', isAuthenticated, updateUserInfo); // for edit viewinfo
router.get('/campaign-info', getCampaignInfo); // for made by each user
router.get('/Allcampaign', getAllCampaign); // for card
router.get('/CampaignById/:id', getCampaignById); //for detailpage
router.get('/CountCampaigns', CountAllCampaign); //dashboard
router.get('/CountUser', CountAllUser); //dashboard
router.get('/CountAmount', CountAllAmount); //dashboard


export default router;


