import Product from '../models/product.js';
import ProductImage from '../models/productImage.js';
import Shop from '../models/shop.js';
import upload from '../configs/multer.js';
import { saveAsWebp } from '../configs/sharp.js';
import fs from 'fs';

export const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { name, description, price, stock, category, primaryImageIndex } = req.body;
      const shopId = req.params.shopId;

      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: 'Shop not found.' });
      if (shop.ownerId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Unauthorized: You do not own this shop.' });

      const newProduct = new Product({ name, description, price, stock, category, shopId });
      const savedProduct = await newProduct.save();

      const uploadPath = './images/products';
      let primaryImageURL = null;

      if (req.files) {
        const imageUploads = req.files.map(async (file, index) => {
          const { filename, path: filePath, url } = await saveAsWebp(file, uploadPath);
          const newImage = new ProductImage({
            name: filename,
            path: filePath,
            url: `${req.protocol}://${req.get('host')}/images/products/${filename}`,
            productId: savedProduct._id,
          });
          const savedImage = await newImage.save();

          if (index === parseInt(primaryImageIndex)) primaryImageURL = savedImage.url;
          else if (!primaryImageURL) primaryImageURL = savedImage.url;
        });

        await Promise.all(imageUploads);
        savedProduct.primaryImage = primaryImageURL;
        await savedProduct.save();
      }

      res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error adding product', error: error.message });
    }
  });
};

export const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { productId } = req.params;
      const { name, description, price, stock, category, primaryImageIndex } = req.body;

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found.' });

      const shop = await Shop.findById(product.shopId);
      if (shop.ownerId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Unauthorized: You do not own this product.' });

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category;

      const uploadPath = './images/products';
      let primaryImageURL = product.primaryImage;

      if (req.files && req.files.length > 0) {
        const existingImages = await ProductImage.find({ productId: product._id });
        for (const image of existingImages) {
          fs.unlinkSync(image.path);
          await ProductImage.findByIdAndDelete(image._id);
        }

        const imageUploads = req.files.map(async (file, index) => {
          const { filename, path: filePath, url } = await saveAsWebp(file, uploadPath);
          const newImage = new ProductImage({
            name: filename,
            path: filePath,
            url: `${req.protocol}://${req.get('host')}/images/products/${filename}`,
            productId: product._id,
          });
          const savedImage = await newImage.save();

          if (index === parseInt(primaryImageIndex)) primaryImageURL = savedImage.url;
        });

        await Promise.all(imageUploads);
      }

      product.primaryImage = primaryImageURL;
      const updatedProduct = await product.save();

      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  });
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized: You do not own this product.' });

    const productImages = await ProductImage.find({ productId: product._id });
    for (const image of productImages) {
      fs.unlinkSync(image.path);
      await ProductImage.findByIdAndDelete(image._id);
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product and images deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const setPrimaryImage = async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized: You do not own this product.' });

    const image = await ProductImage.findById(imageId);
    if (!image) return res.status(404).json({ message: 'Image not found.' });
    if (image.productId.toString() !== productId)
      return res.status(400).json({ message: 'Image does not belong to this product.' });

    product.primaryImage = image.url;
    await product.save();

    res.status(200).json({ message: 'Primary image updated successfully.', product });
  } catch (error) {
    res.status(500).json({ message: 'Error setting primary image', error: error.message });
  }
};

export const updateProductImage = async (req, res) => {
  const { productId, imageIndex } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this product.' });
    }

    const ProductImage = await ProductImage.find({ productId: product._id });
    const imageToUpdate = ProductImage[imageIndex];

    if (!imageToUpdate) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    const uploadPath = './images/products';
    const { filename, path: filePath, url } = await saveAsWebp(req.file, uploadPath);

    imageToUpdate.name = filename;
    imageToUpdate.path = filePath;
    imageToUpdate.url = `${req.protocol}://${req.get('host')}/images/products/${filename}`;

    await imageToUpdate.save();

    if (imageToUpdate.url === product.primaryImage) {
      product.primaryImage = imageToUpdate.url;
    }

    await product.save();
    res.status(200).json({ message: 'Image updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating image', error: error.message });
  }
};

export const deleteProductImage = async (req, res) => {
  const { productId, imageIndex } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this product.' });
    }

    const ProductImage = await ProductImage.find({ productId: product._id });

    const imageToDelete = ProductImage[imageIndex];
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    await ProductImage.findByIdAndDelete(imageToDelete._id);

    if (imageToDelete.url === product.primaryImage) {
      if (ProductImage.length > 1) {
        const remainingImages = ProductImage.filter((_, idx) => idx !== imageIndex);
        product.primaryImage = remainingImages[0]?.url || null;
      } else {
        product.primaryImage = null;
      }
    }

    await product.save();
    res.status(200).json({ message: 'Image deleted successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};