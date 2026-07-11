const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const filtered = global.mockReviews.filter(
        r => r.product === req.params.productId && r.isApproved
      );
      return res.json(filtered);
    }
    const reviews = await Review.find({ product: req.params.productId, isApproved: true });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    if (!global.isMongoConnected) {
      const newReview = {
        _id: `rev_mock_${Math.random().toString(36).substring(2, 11)}`,
        user: req.user._id,
        userName: req.user.name,
        product: productId,
        rating: Number(rating),
        comment,
        isApproved: false, // Needs admin approval
        createdAt: new Date()
      };
      global.mockReviews.push(newReview);
      return res.status(201).json(newReview);
    }

    const review = new Review({
      user: req.user._id,
      userName: req.user.name,
      product: productId,
      rating,
      comment
    });
    const created = await review.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getReviews = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockReviews);
    }
    const reviews = await Review.find({}).populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a review
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockReviews.findIndex(r => r._id === req.params.id);
      if (idx > -1) {
        global.mockReviews[idx].isApproved = true;

        // Optionally update product ratings
        const review = global.mockReviews[idx];
        const prodIdx = global.mockProducts.findIndex(p => p._id === review.product);
        if (prodIdx > -1) {
          const productReviews = global.mockReviews.filter(r => r.product === review.product && r.isApproved);
          const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
          global.mockProducts[prodIdx].ratings = productReviews.length ? (totalRating / productReviews.length).toFixed(1) : 5.0;
          global.mockProducts[prodIdx].numReviews = productReviews.length;
        }

        return res.json(global.mockReviews[idx]);
      } else {
        return res.status(404).json({ message: 'Review not found' });
      }
    }

    const review = await Review.findById(req.params.id);
    if (review) {
      review.isApproved = true;
      const approvedReview = await review.save();

      // Recalculate average rating for product
      const product = await Product.findById(review.product);
      if (product) {
        const approvedReviews = await Review.find({ product: review.product, isApproved: true });
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        product.ratings = approvedReviews.length ? (totalRating / approvedReviews.length) : 5.0;
        product.numReviews = approvedReviews.length;
        await product.save();
      }

      res.json(approvedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockReviews.findIndex(r => r._id === req.params.id);
      if (idx > -1) {
        const review = global.mockReviews[idx];
        global.mockReviews.splice(idx, 1);

        // Recalculate ratings
        const prodIdx = global.mockProducts.findIndex(p => p._id === review.product);
        if (prodIdx > -1) {
          const productReviews = global.mockReviews.filter(r => r.product === review.product && r.isApproved);
          const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
          global.mockProducts[prodIdx].ratings = productReviews.length ? (totalRating / productReviews.length).toFixed(1) : 5.0;
          global.mockProducts[prodIdx].numReviews = productReviews.length;
        }

        return res.json({ message: 'Review removed' });
      } else {
        return res.status(404).json({ message: 'Review not found' });
      }
    }

    const review = await Review.findById(req.params.id);
    if (review) {
      const productId = review.product;
      await Review.deleteOne({ _id: req.params.id });

      // Recalculate ratings
      const product = await Product.findById(productId);
      if (product) {
        const approvedReviews = await Review.find({ product: productId, isApproved: true });
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        product.ratings = approvedReviews.length ? (totalRating / approvedReviews.length) : 5.0;
        product.numReviews = approvedReviews.length;
        await product.save();
      }

      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  getReviews,
  approveReview,
  deleteReview
};
