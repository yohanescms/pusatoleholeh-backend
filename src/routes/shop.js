import express from 'express';
import { createShop, updateShop, uploadShopImage, uploadShopBanner, updateShopImage, updateShopBanner, deleteShopImage, deleteShopBanner, getAllShops, getShopById, getShopInfo } from '../controllers/shop.js';
import { safeRoute, verifyRole, checkShop } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';
import { validateShopCreation, validateShopUpdate } from '../configs/validate.js';

const router = express.Router();

// SELLER ROUTES

router.post('/create', safeRoute, verifyRole('seller'), validateShopCreation, createShop);
router.put('/update', safeRoute, verifyRole('seller'), checkShop, validateShopUpdate, updateShop);

router.post('/upload/logo', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), uploadShopImage);
router.post('/upload/banner', safeRoute, verifyRole('seller'), checkShop, upload.single('banner'), uploadShopBanner);

router.put('/update/logo', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), updateShopImage);
router.put('/update/banner', safeRoute, verifyRole('seller'), checkShop, upload.single('banner'), updateShopBanner);

router.delete('/delete/logo', safeRoute, verifyRole('seller'), checkShop, deleteShopImage);
router.delete('/delete/banner', safeRoute, verifyRole('seller'), checkShop, deleteShopBanner);

router.get('/getdata', safeRoute, verifyRole('seller'), checkShop, getShopInfo);

// BUYER ROUTES

router.get('/', getAllShops);
router.get('/:shopId', getShopById);


export default router;
