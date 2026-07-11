const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockBanners.filter(b => b.isActive));
    }
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a banner (admin)
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  const { image, title, buttonText, buttonLink, type } = req.body;
  try {
    if (!global.isMongoConnected) {
      const newBanner = {
        _id: `banner_mock_${Math.random().toString(36).substring(2, 11)}`,
        image,
        title,
        buttonText: buttonText || 'Shop Now',
        buttonLink: buttonLink || '/products',
        type: type || 'slider',
        isActive: true
      };
      global.mockBanners.push(newBanner);
      return res.status(201).json(newBanner);
    }

    const banner = new Banner({
      image,
      title,
      buttonText,
      buttonLink,
      type
    });
    const created = await banner.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a banner (admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockBanners.findIndex(b => b._id === req.params.id);
      if (idx > -1) {
        global.mockBanners.splice(idx, 1);
        return res.json({ message: 'Banner removed' });
      } else {
        return res.status(404).json({ message: 'Banner not found' });
      }
    }

    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await Banner.deleteOne({ _id: req.params.id });
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBanners,
  createBanner,
  deleteBanner
};
