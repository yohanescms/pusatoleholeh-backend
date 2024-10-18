import express from 'express';
import { createShop, updateShop, uploadShopImage, uploadShopBanner, updateShopImage, updateShopBanner, deleteShopImage, deleteShopBanner, getAllShops, getShopById } from '../controllers/shop.js';
import { safeRoute, verifyRole, checkShopOwner } from '../middlewares/middleware.js';
import upload from '../configs/multer.js';
import { validateShopCreation, validateShopUpdate } from '../configs/validate.js';

const router = express.Router();

router.post('/create', safeRoute, verifyRole('seller'), validateShopCreation, createShop);
router.put('/update/:shopId', safeRoute, verifyRole('seller'),checkShopOwner, validateShopUpdate, updateShop);

router.post('/upload/:shopId/logo', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('image'), uploadShopImage);
router.post('/upload/:shopId/banner', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('banner'), uploadShopBanner);

router.put('/update/:shopId/:shopImageId', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('image'), updateShopImage);
router.put('/update/:shopId/:shopBannerId', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('banner'), updateShopBanner);

router.delete('/delete/:shopId/:shopImageId', safeRoute, verifyRole('seller'), checkShopOwner, deleteShopImage);
router.delete('/delete/:shopId/:shopBannerId', safeRoute, verifyRole('seller'), checkShopOwner, deleteShopBanner);

// DEBUG

router.get('/', getAllShops);
router.get('/:shopId', getShopById);


export default router;
