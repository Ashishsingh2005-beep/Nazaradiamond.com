const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  blockUser,
  deleteUser,
  forgotPassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getUserProfile);

// Admin user management routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/block')
  .put(protect, admin, blockUser);

module.exports = router;
