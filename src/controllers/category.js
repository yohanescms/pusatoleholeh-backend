import Category from '../models/category.js';
import Product from '../models/product.js';
import ProductImage from '../models/productImage.js';
import ProductCover from '../models/productCover.js';
import { validationResult } from 'express-validator';

export const addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ message: 'Categories retrieved successfully', categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ categoryId, isActive: true })
      .populate({
        path: 'categoryId',
        select: 'name description',
      })
      .populate({
        path: 'shopId',
        select: 'name address',
      })
      .lean();

    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const productCover = await ProductCover.findOne({ productId: product._id }).select('url');

        return {
          ...product,
          productCover: productCover ? productCover.url : null,
        };
      })
    );

    res.status(200).json({
      message: 'Products retrieved successfully',
      category: { name: category.name, description: category.description },
      products: productsWithImages,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const uploadCategoryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const uploadPath = path.join(process.env.CATEGORY_UPLOAD_PATH);
    uploadPathCheck(uploadPath); // Pastikan path upload tersedia

    const filename = encodeFileName(req.file.originalname, 'category');
    const outputPath = path.join(uploadPath, filename);

    // Konversi ke format WebP
    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    // Normalisasi URL gambar
    const normalizedBaseUrl = normalizeBaseUrl(process.env.CDN_BASE_URL);
    const normalizedUploadPath = normalizePath(uploadPath);

    const imageUrl = `${normalizedBaseUrl}/${normalizedUploadPath}/${filename}`;

    // Update URL gambar pada kategori
    category.imageUrl = imageUrl;
    await category.save();

    res.status(200).json({
      message: 'Category image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};