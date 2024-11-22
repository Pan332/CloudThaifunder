import express from 'express';
import {addComment, getComments ,deleteComment, editComment, replyComment} from '../controllers/commentControllers.js'; // Adjust import based on your directory structure
import { isAuthenticated } from '../middleware/backend/isAuth.js';
const router = express.Router();


router.post('/AddComment',isAuthenticated, addComment);
router.get('/GetComment/:commentId', getComments);
router.delete('/DeleteComment/:commentId',isAuthenticated,deleteComment)
router.patch('/EditComment/:commentId',isAuthenticated,editComment)
router.post('/replyComment',isAuthenticated, replyComment);

export default router;