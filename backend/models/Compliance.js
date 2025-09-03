const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
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
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  complianceCode: {
    type: String,
    required: true,
    trim: true
  },
  
  // Compliance Type & Category
  type: {
    type: String,
    enum: [
      'gst', 'tds', 'itr', 'roc', 'mca', 'pf', 'esi', 'professional_tax',
      'shop_establishment', 'labour_law', 'environmental', 'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['filing', 'payment', 'registration', 'renewal', 'compliance', 'other'],
    required: true
  },
  
  // Specific Compliance Details
  gstDetails: {
    returnType: {
      type: String,
      enum: ['gstr1', 'gstr2', 'gstr3b', 'gstr4', 'gstr5', 'gstr6', 'gstr7', 'gstr8', 'gstr9', 'gstr9c']
    },
    period: {
      start: Date,
      end: Date
    },
    dueDate: Date,
    filingDate: Date,
    acknowledgmentNumber: String,
    status: {
      type: String,
      enum: ['pending', 'filed', 'accepted', 'rejected', 'other']
    },
    amount: {
      taxLiability: Number,
      interest: Number,
      penalty: Number,
      total: Number
    }
  },
  
  tdsDetails: {
    returnType: {
      type: String,
      enum: ['24q', '26q', '27q', '27eq', 'other']
    },
    period: {
      start: Date,
      end: Date
    },
    dueDate: Date,
    filingDate: Date,
    acknowledgmentNumber: String,
    status: {
      type: String,
      enum: ['pending', 'filed', 'accepted', 'rejected', 'other']
    },
    amount: {
      tdsDeducted: Number,
      interest: Number,
      penalty: Number,
      total: Number
    }
  },
  
  itrDetails: {
    returnType: {
      type: String,
      enum: ['itr1', 'itr2', 'itr3', 'itr4', 'itr5', 'itr6', 'itr7']
    },
    assessmentYear: {
      type: String,
      required: true
    },
    dueDate: Date,
    filingDate: Date,
    acknowledgmentNumber: String,
    status: {
      type: String,
      enum: ['pending', 'filed', 'accepted', 'rejected', 'other']
    },
    amount: {
      taxLiability: Number,
      interest: Number,
      penalty: Number,
      total: Number
    }
  },
  
  rocDetails: {
    formType: {
      type: String,
      enum: ['adth1', 'adth2', 'adth3', 'adth4', 'adth5', 'adth6', 'adth7', 'adth8', 'adth9', 'adth10']
    },
    period: {
      start: Date,
      end: Date
    },
    dueDate: Date,
    filingDate: Date,
    acknowledgmentNumber: String,
    status: {
      type: String,
      enum: ['pending', 'filed', 'accepted', 'rejected', 'other']
    },
    amount: {
      filingFee: Number,
      additionalFee: Number,
      penalty: Number,
      total: Number
    }
  },
  
  // Timeline & Deadlines
  dueDate: {
    type: Date,
    required: true
  },
  extendedDueDate: {
    type: Date
  },
  actualFilingDate: {
    type: Date
  },
  
  // Status & Progress
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'filed', 'accepted', 'rejected', 'on_hold', 'cancelled'],
    default: 'pending'
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
  
  // Assignment & Responsibility
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Recurrence & Automation
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['monthly', 'quarterly', 'half_yearly', 'yearly', 'custom'],
    default: 'yearly'
  },
  nextDueDate: {
    type: Date
  },
  
  // Documents & Attachments
  requiredDocuments: [{
    name: String,
    type: {
      type: String,
      enum: ['mandatory', 'optional', 'conditional']
    },
    isReceived: { type: Boolean, default: false },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    receivedDate: Date,
    notes: String
  }],
  
  outputDocuments: [{
    name: String,
    type: {
      type: String,
      enum: ['return', 'challan', 'acknowledgment', 'certificate', 'other']
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    generatedDate: Date,
    notes: String
  }],
  
  // Financial Information
  financialDetails: {
    estimatedCost: Number,
    actualCost: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    billingAmount: Number,
    billingStatus: {
      type: String,
      enum: ['not_billed', 'drafted', 'sent', 'paid', 'overdue'],
      default: 'not_billed'
    }
  },
  
  // Risk & Compliance
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    riskFactors: [{
      factor: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      description: String,
      mitigationPlan: String
    }],
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  // Reminders & Notifications
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'in_app']
    },
    daysBefore: Number,
    sentAt: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'cancelled'],
      default: 'pending'
    },
    recipient: String,
    message: String
  }],
  
  // Notes & Communication
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
complianceSchema.index({ firmId: 1, clientId: 1 });
complianceSchema.index({ firmId: 1, type: 1 });
complianceSchema.index({ firmId: 1, status: 1 });
complianceSchema.index({ firmId: 1, dueDate: 1 });
complianceSchema.index({ firmId: 1, assignedTo: 1 });
complianceSchema.index({ firmId: 1, 'gstDetails.returnType': 1 });
complianceSchema.index({ firmId: 1, 'tdsDetails.returnType': 1 });
complianceSchema.index({ firmId: 1, 'itrDetails.assessmentYear': 1 });

// Virtual for days remaining
complianceSchema.virtual('daysRemaining').get(function() {
  const dueDate = this.extendedDueDate || this.dueDate;
  if (!dueDate) return null;
  
  const now = new Date();
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for overdue status
complianceSchema.virtual('isOverdue').get(function() {
  const dueDate = this.extendedDueDate || this.dueDate;
  if (!dueDate || this.status === 'filed' || this.status === 'accepted') return false;
  return new Date() > dueDate;
});

// Virtual for overdue days
complianceSchema.virtual('overdueDays').get(function() {
  if (!this.isOverdue) return 0;
  const dueDate = this.extendedDueDate || this.dueDate;
  const now = new Date();
  const diffTime = now - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for compliance period
complianceSchema.virtual('compliancePeriod').get(function() {
  switch (this.type) {
    case 'gst':
      return this.gstDetails?.period;
    case 'tds':
      return this.tdsDetails?.period;
    case 'itr':
      return { start: new Date(this.itrDetails?.assessmentYear - 1, 3, 1), end: new Date(this.itrDetails?.assessmentYear, 2, 31) };
    case 'roc':
      return this.rocDetails?.period;
    default:
      return null;
  }
});

// Method to check if compliance is due soon
complianceSchema.methods.isDueSoon = function(days = 7) {
  const daysRemaining = this.daysRemaining;
  return daysRemaining !== null && daysRemaining <= days && daysRemaining > 0;
};

// Method to check if all required documents are received
complianceSchema.methods.allDocumentsReceived = function() {
  const mandatoryDocs = this.requiredDocuments.filter(doc => doc.type === 'mandatory');
  return mandatoryDocs.length > 0 && mandatoryDocs.every(doc => doc.isReceived);
};

// Method to calculate compliance score
complianceSchema.methods.calculateComplianceScore = function() {
  let score = 0;
  let totalWeight = 0;
  
  // Document completion (40% weight)
  const docWeight = 40;
  const mandatoryDocs = this.requiredDocuments.filter(doc => doc.type === 'mandatory');
  if (mandatoryDocs.length > 0) {
    const receivedDocs = mandatoryDocs.filter(doc => doc.isReceived).length;
    score += (receivedDocs / mandatoryDocs.length) * docWeight;
  }
  totalWeight += docWeight;
  
  // Timeliness (30% weight)
  const timeWeight = 30;
  if (this.status === 'filed' || this.status === 'accepted') {
    if (this.actualFilingDate <= this.dueDate) {
      score += timeWeight; // On time
    } else if (this.actualFilingDate <= this.extendedDueDate) {
      score += timeWeight * 0.8; // Within extension
    } else {
      score += timeWeight * 0.5; // Late
    }
  }
  totalWeight += timeWeight;
  
  // Quality (30% weight)
  const qualityWeight = 30;
  if (this.status === 'accepted') {
    score += qualityWeight; // Accepted without issues
  } else if (this.status === 'filed') {
    score += qualityWeight * 0.8; // Filed, pending acceptance
  } else if (this.status === 'rejected') {
    score += qualityWeight * 0.3; // Rejected
  }
  totalWeight += qualityWeight;
  
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
};

// Method to get next due date for recurring compliance
complianceSchema.methods.getNextDueDate = function() {
  if (!this.isRecurring) return null;
  
  const baseDate = this.actualFilingDate || this.dueDate;
  if (!baseDate) return null;
  
  const nextDate = new Date(baseDate);
  
  switch (this.recurrencePattern) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'half_yearly':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

// Ensure virtual fields are serialized
complianceSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Compliance', complianceSchema);
