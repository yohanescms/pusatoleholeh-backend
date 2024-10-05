import express from 'express';
import { createShop } from '../controllers/shop.js';
import { ruteAman, gwejhSelller } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', ruteAman, gwejhSelller, createShop);

export default router;
