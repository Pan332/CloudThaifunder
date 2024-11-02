import express from 'express';
import { getUserInfo, updateUserInfo } from '../controllers/viewControllers.js';

const router = express.Router();

router.get('/user-info', getUserInfo);
router.put('/update-user-info', updateUserInfo);

<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 6d9184a65caaaa431edcf6efd8a9567c59aa4a50
