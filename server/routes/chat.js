// server/routes/chat.js
import express from 'express';
import { body } from 'express-validator';
import {
  createChat,
  getMyChats,
  getAllChats,
  getChat,
  addMessage,
  updateChatStatus
} from '../controllers/chatController.js';
import { protect, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const chatValidation = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 100 }).withMessage('Subject cannot exceed 100 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

const messageValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

const statusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['open', 'in-progress', 'closed']).withMessage('Invalid status')
];

// Protected routes
router.post('/', protect, chatValidation, validate, createChat);
router.get('/', protect, getMyChats);
router.get('/:id', protect, getChat);
router.post('/:id/message', protect, messageValidation, validate, addMessage);

// Admin routes
router.get('/admin/all', protect, admin, getAllChats);
router.put('/:id/status', protect, admin, statusValidation, validate, updateChatStatus);

export default router;
