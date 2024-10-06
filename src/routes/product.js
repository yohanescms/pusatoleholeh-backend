import express from 'express';
import { addProduct, updateProduct, deleteProduct, getAllProducts, getProductsByShop, updateProductImage, deleteProductImage, setPrimaryImage, searchProducts, searchProductsInShop } from '../controllers/product.js';
import { ruteAman, verifyRole } from '../middlewares/auth.js';

const router = express.Router();

router.post('/:shopId', ruteAman, verifyRole('seller'), addProduct);
router.put('/:productId', ruteAman, verifyRole('seller'), updateProduct);
router.delete('/:productId', ruteAman, verifyRole('seller'), deleteProduct);


router.put('/:productId/star/:imageIndex', ruteAman, verifyRole('seller'), setPrimaryImage);

router.put('/:productId/images/:imageIndex', ruteAman, verifyRole('seller'), updateProductImage);
router.delete('/:productId/images/:imageIndex', ruteAman, verifyRole('seller'), deleteProductImage);

router.get('/', getAllProducts);

router.get('/:shopId', getProductsByShop);

router.get('/search', searchProducts);
router.get('/:shopId/search', searchProductsInShop);

export default router;