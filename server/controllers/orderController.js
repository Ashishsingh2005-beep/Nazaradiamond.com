const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order & deduct stock
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discountApplied,
    totalPrice
  } = req.body;

  try {
    if (!global.isMongoConnected) {
      if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
      }

      // 1. Check & deduct inventory from mock products
      for (const item of orderItems) {
        const idx = global.mockProducts.findIndex((p) => p._id === item.productId);

        if (idx > -1) {
          const product = global.mockProducts[idx];
          if (product.inventory < item.quantity) {
            return res.status(400).json({
              message: `Insufficient inventory for ${item.name}. Available: ${product.inventory}`
            });
          }
          // Deduct
          global.mockProducts[idx].inventory -= item.quantity;
        }
      }

      // 2. Save mock order
      const newOrder = {
        _id: `ord_mock_${Math.random().toString(36).substring(2, 11)}`,
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email
        },
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        discountApplied,
        totalPrice,
        isPaid: false,
        paidAt: null,
        orderStatus: 'Processing',
        createdAt: new Date()
      };

      global.mockOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Check inventory and deduct stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name}`);
      }

      if (product.inventory < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient inventory for ${item.name}. Available: ${product.inventory}`);
      }

      // Deduct inventory
      product.inventory -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountApplied,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const order = global.mockOrders.find((o) => o._id === req.params.id);
      if (order) {
        return res.json(order);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid (payment confirmation)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const { paymentId, status, email_address } = req.body;

  try {
    if (!global.isMongoConnected) {
      const idx = global.mockOrders.findIndex((o) => o._id === req.params.id);

      if (idx > -1) {
        global.mockOrders[idx].isPaid = true;
        global.mockOrders[idx].paidAt = new Date();
        global.mockOrders[idx].paymentResult = {
          id: paymentId,
          status: status,
          email_address: email_address
        };
        return res.json(global.mockOrders[idx]);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentId,
        status: status,
        email_address: email_address
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const filtered = global.mockOrders.filter((o) => o.user._id === req.user._id);
      return res.json(filtered);
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin check)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockOrders);
    }

    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order shipping/delivery status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!global.isMongoConnected) {
      const idx = global.mockOrders.findIndex((o) => o._id === req.params.id);

      if (idx > -1) {
        global.mockOrders[idx].orderStatus = status;
        return res.json(global.mockOrders[idx]);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus
};
