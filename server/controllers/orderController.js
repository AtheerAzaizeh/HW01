// server/controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order (registered user)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalPrice: clientTotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Calculate total from items
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        // For items without product ID (added from external source), use provided data
        orderItems.push({
          name: item.name,
          image: item.image,
          price: parseFloat(item.price),
          quantity: item.quantity || 1
        });
        totalPrice += parseFloat(item.price) * (item.quantity || 1);
        continue;
      }

      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity || 1
      });

      totalPrice += product.price * (item.quantity || 1);

      // Reduce stock
      product.stock -= (item.quantity || 1);
      await product.save();
    }

    // Apply member discount (5%)
    const memberDiscount = totalPrice * 0.05;
    const finalPrice = totalPrice - memberDiscount;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalPrice: clientTotal || finalPrice,
      discount: memberDiscount
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create guest order (no auth)
// @route   POST /api/orders/guest
// @access  Public
export const createGuestOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, guestEmail, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    const orderItems = items.map(item => ({
      name: item.name,
      image: item.image,
      price: parseFloat(item.price),
      quantity: item.quantity || 1
    }));

    const order = await Order.create({
      items: orderItems,
      shippingAddress,
      guestEmail,
      isGuest: true,
      totalPrice: totalPrice || orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    });

    res.status(201).json({
      success: true,
      message: 'Guest order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user && order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.paidAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
