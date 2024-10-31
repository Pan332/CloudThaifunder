import express from 'express';
import { verifyAdmin } from '../middleware/backend/isAdmin.js';
import { addBadge,deleteBadge,fetchBadges,updateBadge } from '../controllers/badgeControllers.js';

const router = express.Router();

router.get('/',verifyAdmin,fetchBadges)
router.post('/addbadge', verifyAdmin, addBadge);
router.delete('/:badgeId', verifyAdmin, deleteBadge);
router.put('/:badgeId', verifyAdmin, updateBadge);

export default router;