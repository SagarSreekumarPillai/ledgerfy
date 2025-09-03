const express = require('express');
const TallyIntegration = require('../models/TallyIntegration');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tally
// @desc    Get all tally integrations for the firm
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const integrations = await TallyIntegration.find({ firmId: req.user.firmId })
      .populate('clientId', 'name clientCode')
      .sort({ createdAt: -1 });
    
    res.json(integrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tally
// @desc    Create a new tally integration
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const integration = new TallyIntegration({
      ...req.body,
      firmId: req.user.firmId,
      createdBy: req.user.id
    });
    
    await integration.save();
    res.json(integration);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
