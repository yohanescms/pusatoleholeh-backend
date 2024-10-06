import Product from '../models/product.js';
import Shop from '../models/shop.js';
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Please upload an image'));
    }
    cb(null, true);
  },
}).array('images', 5);

export const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }    
    try {
      const { name, description, price, stock, category } = req.body;
      const shopId = req.params.shopId;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found.' });
      }
      if (shop.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own this shop.' });
      }

      const images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));

      const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        shopId,
        images,
      });

      const savedProduct = await newProduct.save();
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
      const { name, description, price, stock, category } = req.body;
      
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

      if (req.files && req.files.length > 0) {
        const images = req.files.map(file => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
        product.images.push(...images);
      }

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

export const setPrimaryImage = async (req, res) => {
  const { productId, imageIndex } = req.params;
  const product = await Product.findById(productId);

  if (product.shopId.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You do not own this product.' });
  }

  if (imageIndex < 0 || imageIndex >= product.images.length) {
    return res.status(400).json({ message: 'Invalid image index.' });
  }

  product.primaryImageIndex = imageIndex;
  await product.save();
  res.status(200).json({ message: 'Primary image updated successfully.' });
};

export const updateProductImage = async (req, res) => {
  const { productId, imageIndex } = req.params;
  const product = await Product.findById(productId);

  if (product.shopId.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You do not own this product.' });
  }

  product.images[imageIndex] = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };

  await product.save();
  res.status(200).json({ message: 'Image updated successfully.' });
};

export const deleteProductImage = async (req, res) => {
  const { productId, imageIndex } = req.params;
  const product = await Product.findById(productId);

  if (product.shopId.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You do not own this product.' });
  }

  product.images.splice(imageIndex, 1);
  await product.save();
  res.status(200).json({ message: 'Image deleted successfully.' });
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).lean();

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const primaryImage = product.images[product.primaryImageIndex];
    const otherImages = product.images.filter((_, index) => index !== product.primaryImageIndex);

    res.status(200).json({ ...product, images: [primaryImage, ...otherImages] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopId', 'name location');

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find().populate('shopId', 'name location');

    res.status(200).json({ products });
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
      }).populate('shopId', 'name location');

      if (!products.length) {
          return res.status(404).json({ message: 'No products found' });
      }

      res.status(200).json({ products });
  } catch (err) {
      console.error(err);
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
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

