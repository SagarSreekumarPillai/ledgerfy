const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Firm = require('../models/Firm');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (firm admin)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      firmName,
      firmType,
      businessType,
      address
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create firm first
    const firm = new Firm({
      name: firmName,
      displayName: firmName,
      firmType,
      businessType,
      address,
      email,
      phone,
      createdBy: null // Will be updated after user creation
    });

    await firm.save();

    // Create user with admin role
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      firmId: firm._id,
      role: 'admin',
      permissions: [
        'view_clients', 'edit_clients', 'delete_clients',
        'view_projects', 'edit_projects', 'delete_projects',
        'view_documents', 'edit_documents', 'delete_documents',
        'view_compliance', 'edit_compliance', 'delete_compliance',
        'view_tally', 'edit_tally',
        'view_analytics', 'view_users', 'edit_users'
      ]
    });

    await user.save();

    // Update firm with creator
    firm.createdBy = user._id;
    await firm.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        firmId: user.firmId,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'ledgerfy_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            firmId: user.firmId
          },
          firm: {
            id: firm.id,
            name: firm.name,
            firmType: firm.firmType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate('firmId', 'name firmType');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check if firm is active
    if (!user.firmId || !user.firmId.isActive) {
      return res.status(400).json({ message: 'Firm account is deactivated' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        firmId: user.firmId._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'ledgerfy_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            firmId: user.firmId._id,
            permissions: user.permissions
          },
          firm: {
            id: user.firmId._id,
            name: user.firmId.name,
            firmType: user.firmId.firmType
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register-staff
// @desc    Register a new staff member (requires admin auth)
// @access  Private
router.post('/register-staff', auth, async (req, res) => {
  try {
    // Check if user has permission to create users
    if (!req.user.permissions.includes('edit_users')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      designation,
      department,
      employeeId,
      permissions
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      firmId: req.user.firmId,
      role: role || 'staff',
      designation,
      department,
      employeeId,
      permissions: permissions || [],
      createdBy: req.user.id
    });

    await user.save();

    res.json({
      message: 'Staff member registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register-client
// @desc    Register a new client user
// @access  Private
router.post('/register-client', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      clientId
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create client user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      firmId: req.user.firmId,
      role: 'client',
      permissions: ['view_documents', 'view_projects'],
      createdBy: req.user.id
    });

    await user.save();

    res.json({
      message: 'Client user registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('firmId', 'name firmType subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET || 'ledgerfy_secret_key',
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({
      message: 'Password reset email sent',
      resetToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ledgerfy_secret_key');
    
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, just return success message
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
