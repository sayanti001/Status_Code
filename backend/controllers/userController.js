// server/controllers/userController.js
const mongoose = require('mongoose');
const User = require('../models/user');

// Verify user and create if not exists
const verifyUser = async (req, res) => {
  try {
    const auth0ID = req.auth.sub;
    if (!auth0ID) {
      return res.status(400).json({ message: 'userId not found in token' });
    }

    // Check if user exists
    let user = await User.findOne({ auth0ID })
      .populate({
        path: 'organizations',
        populate: {
          path: 'services',
          model: 'Service'
        }
      });
    
    console.log("user found", user);
    
    if (!user) {
      user = new User({
        auth0ID,
        name: 'User',
        organizations: [],
        createdAt: new Date(),
      });
      try {
        await user.save();
        console.log("User saved:", user);
      } catch (saveErr) {
        console.error("Error saving user:", saveErr);
      }
    }

    // Return user info
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { verifyUser };