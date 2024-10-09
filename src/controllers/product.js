import Product from '../models/product.js';
import ProductImages from '../models/productImage.js';
import Shop from '../models/shop.js';
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Please upload an image'));
    }
    cb(null, true);
  },
}).array('images', 5);

const saveAsWebp = async (file, uploadPath) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const webpFilename = `${uniqueSuffix}.webp`;
  const webpFilePath = path.join(uploadPath, webpFilename);

  fs.mkdirSync(uploadPath, { recursive: true });

  await sharp(file.buffer)
    .webp({ quality: 80 })
    .toFile(webpFilePath);

  return {
    filename: webpFilename,
    path: webpFilePath,
    url: `${uploadPath}/${webpFilename}`,
  };
};

export const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, description, price, stock, category, primaryImageIndex } = req.body;
      const shopId = req.params.shopId;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found.' });
      }
      if (shop.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own this shop.' });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        shopId,
      });

      const savedProduct = await newProduct.save();
      const uploadPath = './images/products';

      let primaryImageURL = null;

      if (req.files) {
        const imageUploads = req.files.map(async (file, index) => {
          const { filename, path: filePath, url } = await saveAsWebp(file, uploadPath);
          const newImage = new ProductImages({
            name: filename,
            path: filePath,
            url: `${req.protocol}://${req.get('host')}/images/products/${filename}`,
            productId: savedProduct._id,
          });

          const savedImage = await newImage.save();

          if (primaryImageIndex !== undefined && index === parseInt(primaryImageIndex)) {
            primaryImageURL = savedImage.url;
          } else if (!primaryImageURL) {
            primaryImageURL = savedImage.url; 
          }
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
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { productId } = req.params;
      const { name, description, price, stock, category, primaryImageIndex } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      const shop = await Shop.findById(product.shopId);
      if (shop.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own this product.' });
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category;

      const uploadPath = './images/products';

      let primaryImageURL = product.primaryImage;

      if (req.files && req.files.length > 0) {
        const imageUploads = req.files.map(async (file, index) => {
          const { filename, path: filePath, url } = await saveAsWebp(file, uploadPath);
          const newImage = new ProductImages({
            name: filename,
            path: filePath,
            url: `${req.protocol}://${req.get('host')}/images/products/${filename}`,
            productId: product._id,
          });

          const savedImage = await newImage.save();

          if (primaryImageIndex !== undefined && index === parseInt(primaryImageIndex)) {
            primaryImageURL = savedImage.url;
          }
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
    if (!product) {
      return res.status(404).json({ message: 'Product not found.'});
    }

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Can only delete in own shop'});
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted!'});
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
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

    const productImages = await ProductImages.find({ productId: product._id });
    const imageToUpdate = productImages[imageIndex];

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

    const productImages = await ProductImages.find({ productId: product._id });

    const imageToDelete = productImages[imageIndex];
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    await ProductImages.findByIdAndDelete(imageToDelete._id);

    if (imageToDelete.url === product.primaryImage) {
      if (productImages.length > 1) {
        const remainingImages = productImages.filter((_, idx) => idx !== imageIndex);
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

export const setPrimaryImage = async (req, res) => {
  const { productId, imageId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const shop = await Shop.findById(product.shopId);
    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this product.' });
    }

    const image = await ProductImages.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    if (image.productId.toString() !== productId) {
      return res.status(400).json({ message: 'Image does not belong to this product.' });
    }

    product.primaryImage = image.url;
    await product.save();

    res.status(200).json({ message: 'Primary image updated successfully.', product });
  } catch (error) {
    res.status(500).json({ message: 'Error setting primary image', error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const images = await ProductPictures.find({ productId: product._id });
    
    const primaryImage = images.find(image => image._id.toString() === product.primaryImage?.toString());
    const otherImages = images.filter(image => image._id.toString() !== product.primaryImage?.toString());

    res.status(200).json({ 
      ...product, 
      images: primaryImage ? [primaryImage, ...otherImages] : otherImages 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopId', 'name location').lean();

    const productsWithPrimaryImage = await Promise.all(products.map(async (product) => {
      const primaryImage = await ProductPictures.findOne({ _id: product.primaryImage });
      return { ...product, images: primaryImage ? [primaryImage] : [] };
    }));

    res.status(200).json({ products: productsWithPrimaryImage });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.params.shopId }).populate('shopId', 'name location').lean();

    const productsWithPrimaryImage = await Promise.all(products.map(async (product) => {
      const primaryImage = await ProductPictures.findOne({ _id: product.primaryImage });
      return { ...product, images: primaryImage ? [primaryImage] : [] };
    }));

    res.status(200).json({ products: productsWithPrimaryImage });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
export const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).populate('shopId', 'name location').lean();

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    const productsWithPrimaryImage = await Promise.all(products.map(async (product) => {
      const primaryImage = await ProductPictures.findOne({ _id: product.primaryImage });
      return { ...product, images: primaryImage ? [primaryImage] : [] };
    }));

    res.status(200).json({ products: productsWithPrimaryImage });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

export const searchProductsInShop = async (req, res) => {
  const { shopId } = req.params;
  const { query } = req.query;
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found.' });
    }

    const products = await Product.find({
      shopId: shopId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).lean();

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    const productsWithPrimaryImage = await Promise.all(products.map(async (product) => {
      const primaryImage = await ProductPictures.findOne({ _id: product.primaryImage });
      return { ...product, images: primaryImage ? [primaryImage] : [] };
    }));

    res.status(200).json({ products: productsWithPrimaryImage });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

export const getRandomProducts = async (req, res) => {
  try {
    const { count } = req.params;

    const products = await Product.aggregate([
      { $sample: { size: parseInt(count) } }
    ]);

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random products', error: error.message });
  }
};

