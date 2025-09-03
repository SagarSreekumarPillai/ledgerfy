const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Firm & Client Reference
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectCode: {
    type: String,
    required: true,
    trim: true
  },
  
  // Project Type & Category
  type: {
    type: String,
    enum: [
      'gst_filing', 'tds_filing', 'itr_filing', 'roc_filing',
      'audit', 'tax_audit', 'bookkeeping', 'payroll',
      'consultation', 'compliance_review', 'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['compliance', 'audit', 'consultation', 'maintenance', 'other'],
    default: 'compliance'
  },
  
  // Timeline & Deadlines
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  actualStartDate: {
    type: Date
  },
  actualCompletionDate: {
    type: Date
  },
  
  // Status & Progress
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Team & Assignment
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['lead', 'member', 'reviewer', 'approver']
    },
    assignedDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Financial Information
  budget: {
    estimated: {
      type: Number
    },
    actual: {
      type: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  billing: {
    rate: {
      type: Number
    },
    billingType: {
      type: String,
      enum: ['hourly', 'fixed', 'percentage', 'other'],
      default: 'fixed'
    },
    invoiceStatus: {
      type: String,
      enum: ['not_invoiced', 'draft', 'sent', 'paid', 'overdue'],
      default: 'not_invoiced'
    }
  },
  
  // Compliance Specific Fields
  complianceDetails: {
    period: {
      start: Date,
      end: Date
    },
    filingType: {
      type: String,
      enum: ['original', 'revised', 'belated', 'other']
    },
    dueDateExtension: {
      hasExtension: { type: Boolean, default: false },
      extendedDate: Date,
      reason: String
    },
    governmentPortal: {
      type: String,
      enum: ['gstn', 'tds', 'itr', 'mca', 'other']
    },
    portalCredentials: {
      username: String,
      lastLogin: Date
    }
  },
  
  // Tasks & Milestones
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    completedDate: Date,
    isCompleted: { type: Boolean, default: false },
    dependencies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    }]
  }],
  
  // Documents & Attachments
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['input', 'output', 'reference', 'approval', 'other']
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isRequired: { type: Boolean, default: false },
    isReceived: { type: Boolean, default: false }
  }],
  
  // Communication & Notes
  notes: [{
    content: String,
    type: {
      type: String,
      enum: ['general', 'technical', 'client_communication', 'internal', 'other']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isInternal: { type: Boolean, default: false }
  }],
  
  // Risk & Issues
  risks: [{
    description: String,
    probability: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    impact: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    mitigationPlan: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['open', 'mitigated', 'closed'],
      default: 'open'
    }
  }],
  
  // Time Tracking
  timeEntries: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: Date,
    hours: Number,
    description: String,
    isBillable: { type: Boolean, default: true },
    rate: Number
  }],
  
  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
projectSchema.index({ firmId: 1, clientId: 1 });
projectSchema.index({ firmId: 1, status: 1 });
projectSchema.index({ firmId: 1, type: 1 });
projectSchema.index({ firmId: 1, dueDate: 1 });
projectSchema.index({ firmId: 1, projectManager: 1 });
projectSchema.index({ firmId: 1, 'teamMembers.userId': 1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.dueDate) return null;
  const diffTime = Math.abs(this.dueDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for overdue status
projectSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Method to calculate total hours
projectSchema.methods.getTotalHours = function() {
  return this.timeEntries.reduce((total, entry) => total + entry.hours, 0);
};

// Method to calculate billable hours
projectSchema.methods.getBillableHours = function() {
  return this.timeEntries
    .filter(entry => entry.isBillable)
    .reduce((total, entry) => total + entry.hours, 0);
};

// Method to get team member count
projectSchema.methods.getTeamSize = function() {
  return this.teamMembers.filter(member => member.isActive).length;
};

// Method to check if user is team member
projectSchema.methods.isTeamMember = function(userId) {
  return this.teamMembers.some(member => 
    member.userId.equals(userId) && member.isActive
  );
};

// Ensure virtual fields are serialized
projectSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Project', projectSchema);
