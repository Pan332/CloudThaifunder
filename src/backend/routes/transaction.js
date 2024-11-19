import express from 'express';
import { promptpay } from '../controllers/promptpayControllers.js';
import { isAuthenticated } from '../middleware/backend/isAuth.js';
import { donationInsert } from '../controllers/donationControllers.js';
import { insertPayment } from '../controllers/paymentControllers.js';

const router = express.Router();

router.post('/generateQR/:campaign_id', isAuthenticated, promptpay);
router.post('/donation/:campaign_id', isAuthenticated, donationInsert);
router.post('/payment/:campaign_id', isAuthenticated, insertPayment)

export default router;