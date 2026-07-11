const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const userWish = global.mockWishlist.find(w => w.user === req.user._id);
      if (!userWish) return res.json([]);
      // Populate mock products
      const populated = userWish.products.map(id => global.mockProducts.find(p => p._id === id)).filter(Boolean);
      return res.json(populated);
    }
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    if (!global.isMongoConnected) {
      let userWish = global.mockWishlist.find(w => w.user === req.user._id);
      if (!userWish) {
        userWish = { user: req.user._id, products: [] };
        global.mockWishlist.push(userWish);
      }
      if (!userWish.products.includes(productId)) {
        userWish.products.push(productId);
      }
      const populated = userWish.products.map(id => global.mockProducts.find(p => p._id === id)).filter(Boolean);
      return res.json(populated);
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    await wishlist.populate('products');
    res.json(wishlist.products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!global.isMongoConnected) {
      let userWish = global.mockWishlist.find(w => w.user === req.user._id);
      if (userWish) {
        userWish.products = userWish.products.filter(id => id !== productId);
      } else {
        userWish = { user: req.user._id, products: [] };
      }
      const populated = userWish.products.map(id => global.mockProducts.find(p => p._id === id)).filter(Boolean);
      return res.json(populated);
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }
    await wishlist.populate('products');
    res.json(wishlist ? wishlist.products : []);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
