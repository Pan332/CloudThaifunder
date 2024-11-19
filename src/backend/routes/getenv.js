import express from 'express';
import { getenvCookie,getenvLink,getenvToken,getenvAll } from '../middleware/frontend/getenv.js';
const router = express.Router();

router.get('/Cookie', getenvCookie);
router.get('/Link', getenvLink);
router.get('/Token', getenvToken);
router.get('/All',getenvAll)

export default router;