import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.js';
import { ruteAman } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', ruteAman, getUserProfile);
router.put('/', ruteAman, updateUserProfile);

export default router;
