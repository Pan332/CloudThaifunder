import express from 'express';
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import { verifyAdmin } from '../middleware/backend/isAdmin.js';
import uploadAndConvert from '../middleware/multer.js';

import { getUserInfo, updateUserInfo, getCampaignInfo, getAllCampaign, getCampaignById,
 CountAllCampaign, CountAllUser, CountAllAmount, deleteUser, getDonations, getDonationsByCampaign, getTopContributors } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo); // for viewinfo
router.put('/update-user-info', isAuthenticated, updateUserInfo); // for edit viewinfo
router.get('/campaign-info', getCampaignInfo); // for made by each user
router.get('/Allcampaign', getAllCampaign); // for card
router.get('/CampaignById/:id', getCampaignById); //for detailpage
router.get('/CountCampaigns', CountAllCampaign); //dashboard
router.get('/CountUser', CountAllUser); //dashboard
router.get('/CountAmount', CountAllAmount); //dashboard
router.get('/getDonations/:id', getDonations); //dashboard
router.get('/getTopContributors/:id', getTopContributors); //dashboard
router.get('/getDonationsByCampaign/:id', getDonationsByCampaign); //dashboard
router.delete('/deleteUser/:id', isAuthenticated,  deleteUser); // Delete user by ID


export default router;


