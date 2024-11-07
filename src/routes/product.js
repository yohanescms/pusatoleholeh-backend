import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  activateProduct,
  deactivateProduct,
  uploadProductImage,
  deleteProductImage,
  uploadProductCover,
  updateProductCover,
  deleteProductCover,
  getAllOwnedProducts,
  getProductById,
  getProductsByShopId,
} from "../controllers/product.js";
import { safeRoute, verifyRole, checkShop } from '../middlewares/middleware.js';
import { productTrack } from '../middlewares/tracker.js';
import { upload } from '../configs/multer.js';
import { validateProductCreation, validateProductUpdate } from '../configs/validate.js';

const router = express.Router();

//SELLER ROUTE

router.post('/create', safeRoute, verifyRole('seller'), checkShop, validateProductCreation, createProduct);
router.put('/update/:productId', safeRoute, verifyRole('seller'), checkShop, validateProductUpdate, updateProduct);
router.delete('/delete/:productId', safeRoute, verifyRole('seller'), checkShop, deleteProduct);

router.put('/activate/:productId', safeRoute, verifyRole('seller'), checkShop, activateProduct);
router.put('/deactivate/:productId', safeRoute, verifyRole('seller'), checkShop, deactivateProduct);

router.post('/upload/image/:productId', safeRoute, verifyRole('seller'), checkShop, upload.array('image', 5), uploadProductImage);
router.delete('/delete/image/:productId/:productImageId', safeRoute, verifyRole('seller'), checkShop, deleteProductImage);

router.post('/upload/cover/:productId', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), uploadProductCover);
router.put('/update/cover/:productId', safeRoute, verifyRole('seller'), checkShop, upload.single('image'), updateProductCover);
router.delete('/delete/cover/:productId', safeRoute, verifyRole('seller'), checkShop, deleteProductCover);

router.get('/list', safeRoute, verifyRole('seller'), checkShop, getAllOwnedProducts);

//BUYER ROUTE

router.get('/:productId', productTrack, getProductById);

router.get('/shop/:shopId', getProductsByShopId);

export default router;