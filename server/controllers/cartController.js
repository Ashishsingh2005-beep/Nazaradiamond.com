const Cart = require('../models/Cart');

// @desc    Get user cart from database
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const userCart = global.mockCart.find(c => c.user === req.user._id);
      return res.json(userCart ? userCart.items : []);
    }
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save user cart (Sync localstorage with DB)
// @route   POST /api/cart
// @access  Private
const saveCart = async (req, res) => {
  const { items } = req.body; // Array of { productId, quantity, selectedMetal, selectedColor, selectedSize }
  try {
    if (!global.isMongoConnected) {
      let userCartIdx = global.mockCart.findIndex(c => c.user === req.user._id);
      const cartItems = items.map(it => ({
        product: it.productId,
        quantity: it.quantity,
        selectedMetal: it.selectedMetal,
        selectedColor: it.selectedColor,
        selectedSize: it.selectedSize
      }));
      if (userCartIdx > -1) {
        global.mockCart[userCartIdx].items = cartItems;
      } else {
        global.mockCart.push({ user: req.user._id, items: cartItems });
      }
      return res.json({ message: 'Cart synced successfully (Mock Mode)' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    const cartItems = items.map(it => ({
      product: it.productId,
      quantity: it.quantity,
      selectedMetal: it.selectedMetal,
      selectedColor: it.selectedColor,
      selectedSize: it.selectedSize
    }));

    if (cart) {
      cart.items = cartItems;
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items: cartItems });
    }
    res.json(cart.items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  saveCart
};
