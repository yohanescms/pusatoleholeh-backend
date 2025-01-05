import express from 'express';
import { 
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
  uploadBlogImages
} from '../controllers/blog.js';

import { upload } from '../configs/multer.js';

import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

// Admin-only routes
router.post('/', safeRoute, verifyRole('admin'), createBlog); // Tambah blog
router.put('/:id', safeRoute, verifyRole('admin'), updateBlog); // Edit blog
router.delete('/:id', safeRoute, verifyRole('admin'), deleteBlog); // Hapus blog
// Public routes
router.get('/', getAllBlogs); // Lihat semua blog
router.get('/:id', getBlogById); // Lihat detail blog berdasarkan ID

router.post('/upload/cover/:blogId', upload.single('image'), uploadBlogCover);
router.post('/upload/images/:blogId', upload.array('image', 5), uploadBlogImages);

export default router;

