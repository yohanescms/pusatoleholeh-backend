import express from 'express';
import { createShop, updateShop, uploadShopImage, uploadShopBanner, updateShopImage, updateShopBanner, deleteShopImage, deleteShopBanner, getAllShops, getShopById, getShopInfo, getShopByName } from '../controllers/shop.js';
import { safeRoute, verifyRole, checkShop } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';
import { validateShopCreation, validateShopUpdate } from '../configs/validate.js';

const router = express.Router();

// SELLER ROUTES

router.post('/create', safeRoute, verifyRole('seller'), validateShopCreation, createShop);
router.put('/update', safeRoute, verifyRole('seller'), checkShop, validateShopUpdate, updateShop);

router.post('/logo', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), uploadShopImage);
router.post('/banner', safeRoute, verifyRole('seller'), checkShop, upload.single('banner'), uploadShopBanner);

router.put('/logo', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), updateShopImage);
router.put('/banner', safeRoute, verifyRole('seller'), checkShop, upload.single('banner'), updateShopBanner);

router.delete('/logo', safeRoute, verifyRole('seller'), checkShop, deleteShopImage);
router.delete('/banner', safeRoute, verifyRole('seller'), checkShop, deleteShopBanner);

router.get('/', safeRoute, verifyRole('seller'), checkShop, getShopInfo);

// BUYER ROUTES

router.get('/all', getAllShops);
router.get('/:shopId', getShopById);
router.get('/name/:shopName', getShopByName);

export default router;
