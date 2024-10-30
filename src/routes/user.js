import express from 'express';
import { updateUser, updateUserImage, uploadUserImage, deleteUserImage, getUser, getUserById, addAddress, updateAddress, deleteAddress, getAddress } from '../controllers/user.js';
import { safeRoute, checkUserOrigin } from '../middlewares/middleware.js';
import { upload } from '../configs/multer.js';
import { validateUserUpdate } from '../configs/validate.js';

const router = express.Router();

router.put('/update', safeRoute, validateUserUpdate, checkUserOrigin, updateUser);

router.post('/image', safeRoute, upload.single('image'), checkUserOrigin, uploadUserImage);
router.put('/image', safeRoute, upload.single('image'), checkUserOrigin, updateUserImage);
router.delete('/image', safeRoute, checkUserOrigin, deleteUserImage);

router.get('/address', safeRoute, checkUserOrigin, getAddress);
router.post('/address', safeRoute, checkUserOrigin, addAddress);
router.put('/address/:addressId', safeRoute, checkUserOrigin, updateAddress);
router.delete('/address/:addressId', safeRoute, checkUserOrigin, deleteAddress);

router.get('/', safeRoute, getUser);
router.get('/:userId', safeRoute, getUserById);

export default router;
