const express = require('express');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clients
// @desc    Get all clients for the firm
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;
    
    // Build query
    const query = { firmId: req.user.firmId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'primaryContact.name': { $regex: search, $options: 'i' } },
        { 'primaryContact.email': { $regex: search, $options: 'i' } },
        { panNumber: { $regex: search, $options: 'i' } },
        { gstNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.businessType = type;
    }
    
    // Execute query with pagination
    const clients = await Client.find(query)
      .populate('assignedTo', 'firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await Client.countDocuments(query);
    
    res.json({
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      firmId: req.user.firmId
    }).populate('assignedTo', 'firstName lastName');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (!req.user.permissions.includes('edit_clients')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const {
      name,
      displayName,
      businessType,
      industry,
      foundingYear,
      primaryContact,
      secondaryContacts,
      registeredAddress,
      correspondenceAddress,
      panNumber,
      gstNumber,
      tanNumber,
      cinNumber,
      llpinNumber,
      professionalTaxNumber,
      annualTurnover,
      currency,
      bankDetails,
      complianceProfile,
      services,
      assignedTo
    } = req.body;
    
    // Generate client code
    const clientCount = await Client.countDocuments({ firmId: req.user.firmId });
    const clientCode = `CL${String(clientCount + 1).padStart(4, '0')}`;
    
    const client = new Client({
      firmId: req.user.firmId,
      name,
      displayName,
      clientCode,
      businessType,
      industry,
      foundingYear,
      primaryContact,
      secondaryContacts,
      registeredAddress,
      correspondenceAddress,
      panNumber,
      gstNumber,
      tanNumber,
      cinNumber,
      llpinNumber,
      professionalTaxNumber,
      annualTurnover,
      currency,
      bankDetails,
      complianceProfile,
      services,
      assignedTo,
      createdBy: req.user.id
    });
    
    await client.save();
    
    // Populate assignedTo field
    await client.populate('assignedTo', 'firstName lastName');
    
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (!req.user.permissions.includes('edit_clients')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const client = await Client.findOne({
      _id: req.params.id,
      firmId: req.user.firmId
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Update fields
    const updateFields = req.body;
    updateFields.updatedBy = req.user.id;
    
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('assignedTo', 'firstName lastName');
    
    res.json(updatedClient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (!req.user.permissions.includes('delete_clients')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const client = await Client.findOne({
      _id: req.params.id,
      firmId: req.user.firmId
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Soft delete - just mark as inactive
    client.status = 'terminated';
    client.updatedBy = req.user.id;
    await client.save();
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/clients/:id/notes
// @desc    Add note to client
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { content, type, isInternal } = req.body;
    
    const client = await Client.findOne({
      _id: req.params.id,
      firmId: req.user.firmId
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    client.notes.push({
      content,
      type: type || 'general',
      createdBy: req.user.id,
      isInternal: isInternal || false
    });
    
    await client.save();
    
    res.json(client.notes[client.notes.length - 1]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/clients/:id/compliance-score
// @desc    Get client compliance score
// @access  Private
router.get('/:id/compliance-score', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      firmId: req.user.firmId
    });
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const complianceScore = client.getComplianceScore();
    
    res.json({ complianceScore });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/clients/stats/overview
// @desc    Get client statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Client.aggregate([
      { $match: { firmId: req.user.firmId } },
      {
        $group: {
          _id: null,
          totalClients: { $sum: 1 },
          activeClients: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          inactiveClients: {
            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
          },
          terminatedClients: {
            $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const businessTypeStats = await Client.aggregate([
      { $match: { firmId: req.user.firmId } },
      {
        $group: {
          _id: '$businessType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const riskLevelStats = await Client.aggregate([
      { $match: { firmId: req.user.firmId } },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      overview: stats[0] || {
        totalClients: 0,
        activeClients: 0,
        inactiveClients: 0,
        terminatedClients: 0
      },
      businessTypeStats,
      riskLevelStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
