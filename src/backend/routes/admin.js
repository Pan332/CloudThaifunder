import express from 'express';
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import { isValidatorOrAdmin } from '../middleware/backend/isValidatorOrAdmin.js';

import { verifyAdmin } from '../middleware/backend/isAdmin.js';
import { getAlluser, editUserInfo, deleteUser, getAllCampaign, hideCampaigns, PendingCampaigns, ValidateCampaigns, deleteCampaign } from '../controllers/adminControllers.js';

const router = express.Router();

router.get('/getAlluser', verifyAdmin, getAlluser);
router.put('/editInfo/:id', verifyAdmin, editUserInfo); // Edit user info by ID
router.delete('/deleteUser/:id', verifyAdmin,  deleteUser); // Delete user by ID
router.get('/getAllcampaigns', verifyAdmin, getAllCampaign);
router.put('/hideCampaigns/:id', verifyAdmin, hideCampaigns); // Edit user info by ID
router.get('/PendingCampaigns', isValidatorOrAdmin, PendingCampaigns);
router.put('/ValidateCampaigns/:id', isValidatorOrAdmin, ValidateCampaigns);
router.put('/deleteCampaign/:id', verifyAdmin,  deleteCampaign); // Delete user by ID


export default router;
