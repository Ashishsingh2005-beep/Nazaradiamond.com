const Offer = require('../models/Offer');
const Coupon = require('../models/Coupon');

// @desc    Create a new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
  const { name, discountValue, startDate, endDate, applicableOn, applicableCategory, applicableProducts, status } = req.body;

  try {
    if (!global.isMongoConnected) {
      const newOffer = {
        _id: `offer_mock_${Math.random().toString(36).substring(2, 11)}`,
        name,
        discountValue: Number(discountValue),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        applicableOn: applicableOn || 'All',
        applicableCategory: applicableCategory || '',
        applicableProducts: applicableProducts || [],
        status: status || 'Active',
        createdAt: new Date()
      };

      global.mockOffers.unshift(newOffer);
      return res.status(201).json(newOffer);
    }

    const offer = new Offer({
      name,
      discountValue,
      startDate,
      endDate,
      applicableOn,
      applicableCategory,
      applicableProducts,
      status
    });

    const createdOffer = await offer.save();
    res.status(201).json(createdOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockOffers);
    }

    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockOffers.findIndex((o) => o._id === req.params.id);

      if (idx > -1) {
        global.mockOffers.splice(idx, 1);
        return res.json({ message: 'Offer removed successfully' });
      } else {
        return res.status(404).json({ message: 'Offer not found' });
      }
    }

    const offer = await Offer.findById(req.params.id);

    if (offer) {
      await Offer.deleteOne({ _id: req.params.id });
      res.json({ message: 'Offer removed successfully' });
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a promo code (kept for compatibility with old checkout endpoints)
// @route   POST /api/offers/validate
// @access  Private
const validateOffer = async (req, res) => {
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
  createOffer,
  getOffers,
  deleteOffer,
  validateOffer
};
