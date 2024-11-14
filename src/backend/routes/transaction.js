import express from 'express';

const router = express.Router();

import {createDonationAndPayout , updatePaymentStatus} from '../controllers/donationControllers.js'
import { isAuthenticated } from '../middleware/backend/isAuth.js';

router.post('/create',isAuthenticated, createDonationAndPayout);
router.post('/capture',isAuthenticated, updatePaymentStatus);

export default router;