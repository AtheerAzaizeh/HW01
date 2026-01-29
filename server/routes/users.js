// server/routes/users.js
import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import { protect, superAdmin, admin } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation for creating admin
const createAdminValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// @desc    Get all users (SuperAdmin only)
// @route   GET /api/users
// @access  Private/SuperAdmin
router.get('/', protect, superAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create admin user (SuperAdmin only)
// @route   POST /api/users/admin
// @access  Private/SuperAdmin
router.post('/admin', protect, superAdmin, createAdminValidation, validate, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create admin (not superadmin - only seed can create superadmin)
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role (SuperAdmin only)
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
router.put('/:id/role', protect, superAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;

    // Can't change to superadmin
    if (role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot promote to superadmin'
      });
    }

    // Can't change own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isAdmin: role === 'admin' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (SuperAdmin only)
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
router.delete('/:id', protect, superAdmin, async (req, res, next) => {
  try {
    // Can't delete self
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Can't delete superadmin
    if (user.role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete superadmin'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted',
      data: {}
    });
  } catch (error) {
    next(error);
  }
});

export default router;
