import express from 'express';
import {
  getAllCouriers,
  getCourierById,
  createCourier,
  updateCourier,
  deleteCourier,
  toggleCourierStatus
} from '../controllers/courier.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/', safeRoute, getAllCouriers);
router.get('/:courierId', safeRoute, getCourierById);
router.post('/create', safeRoute, verifyRole('admin'), createCourier);
router.put('/update/:courierId', safeRoute, verifyRole('admin'), updateCourier);
router.delete('/delete/:courierId', safeRoute, verifyRole('admin'), deleteCourier);
router.patch('/toggle/:courierId', safeRoute, verifyRole('admin'), toggleCourierStatus);

export default router;
