const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  getReviews,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getReviews)
  .post(protect, createReview);

router.route('/product/:productId')
  .get(getProductReviews);

router.route('/:id')
  .delete(protect, admin, deleteReview);

router.route('/:id/approve')
  .put(protect, admin, approveReview);

module.exports = router;
