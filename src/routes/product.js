import express from 'express';
import { 
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateProductImage,
    deleteProductImage,
    setPrimaryImage,
} from '../controllers/product.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/:shopId', safeRoute, verifyRole('seller'), addProduct);
router.put('/:productId', safeRoute, verifyRole('seller'), updateProduct);
router.delete('/:productId', safeRoute, verifyRole('seller'), deleteProduct);

router.put('/:productId/images/:imageIndex', safeRoute, verifyRole('seller'), updateProductImage);
router.delete('/:productId/images/:imageIndex', safeRoute, verifyRole('seller'), deleteProductImage);
router.put('/:productId/images/:imageIndex/star', safeRoute, verifyRole('seller'), setPrimaryImage);

export default router;