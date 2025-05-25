const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Profile update request:', req.body);
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'businessType', 'location', 'phone'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates. Only name, phone, businessType, and location can be updated.' });
    }
    
    // If phone is being updated, check if it's already in use by another user
    if (req.body.phone && req.body.phone !== req.user.phone) {
      const phoneExists = await User.findOne({ phone: req.body.phone, _id: { $ne: req.user._id } });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      
      // Validate phone format
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
    }
    
    // If user is a provider and location is required
    if (req.user.userType === 'provider' && updates.includes('location') && !req.body.location) {
      return res.status(400).json({ message: 'Location is required for service providers' });
    }

    // Apply updates
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    
    // Return updated user without sensitive information
    const userResponse = req.user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    
    console.log('Profile updated successfully for user:', req.user._id);
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: 'Error updating profile: ' + error.message });
  }
};

exports.buyCredits = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid credit amount' });
    }

    if (req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can buy credits' });
    }

    // In a real application, integrate payment gateway here
    // For now, we'll just add the credits directly
    
    req.user.credits += amount;
    await req.user.save();

    res.json({
      message: 'Credits purchased successfully',
      credits: req.user.credits
    });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing credits' });
  }
};
