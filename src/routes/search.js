import express from 'express';
import { globalSearch, searchProductsByShopId } from '../controllers/search.js';

const router = express.Router();

router.get('/', globalSearch);
router.get('/shop/:shopId', searchProductsByShopId);

export default router;