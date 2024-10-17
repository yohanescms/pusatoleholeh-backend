import express from 'express';
import { createShop } from '../controllers/shop.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/create', safeRoute, verifyRole('seller'), createShop);

export default router;
