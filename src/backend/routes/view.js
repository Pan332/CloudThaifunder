import express from 'express';
import { getUserInfo, updateUserInfo } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo);
router.put('/update-user-info', updateUserInfo);


export default router;


