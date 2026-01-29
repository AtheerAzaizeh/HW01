// server/routes/orders.js
import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules for order
const orderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required')
];

// Guest order validation (includes email and phone)
const guestOrderValidation = [
  ...orderValidation,
  body('guestEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),
  body('shippingAddress.phone')
    .optional()
    .trim()
];

const statusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

// Guest order (no auth required)
router.post('/guest', guestOrderValidation, validate, createGuestOrder);

// Protected routes (require login)
router.post('/', protect, orderValidation, validate, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, statusValidation, validate, updateOrderStatus);

export default router;
