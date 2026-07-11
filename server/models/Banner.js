const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/products' },
  type: { type: String, enum: ['slider', 'festival'], default: 'slider' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
