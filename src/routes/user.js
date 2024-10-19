import express from 'express';
import { updateUser, updateUserImage, uploadUserImage, getUser, getUserById, addAddress, updateAddress, deleteAddress } from '../controllers/user.js';
import { safeRoute, checkUserOrigin } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';
import { validateUserUpdate } from '../configs/validate.js';

const router = express.Router();

router.put('/update', safeRoute, validateUserUpdate, checkUserOrigin, updateUser);

router.post('/image', safeRoute, upload.single('image'), checkUserOrigin, uploadUserImage);
router.put('/image', upload.single('image'), checkUserOrigin, safeRoute, updateUserImage);

router.get('/', safeRoute, getUser);
router.get('/:userId', safeRoute, getUserById);

router.post('/address', safeRoute, checkUserOrigin, addAddress);
router.put('/address/:addressId', safeRoute, checkUserOrigin, updateAddress);
router.delete('/address/:addressId', safeRoute, checkUserOrigin, deleteAddress);

export default router;
