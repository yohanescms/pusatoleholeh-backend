import Shop from '../models/shop.js';
import ShopImage from '../models/shopImage.js';
import ShopBanner from '../models/shopBanner.js';
import { validationResult } from 'express-validator';
import sharp from 'sharp';
import path from 'path';
import encodeFileName from '../configs/crypto.js';
import ensureUploadPathExists from '../configs/fs.js'

export const createShop = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
      const { name, description, location } = req.body;
      const ownerId = req.user._id;

      const shop = new Shop({ name, description, location, ownerId });
      await shop.save();

      res.status(201).json({ message: 'Shop created successfully', shop });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShop = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { shopId } = req.body;
  const { name, description, location } = req.body;

  try {
      const shop = await Shop.findById(shopId);

      if (!shop) {
          return res.status(404).json({ message: 'Shop not found' });
      }

      shop.name = name || shop.name;
      shop.description = description || shop.description;
      shop.location = location || shop.location;
      await shop.save();

      res.status(200).json({ message: 'Shop updated successfully', shop });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const uploadShopImage = async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
  }

  const { shopId } = req.body;
  
  try {
      const shop = await Shop.findById(shopId);

      const filename = encodeFileName(req.file.originalname, 'shop');
      const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
      ensureUploadPathExists(uploadPath);

      const outputPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
          .toFormat('webp')
          .toFile(outputPath);

      const shopImage = new ShopImage({
          name: req.file.originalname,
          path: outputPath,
          url: `${process.env.SHOP_UPLOAD_URL}/${filename}`,
          shopId
      });
      await shopImage.save();

      res.status(200).json({ message: 'Image uploaded successfully', shopImage });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const uploadShopBanner = async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: 'No banner uploaded' });
  }

  const { shopId } = req.body;

  try {
      const shop = await Shop.findById(shopId);

      const filename = encodeFileName(req.file.originalname, 'banner');
      const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
      ensureUploadPathExists(uploadPath);

      const outputPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
          .toFormat('webp')
          .toFile(outputPath);

      const shopBanner = new ShopBanner({
          name: req.file.originalname,
          path: outputPath,
          url: `${process.env.SHOP_UPLOAD_URL}/${filename}`,
          shopId
      });
      await shopBanner.save();

      res.status(200).json({ message: 'Banner uploaded successfully', shopBanner });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShopImage = async (req, res) => {
  const { shopImageId, shopId } = req.body;
  if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
      const shop = await Shop.findById(shopId);

      const shopImage = await ShopImage.findById(shopImageId);
      if (!shopImage) return res.status(404).json({ message: 'Shop image not found.' });

      if (fs.existsSync(shopImage.path)) {
          fs.unlinkSync(shopImage.path);
      }

      const filename = encodeFileName(req.file.originalname, 'shop');
      const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
      ensureUploadPathExists(uploadPath);

      const outputPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
          .toFormat('webp')
          .toFile(outputPath);

      shopImage.name = req.file.originalname;
      shopImage.path = outputPath;
      shopImage.url = `${process.env.SHOP_UPLOAD_URL}/${filename}`;
      await shopImage.save();

      res.status(200).json({ message: 'Shop image updated successfully', shopImage });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShopBanner = async (req, res) => {
  const { shopBannerId, shopId } = req.body;
  if (!req.file) {
      return res.status(400).json({ message: 'No banner uploaded' });
  }

  try {
      const shop = await Shop.findById(shopId);

      const shopBanner = await ShopBanner.findById(shopBannerId);
      if (!shopBanner) return res.status(404).json({ message: 'Shop banner not found.' });

      if (fs.existsSync(shopBanner.path)) {
          fs.unlinkSync(shopBanner.path);
      }

      const filename = encodeFileName(req.file.originalname, 'banner');
      const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
      ensureUploadPathExists(uploadPath);

      const outputPath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
          .toFormat('webp')
          .toFile(outputPath);

      shopBanner.name = req.file.originalname;
      shopBanner.path = outputPath;
      shopBanner.url = `${process.env.SHOP_UPLOAD_URL}/${filename}`;
      await shopBanner.save();

      res.status(200).json({ message: 'Shop banner updated successfully', shopBanner });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteShopImage = async (req, res) => {
  const { shopImageId, shopId } = req.body;

  try {
      const shop = await Shop.findById(shopId);

      const shopImage = await ShopImage.findById(shopImageId);
      if (!shopImage) return res.status(404).json({ message: 'Shop image not found.' });

      if (fs.existsSync(shopImage.path)) {
          fs.unlinkSync(shopImage.path);
      }

      await shopImage.remove();
      res.status(200).json({ message: 'Shop image deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteShopBanner = async (req, res) => {
  const { shopBannerId, shopId } = req.body;

  try {
      const shop = await Shop.findById(shopId);

      const shopBanner = await ShopBanner.findById(shopBannerId);
      if (!shopBanner) return res.status(404).json({ message: 'Shop banner not found.' });

      if (fs.existsSync(shopBanner.path)) {
          fs.unlinkSync(shopBanner.path);
      }

      await shopBanner.remove();
      res.status(200).json({ message: 'Shop banner deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};