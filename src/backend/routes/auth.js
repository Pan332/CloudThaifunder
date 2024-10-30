import express from 'express';
import { login ,register,jwtValidate} from '../controllers/authControllers.js'
import { createCampaign } from '../controllers/campaignControllers.js';
import { isAuthenticated } from '../middleware/isAuth.js'
const router = express.Router();

router.post('/login', login)
router.post('/signup',register)
router.get('/validate-token', jwtValidate, (req, res) => {
    res.sendStatus(200);
});
router.post('/campaign/createcampaign', isAuthenticated, createCampaign);
export default router;