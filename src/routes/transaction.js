import express from 'express';
import {
    createTransaction,
    payTransaction,
    processTransaction,
    getTransactionSeller,
    completeTransaction,
    getTransaction
  } from '../controllers/transaction.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

router.post('/', createTransaction);
router.put('/:transactionId/pay/:paymentId', payTransaction);
router.put('/:transactionId/process', processTransaction);
router.get('/seller', getTransactionSeller);
router.put('/:transactionId/complete', completeTransaction);
router.get('/', getTransaction);


export default router;
