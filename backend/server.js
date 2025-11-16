require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Email Transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  addresses: [{
    type: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    street: String,
    city: String,
    state: String,
    zipCode: String
  }],
  orders: [{
    items: [{
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }],
    total: Number,
    status: { type: String, default: 'pending' },
    orderDate: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '☕ Coffee Haven API is running!',
    database: 'MongoDB Atlas (Cloud)',
    status: 'Connected'
  });
});

// Sign Up
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Name, email and password are required!' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists with this email!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || ''
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({ 
      success: true, 
      message: 'Account created successfully! 🎉',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required!' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found! Please check your email.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Invalid password! Please try again.' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! ☕`,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Forgot Password
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: 'Email is required!' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'No account found with this email!' });
    }

    // Create reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Coffee Haven - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f4e37;">Coffee Haven ☕</h2>
          <h3>Password Reset Request</h3>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}" style="background: #6f4e37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Password reset link sent to your email! 📧'
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.json({ success: false, message: 'Failed to send reset email. Please try again.' });
  }
});

// Reset Password
app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.json({ success: false, message: 'Token and new password are required!' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.json({ success: false, message: 'Invalid or expired reset token!' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully! You can now login with your new password.' 
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.json({ success: false, message: 'Invalid or expired reset token!' });
  }
});

// Get User Profile (Protected)
app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: 'Access token required!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.json({ success: false, message: 'User not found!' });
    }

    res.json({ success: true, user });

  } catch (error) {
    res.json({ success: false, message: 'Invalid token!' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log('🚀 Coffee Haven Server Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Database: MongoDB Atlas (Cloud)`);
  console.log(`📧 Email: ${process.env.MAIL_USER}`);
  console.log('');
  console.log('✅ Endpoints:');
  console.log('   GET  /health          - Health check');
  console.log('   POST /signup          - Create account');
  console.log('   POST /login           - User login');
  console.log('   POST /forgot-password - Reset password');
  console.log('   POST /reset-password  - Set new password');
  console.log('   GET  /profile         - Get user profile');
});
