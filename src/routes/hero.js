import express from 'express';
import { uploadHeroBanner, updateHeroBanner, deleteHeroBanner } from '../controllers/hero.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';

const router = express.Router();

// admin routes

router.post('/add', safeRoute, verifyRole('admin'), upload.single('banner'), uploadHeroBanner);
router.put('/update/:heroBannerId', safeRoute, verifyRole('admin'), upload.single('banner'), updateHeroBanner);
router.delete('/delete/:heroBannerId', safeRoute, verifyRole('admin'), upload.single('banner'), deleteHeroBanner);

export default router;
