const express = require('express');
const Compliance = require('../models/Compliance');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/compliance
// @desc    Get all compliance items for the firm
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const compliance = await Compliance.find({ firmId: req.user.firmId })
      .populate('clientId', 'name clientCode')
      .populate('projectId', 'name projectCode')
      .sort({ dueDate: 1 });
    
    res.json(compliance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/compliance
// @desc    Create a new compliance item
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const compliance = new Compliance({
      ...req.body,
      firmId: req.user.firmId,
      createdBy: req.user.id
    });
    
    await compliance.save();
    res.json(compliance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
