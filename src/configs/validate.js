import { body } from 'express-validator';

export const validateShopCreation = [
    body('name').notEmpty().withMessage('Shop name is required'),
    body('description').isLength({ max: 500 }).withMessage('Description should not exceed 500 characters'),
    body('location').notEmpty().withMessage('Location is required')
];

export const validateShopUpdate = [
    body('shopId').notEmpty().withMessage('Shop ID is required'),
    body('name').optional().notEmpty().withMessage('Name should not be empty'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description should not exceed 500 characters'),
    body('location').optional().notEmpty().withMessage('Location should not be empty')
];