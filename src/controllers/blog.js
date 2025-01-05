import Blog from '../models/blog.js';
import path from 'path';
import sharp from 'sharp';
import { encodeFileName } from '../configs/crypto.js';
import { uploadPathCheck } from '../configs/fs.js';
import { normalizePath, normalizeBaseUrl } from '../configs/normalize.js';
import fs from 'fs';

export const createBlog = async (req, res) => {
  // Implementasi untuk membuat blog baru
};

export const getAllBlogs = async (req, res) => {
  // Implementasi untuk mendapatkan semua blog
};

export const getBlogById = async (req, res) => {
  // Implementasi untuk mendapatkan blog berdasarkan ID
};

export const updateBlog = async (req, res) => {
  // Implementasi untuk memperbarui blog
};

export const deleteBlog = async (req, res) => {
  // Implementasi untuk menghapus blog
};

export const uploadBlogCover = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No cover image uploaded' });
  }

  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const uploadPath = path.join(process.env.BLOG_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const filename = encodeFileName(req.file.originalname, 'cover');
    const outputPath = path.join(uploadPath, filename);

    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    const normalizedBaseUrl = normalizeBaseUrl(process.env.CDN_BASE_URL);
    const normalizedUploadPath = normalizePath(uploadPath);

    blog.coverImage = `${normalizedBaseUrl}/${normalizedUploadPath}/${filename}`;
    await blog.save();

    res.status(200).json({
      message: 'Blog cover uploaded successfully',
      coverImage: blog.coverImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadBlogImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const uploadPath = path.join(process.env.BLOG_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const uploadedImages = [];

    for (const file of req.files) {
      const filename = encodeFileName(file.originalname, 'additional');
      const outputPath = path.join(uploadPath, filename);

      await sharp(file.buffer).toFormat('webp').toFile(outputPath);

      const normalizedBaseUrl = normalizeBaseUrl(process.env.CDN_BASE_URL);
      const normalizedUploadPath = normalizePath(uploadPath);

      const imageUrl = `${normalizedBaseUrl}/${normalizedUploadPath}/${filename}`;
      uploadedImages.push(imageUrl);
    }

    blog.additionalImages.push(...uploadedImages);
    await blog.save();

    res.status(200).json({
      message: 'Blog images uploaded successfully',
      uploadedImages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
  uploadBlogImages, // Pastikan fungsi ini hanya sekali diekspor
};
