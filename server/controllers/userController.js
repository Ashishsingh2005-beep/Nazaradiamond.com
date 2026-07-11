const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!global.isMongoConnected) {
      const userExists = global.mockUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        _id: `user_mock_${Math.random().toString(36).substring(2, 11)}`,
        name,
        email: email.toLowerCase(),
        password,
        role: 'user',
        isBlocked: false,
        createdAt: new Date()
      };

      global.mockUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id)
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!global.isMongoConnected) {
      const user = global.mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (user) {
        if (user.isBlocked) {
          return res.status(403).json({ message: 'This account is blocked by admin' });
        }
        if (user.password === password) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
          });
        }
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({ message: 'This account is blocked by admin' });
      }
      if (await user.matchPassword(password)) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const user = global.mockUsers.find((u) => u._id === req.user._id);
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.json(global.mockUsers);
    }
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or unblock a user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockUsers.findIndex((u) => u._id === req.params.id);
      if (idx > -1) {
        global.mockUsers[idx].isBlocked = !global.mockUsers[idx].isBlocked;
        return res.json(global.mockUsers[idx]);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockUsers.findIndex((u) => u._id === req.params.id);
      if (idx > -1) {
        global.mockUsers.splice(idx, 1);
        return res.json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.params.id);
    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulated Forgot Password (Reset)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockUsers.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
      if (idx > -1) {
        global.mockUsers[idx].password = newPassword;
        return res.json({ message: 'Password updated successfully (Mock Mode)' });
      } else {
        return res.status(404).json({ message: 'Email not registered' });
      }
    }

    const user = await User.findOne({ email });
    if (user) {
      user.password = newPassword; // Pre-save hook will hash it automatically
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'Email not registered' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  blockUser,
  deleteUser,
  forgotPassword
};
