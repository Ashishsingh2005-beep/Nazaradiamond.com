const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true }, // e.g., 9KT base price
  discountPrice: { type: Number, default: 0 }, // Discount price if set
  category: {
    type: String,
    required: true
  },
  subcategory: { type: String },
  images: [{ type: String }], // URLs of uploaded images
  specifications: {
    diamondColor: { type: String, default: 'D-E-F' },
    diamondQuality: { type: String, default: 'VVS-VS' },
    caratWeight: { type: String },
    metalWeight: { type: String },
    certification: { type: String, default: 'IGI Certified' },
    diamondCut: { type: String }
  },
  variations: {
    metals: {
      type: [String],
      enum: ['9KT', '14KT', '18KT'],
      default: ['9KT', '14KT', '18KT']
    },
    colors: {
      type: [String],
      enum: ['Rose Gold', 'White Gold', 'Yellow Gold'],
      default: ['Rose Gold', 'White Gold', 'Yellow Gold']
    },
    sizes: {
      type: [String],
      default: []
    }
  },
  inventory: { type: Number, required: true, default: 10 },
  soldCount: { type: Number, default: 0 }, // Qty sold
  weight: { type: Number, default: 0 }, // Weight of the item
  tags: [{ type: String }],
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  ratings: { type: Number, default: 5.0 },
  numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
