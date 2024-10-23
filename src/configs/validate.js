import { body } from "express-validator";

export const validateShopCreation = [
  body("name").notEmpty().withMessage("Shop name is required"),
  body("description")
    .isLength({ max: 500 })
    .withMessage("Description should not exceed 500 characters"),
];

export const validateShopUpdate = [
  body("name").optional().notEmpty().withMessage("Name should not be empty"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description should not exceed 500 characters"),
];

export const validateUserUpdate = [
  body("name").notEmpty().withMessage("Name should not be empty"),
  body("phoneNumber")
    .isLength({ min: 10, max: 13 })
    .withMessage("Invalid phone number."),
];

export const validateProductCreation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 1000 })
    .withMessage("Description should not exceed 1000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").notEmpty().withMessage("Product category is required"),
  body("shopId")
    .notEmpty()
    .withMessage("Shop ID is required")
    .isMongoId()
    .withMessage("Invalid Shop ID"),
];

export const validateProductUpdate = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Product name should not be empty"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description should not exceed 1000 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .optional()
    .notEmpty()
    .withMessage("Product category should not be empty"),
];
