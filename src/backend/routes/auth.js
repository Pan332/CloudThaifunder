import express from 'express';

import { login ,register,jwtValidate,refreshToken} from '../controllers/authControllers.js'
import { createCampaign } from '../controllers/campaignControllers.js';



const router = express.Router();

router.post('/login', login);
router.post('/signup',register);
router.get('/validate-token', jwtValidate, (req, res) => {
    res.sendStatus(200);
});
router.post('/refresh-token', refreshToken);
router.get('/validate', (req, res, next) => { 
    jwtValidate(req, res, next);
}, (req, res) => {
    res.json({ success: true, user_id: req.user.user_id });
});

export default router;