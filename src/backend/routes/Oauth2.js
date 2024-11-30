import express from 'express';
import { GoogleAuth,GoogleCallback } from '../controllers/Oauth2Controller.js';

const router = express.Router(); // Define an Express router

router.post('/google/request', GoogleAuth);
router.get('/google/callback',GoogleCallback)


export default router;