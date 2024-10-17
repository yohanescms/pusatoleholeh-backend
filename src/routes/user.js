import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.js';
import { safeRoute } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/', safeRoute, getUserProfile);
router.put('/', safeRoute, updateUserProfile);

export default router;
