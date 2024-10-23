import Shop from '../models/shop.js';
import ShopImage from '../models/shopImage.js';
import ShopBanner from '../models/shopBanner.js';
import Address from '../models/address.js'
import { validationResult } from 'express-validator';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { encodeFileName } from '../configs/crypto.js';
import { uploadPathCheck } from '../configs/fs.js';

export const createShop = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      addressId,
    } = req.body;
    const ownerId = req.user._id;
    const shopAddress = await Address.findOne({ _id: addressId, userId: ownerId });

    if (!shopAddress) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    const shop = new Shop({
      name,
      description,
      ownerId,
      address: {
        province: shopAddress.province,
        city: shopAddress.city,
        district: shopAddress.district,
        subdistrict: shopAddress.subdistrict,
        postalCode: shopAddress.postalCode,
      },
    });

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

  const ownerId = req.user._id;

  const {
    name,
    description,
    province,
    city,
    district,
    subdistrict,
    postalCode,
  } = req.body;

  try {
    const shop = await Shop.findOne({ ownerId });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.name = name || shop.name;
    shop.description = description || shop.description;
    shop.address.province = province || shop.address.province;
    shop.address.city = city || shop.address.city;
    shop.address.district = district || shop.address.district;
    shop.address.subdistrict = subdistrict || shop.address.subdistrict;
    shop.address.postalCode = postalCode || shop.address.postalCode;

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

  const ownerId = req.user._id;

  try {
    const shop = await Shop.findOne({ ownerId });

    const filename = encodeFileName(req.file.originalname, 'shop');
    const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const outputPath = path.join(uploadPath, filename);

    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    const shopImage = new ShopImage({
      name: req.file.originalname,
      path: outputPath,
      url: `${process.env.SHOP_UPLOAD_URL}/${filename}`,
      shopId: shop._id,
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

  const ownerId = req.user._id;

  try {
    const shop = await Shop.findOne({ ownerId });

    const filename = encodeFileName(req.file.originalname, 'banner');
    const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const outputPath = path.join(uploadPath, filename);

    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    const shopBanner = new ShopBanner({
      name: req.file.originalname,
      path: outputPath,
      url: `${process.env.SHOP_UPLOAD_URL}/${filename}`,
      shopId: shop._id,
    });
    await shopBanner.save();

    res
      .status(200)
      .json({ message: 'Banner uploaded successfully', shopBanner });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShopImage = async (req, res) => {

  const ownerId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {

    const shop = await Shop.findOne({ ownerId });
    const shopImage = await ShopImage.findOne({ shopId: shop._id });

    if (!shopImage)
      return res.status(404).json({ message: 'Shop image not found.' });

    if (fs.existsSync(shopImage.path)) {
      fs.unlinkSync(shopImage.path);
    }

    const filename = encodeFileName(req.file.originalname, 'shop');
    const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const outputPath = path.join(uploadPath, filename);

    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    shopImage.name = req.file.originalname;
    shopImage.path = outputPath;
    shopImage.url = `${process.env.SHOP_UPLOAD_URL}/${filename}`;
    await shopImage.save();

    res
      .status(200)
      .json({ message: 'Shop image updated successfully', shopImage });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateShopBanner = async (req, res) => {

  const ownerId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No banner uploaded' });
  }

  try {

    const shop = await Shop.findOne({ ownerId });
    const shopBanner = await ShopBanner.findOne({ shopId: shop._id });

    if (!shopBanner)
      return res.status(404).json({ message: 'Shop banner not found.' });

    if (fs.existsSync(shopBanner.path)) {
      fs.unlinkSync(shopBanner.path);
    }

    const filename = encodeFileName(req.file.originalname, 'banner');
    const uploadPath = path.join(process.env.SHOP_UPLOAD_PATH);
    uploadPathCheck(uploadPath);

    const outputPath = path.join(uploadPath, filename);

    await sharp(req.file.buffer).toFormat('webp').toFile(outputPath);

    shopBanner.name = req.file.originalname;
    shopBanner.path = outputPath;
    shopBanner.url = `${process.env.SHOP_UPLOAD_URL}/${filename}`;
    await shopBanner.save();

    res
      .status(200)
      .json({ message: 'Shop banner updated successfully', shopBanner });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteShopImage = async (req, res) => {
  
  const ownerId = req.user._id;

  try {

    const shop = await Shop.findOne({ ownerId });
    const shopImage = await ShopImage.findOne({ shopId: shop._id });

    if (!shopImage)
      return res.status(404).json({ message: 'Shop image not found.' });

    if (fs.existsSync(shopImage.path)) {
      fs.unlinkSync(shopImage.path);
    }

    await ShopImage.deleteOne({ _id: shopImage._id });

    res.status(200).json({ message: 'Shop image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteShopBanner = async (req, res) => {
  
  const ownerId = req.user._id;

  try {

    const shop = await Shop.findOne({ ownerId });
    const shopBanner = await ShopBanner.findOne({ shopId: shop._id });

    if (!shopBanner)
      return res.status(404).json({ message: 'Shop banner not found.' });

    if (fs.existsSync(shopBanner.path)) {
      fs.unlinkSync(shopBanner.path);
    }

    await ShopImage.deleteOne({ _id: shopBanner._id });

    res.status(200).json({ message: 'Shop banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({ message: 'Shops retrieved successfully', shops });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getShopById = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await Shop.findById(shopId).populate('ownerId', 'name');

    const shopImage = await ShopImage.find({ shopId: shop._id });
    const shopBanner = await ShopBanner.find({ shopId: shop._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res
      .status(200)
      .json({
        message: 'Shop found!',
        shop,
        image: shopImage,
        banner: shopBanner,
      });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};