const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Diwali Sale"
  discountValue: { type: Number, required: true }, // 20 for 20%
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  applicableOn: {
    type: String,
    enum: ['All', 'Category', 'Product'],
    default: 'All'
  },
  applicableCategory: { type: String }, // e.g. "Rings"
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema);
