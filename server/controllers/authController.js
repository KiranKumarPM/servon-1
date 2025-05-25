const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password, userType } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const query = { email };
    
    // If userType is provided, include it in the query
    if (userType) {
      query.userType = userType;
    }
    
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: userType ? 
        `No ${userType} account found with this email` : 
        'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (req, res) => {
  try {
    console.log('Received OTP request:', req.body);
    const { phone, email, password } = req.body;
    
    // Validate required fields
    if (!phone || !email || !password) {
      console.log('Missing required fields for OTP');
      return res.status(400).json({ message: 'Phone, email, and password are required' });
    }

    // Validate phone format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      console.log('Invalid phone format:', phone);
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      console.log('Phone already registered:', phone);
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const otp = generateOTP();
    otpStore.set(phone, {
      code: otp,
      expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // In development, just log the OTP
    console.log(`OTP for ${phone}: ${otp}`);

    // In production, uncomment this to send actual SMS
    /*
    await client.messages.create({
      body: `Your SERVON verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */

    console.log('OTP sent successfully for phone:', phone);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP: ' + error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, userDetails } = req.body;

    const storedOTP = otpStore.get(phone);
    
    if (!storedOTP || storedOTP.code !== otp || Date.now() > storedOTP.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP
    otpStore.delete(phone);

    // Validate user details
    if (!userDetails || !userDetails.email || !userDetails.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists by email or phone
    let user = await User.findOne({ $or: [{ email: userDetails.email }, { phone: userDetails.phone }] });
    if (user) {
      if (user.email === userDetails.email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (user.phone === userDetails.phone) {
        // Update existing user with new details
        user.email = userDetails.email;
        user.name = userDetails.name;
        user.userType = userDetails.userType;
        user.password = await bcrypt.hash(userDetails.password, 10);
        if (userDetails.businessType) {
          user.businessType = userDetails.businessType;
        }
        if (userDetails.location) {
          user.location = userDetails.location;
        }
        user.isVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(userDetails.password, 10);
      user = new User({
      phone: userDetails.phone,
      email: userDetails.email,
      password: hashedPassword,
      name: userDetails.name,
      userType: userDetails.userType,
      businessType: userDetails.businessType || undefined,
      location: userDetails.location || undefined,
      isVerified: true
    });

    try {
      await user.save();
    } catch (error) {
      console.error('User save error:', error);
      return res.status(400).json({ message: error.message || 'Error creating user' });
    }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        userType: user.userType,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

exports.logout = async (req, res) => {
  try {
    // In a more sophisticated system, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out' });
  }
};
