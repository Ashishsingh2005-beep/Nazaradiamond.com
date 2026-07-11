const express = require('express');
const router = express.Router();
const { getCart, saveCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getCart)
  .post(saveCart);

module.exports = router;
