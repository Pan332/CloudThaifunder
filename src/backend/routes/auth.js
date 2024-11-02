import express from 'express';

import { login ,register,jwtValidate} from '../controllers/authControllers.js'
import { createCampaign } from '../controllers/campaignControllers.js';



const router = express.Router();

router.post('/login', login)
router.post('/signup',register)
router.get('/validate-token', jwtValidate, (req, res) => {
    res.sendStatus(200);
});
export default router;