import { body } from 'express-validator';

export const validateShopCreation = [
    body('name').notEmpty().withMessage('Shop name is required'),
    body('description').isLength({ max: 500 }).withMessage('Description should not exceed 500 characters')
];

export const validateShopUpdate = [
    body('name').optional().notEmpty().withMessage('Name should not be empty'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description should not exceed 500 characters')
];

export const validateUserUpdate = [
    body('name').notEmpty().withMessage('Name should not be empty'),
    body('phoneNumber').isLength({ min: 10, max: 13  }).withMessage('Invalid phone number.')
];