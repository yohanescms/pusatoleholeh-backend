import express from 'express';
import { addCategory, updateCategory, deleteCategory, getCategory, getProductsByCategory,uploadCategoryImage } from '../controllers/category.js';
import { validateCategoryId, validateAddCategory, validateUpdateCategory } from '../configs/validate.js';
import { safeRoute, verifyRole, checkShop } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js'; // Tambahkan import ini



const router = express.Router();

// admin routes

router.post('/add', validateAddCategory, safeRoute, verifyRole('admin'), addCategory);
router.put('/update/:categoryId', validateUpdateCategory, safeRoute, verifyRole('admin'), updateCategory);
router.delete('/delete/:categoryId', validateCategoryId, safeRoute, verifyRole('admin'), deleteCategory);

// user routes

router.get('/', getCategory);
router.get('/:categoryId', getProductsByCategory);
router.post('/upload/:categoryId',validateCategoryId,safeRoute,verifyRole('admin'),upload.single('image'),uploadCategoryImage);
export default router;
