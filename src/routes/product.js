import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  uploadProductCover,
  updateProductCover,
  deleteProductCover,
} from '../controllers/product.js';
import { safeRoute, verifyRole, checkShopOwner } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';
import { validateProductCreation, validateProductUpdate } from '../configs/validate.js';

const router = express.Router();

router.post('/create', safeRoute, verifyRole('seller'), checkShopOwner, validateProductCreation, createProduct);
router.put('/update/:productId', safeRoute, verifyRole('seller'), checkShopOwner, validateProductUpdate, updateProduct);

router.delete('/delete/:productId', safeRoute, verifyRole('seller'), checkShopOwner, deleteProduct);

router.post('/upload/image/:productId', safeRoute, verifyRole('seller'), checkShopOwner, upload.array('images', 5), uploadProductImage);
router.delete('/delete/image/:productId', safeRoute, verifyRole('seller'), checkShopOwner, deleteProductImage);

router.post('/upload/cover/:productId', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('cover'), uploadProductCover);
router.put('/update/cover/:productId', safeRoute, verifyRole('seller'), checkShopOwner, upload.single('cover'), updateProductCover);
router.delete('/delete/cover/:productId', safeRoute, verifyRole('seller'), checkShopOwner, deleteProductCover);

export default router;
