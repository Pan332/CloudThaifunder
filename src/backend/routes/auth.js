import express from 'express';
<<<<<<< HEAD
import { login ,register,jwtValidate ,isAuthenticated} from '../controllers/authControllers.js'
import { createCampaign } from '../controllers/campaignControllers.js';
=======
import { login ,register,jwtValidate} from '../controllers/authControllers.js'

>>>>>>> 6d9184a65caaaa431edcf6efd8a9567c59aa4a50
const router = express.Router();

router.post('/login', login)
router.post('/signup',register)
router.get('/validate-token', jwtValidate, (req, res) => {
    res.sendStatus(200);
});
export default router;