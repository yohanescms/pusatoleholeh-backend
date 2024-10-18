import express from 'express';
import { createShop, updateShop, uploadShopImage, uploadShopBanner, updateShopImage, updateShopBanner, deleteShopImage, deleteShopBanner } from '../controllers/shop.js';
import { safeRoute, verifyRole, checkShopOwner } from '../middlewares/middleware.js';
import upload from '../configs/multer.js';
import { validateShopCreation, validateShopUpdate } from '../configs/validate.js';

const router = express.Router();

router.post('/create', safeRoute, verifyRole('seller'), validateShopCreation, createShop);
router.put('/update', safeRoute, verifyRole('seller'),checkShopOwner, validateShopUpdate, updateShop);

router.post('/upload/logo', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('image'), uploadShopImage);
router.post('/upload/banner', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('banner'), uploadShopBanner);

router.put('/update/logo', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('image'), updateShopImage);
router.put('/update/banner', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('banner'), updateShopBanner);

router.delete('/delete/logo', safeRoute, verifyRole('seller'), checkShopOwner, deleteShopImage);
router.delete('/delete/banner', safeRoute, verifyRole('seller'), checkShopOwner, deleteShopBanner);

export default router;
