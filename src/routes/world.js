import express from 'express';
import {  getShopByName } from '../controllers/shop.js';

const router = express.Router();

router.get('/:shopName', getShopByName);

export default router;
