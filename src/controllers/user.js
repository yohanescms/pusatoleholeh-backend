import User from '../models/user.js';
import UserPictures from '../models/userPictures.js';
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
}).single('profilePicture');

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

export const updateUserProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const userId = req.user._id;
      const { name, address, phoneNumber } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = name || user.name;
      user.address = address || user.address;
      user.phoneNumber = phoneNumber || user.phoneNumber;

      const uploadPath = './images/users';

      if (req.file) {
        const { filename, path: filePath, url } = await saveAsWebp(req.file, uploadPath);

        let userPicture = await UserPictures.findOne({ UserId: userId });

        if (userPicture) {
          userPicture.name = filename;
          userPicture.path = filePath;
          userPicture.url = `${req.protocol}://${req.get('host')}/images/users/${filename}`;
          await userPicture.save();
        } else {
          userPicture = new UserPictures({
            name: filename,
            path: filePath,
            url: `${req.protocol}://${req.get('host')}/images/users/${filename}`,
            UserId: userId,
          });
          await userPicture.save();
        }
      }

      const updatedUser = await user.save();
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  });
};

export const getUserProfile = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const user = await User.findById(userId).lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const profilePicture = await UserPictures.findOne({ UserId: userId });
  
      res.status(200).json({ 
        ...user, 
        profilePicture 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  };