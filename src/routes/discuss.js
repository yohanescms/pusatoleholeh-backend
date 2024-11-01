import express from 'express';
import { addDiscuss, updateDiscuss, deleteDiscuss, getDiscussionByProduct } from '../controllers/discuss.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/add/:productId', safeRoute, addDiscuss);
router.put('/update/:discussId', safeRoute, updateDiscuss);
router.put('/delete/:discussId', safeRoute, deleteDiscuss);
router.get('/:productId', safeRoute, getDiscussionByProduct);

export default router;