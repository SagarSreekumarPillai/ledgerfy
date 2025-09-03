const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for the firm
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ firmId: req.user.firmId })
      .populate('clientId', 'name clientCode')
      .populate('projectManager', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      firmId: req.user.firmId,
      createdBy: req.user.id
    });
    
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
