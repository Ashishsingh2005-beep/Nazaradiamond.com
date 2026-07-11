const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockCoupons);
    }
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new coupon code
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, minPurchaseAmount, expiryDate } = req.body;
  try {
    const codeUpper = code.toUpperCase();
    if (!global.isMongoConnected) {
      const exists = global.mockCoupons.some(c => c.code === codeUpper);
      if (exists) {
        return res.status(400).json({ message: 'Coupon already exists' });
      }
      const newCoupon = {
        _id: `coupon_mock_${Math.random().toString(36).substring(2, 11)}`,
        code: codeUpper,
        discountType,
        discountValue: Number(discountValue),
        minPurchaseAmount: Number(minPurchaseAmount || 0),
        expiryDate: new Date(expiryDate),
        isActive: true
      };
      global.mockCoupons.unshift(newCoupon);
      return res.status(201).json(newCoupon);
    }

    const exists = await Coupon.findOne({ code: codeUpper });
    if (exists) {
      return res.status(400).json({ message: 'Coupon already exists' });
    }

    const coupon = new Coupon({
      code: codeUpper,
      discountType,
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      expiryDate
    });
    const created = await coupon.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a coupon code
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockCoupons.findIndex(c => c._id === req.params.id);
      if (idx > -1) {
        global.mockCoupons.splice(idx, 1);
        return res.json({ message: 'Coupon removed' });
      } else {
        return res.status(404).json({ message: 'Coupon not found' });
      }
    }

    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.deleteOne({ _id: req.params.id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;
  try {
    const codeUpper = code.toUpperCase();
    if (!global.isMongoConnected) {
      const coupon = global.mockCoupons.find(c => c.code === codeUpper && c.isActive);
      if (!coupon) {
        return res.status(404).json({ message: 'Invalid or expired coupon code' });
      }
      const currentDate = new Date();
      if (currentDate > new Date(coupon.expiryDate)) {
        return res.status(400).json({ message: 'Coupon code has expired' });
      }
      if (cartTotal < coupon.minPurchaseAmount) {
        return res.status(400).json({
          message: `Minimum order amount of ₹${coupon.minPurchaseAmount} is required`
        });
      }
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      return res.json({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      });
    }

    const coupon = await Coupon.findOne({ code: codeUpper, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }
    const currentDate = new Date();
    if (currentDate > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon code has expired' });
    }
    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minPurchaseAmount} is required`
      });
    }
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon
};
