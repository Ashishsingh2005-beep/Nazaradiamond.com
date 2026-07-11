const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const filtered = global.mockAddresses.filter(a => a.user === req.user._id);
      return res.json(filtered);
    }
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  const { fullName, addressLine, city, state, postalCode, phone, isDefault } = req.body;
  try {
    if (!global.isMongoConnected) {
      if (isDefault) {
        // Turn off other defaults for this user
        global.mockAddresses.forEach(a => {
          if (a.user === req.user._id) a.isDefault = false;
        });
      }
      const newAddress = {
        _id: `addr_mock_${Math.random().toString(36).substring(2, 11)}`,
        user: req.user._id,
        fullName,
        addressLine,
        city,
        state,
        postalCode,
        phone,
        isDefault: !!isDefault
      };
      global.mockAddresses.push(newAddress);
      return res.status(201).json(newAddress);
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = new Address({
      user: req.user._id,
      fullName,
      addressLine,
      city,
      state,
      postalCode,
      phone,
      isDefault: !!isDefault
    });

    const created = await address.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      const idx = global.mockAddresses.findIndex(a => a._id === req.params.id && a.user === req.user._id);
      if (idx > -1) {
        global.mockAddresses.splice(idx, 1);
        return res.json({ message: 'Address deleted' });
      } else {
        return res.status(404).json({ message: 'Address not found' });
      }
    }

    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (address) {
      await Address.deleteOne({ _id: req.params.id });
      res.json({ message: 'Address deleted' });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      let found = false;
      global.mockAddresses.forEach(a => {
        if (a.user === req.user._id) {
          if (a._id === req.params.id) {
            a.isDefault = true;
            found = true;
          } else {
            a.isDefault = false;
          }
        }
      });
      if (found) {
        return res.json({ message: 'Default address updated' });
      } else {
        return res.status(404).json({ message: 'Address not found' });
      }
    }

    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (address) {
      address.isDefault = true;
      await address.save();
      res.json({ message: 'Default address updated' });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
};
