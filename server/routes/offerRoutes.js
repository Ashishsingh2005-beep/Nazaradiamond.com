const express = require('express');
const router = express.Router();
const {
  createOffer,
  getOffers,
  deleteOffer,
  validateOffer
} = require('../controllers/offerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getOffers)
  .post(protect, admin, createOffer);

router.post('/validate', protect, validateOffer);

router.route('/:id')
  .delete(protect, admin, deleteOffer);

module.exports = router;
