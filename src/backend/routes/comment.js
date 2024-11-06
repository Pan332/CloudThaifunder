import express from 'express';
import {addComment, getComments  } from '../controllers/commentControllers.js'; // Adjust import based on your directory structure
import { isAuthenticated } from '../middleware/backend/isAuth.js';
const router = express.Router();


router.post('/AddComment',isAuthenticated, addComment);
router.get('/GetComment/:campaign_id', getComments);


export default router;