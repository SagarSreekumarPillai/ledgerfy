const express = require('express');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/documents
// @desc    Get all documents for the firm
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find({ firmId: req.user.firmId })
      .populate('clientId', 'name clientCode')
      .populate('projectId', 'name projectCode')
      .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/documents
// @desc    Create a new document
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const document = new Document({
      ...req.body,
      firmId: req.user.firmId,
      createdBy: req.user.id
    });
    
    await document.save();
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
