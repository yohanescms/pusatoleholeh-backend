import express from 'express';
import { 
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateProductImage,
    deleteProductImage,
    setPrimaryImage,
    getProduct,
    getAllProducts,
    getProductsByShop,
    searchProducts,
    searchProductsInShop,
    getRandomProducts,
} from '../controllers/product.js';
import { ruteAman, verifyRole } from '../middlewares/auth.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/:shopId/search', searchProductsInShop);

router.get('/:productId', getProduct);

router.get('/', getAllProducts);

router.get('/:shopId', getProductsByShop);

router.post('/:shopId', ruteAman, verifyRole('seller'), addProduct);
router.put('/:productId', ruteAman, verifyRole('seller'), updateProduct);
router.delete('/:productId', ruteAman, verifyRole('seller'), deleteProduct);

router.put('/:productId/images/:imageIndex', ruteAman, verifyRole('seller'), updateProductImage);
router.delete('/:productId/images/:imageIndex', ruteAman, verifyRole('seller'), deleteProductImage);
router.put('/:productId/images/:imageIndex/star', ruteAman, verifyRole('seller'), setPrimaryImage);

router.get('/random/:count', getRandomProducts);

export default router;