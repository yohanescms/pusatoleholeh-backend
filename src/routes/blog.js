import express from 'express';
import { 
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blog.js';

import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

// Admin-only routes
router.post('/', safeRoute, verifyRole('admin'), createBlog); // Tambah blog
router.put('/:id', safeRoute, verifyRole('admin'), updateBlog); // Edit blog
router.delete('/:id', safeRoute, verifyRole('admin'), deleteBlog); // Hapus blog

// Public routes
router.get('/', getAllBlogs); // Lihat semua blog
router.get('/:id', getBlogById); // Lihat detail blog berdasarkan ID

export default router;
