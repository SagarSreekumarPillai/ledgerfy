const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Firm Reference
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  clientCode: {
    type: String,
    required: true,
    trim: true
  },
  
  // Business Details
  businessType: {
    type: String,
    enum: ['proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited', 'individual'],
    required: true
  },
  industry: {
    type: String,
    trim: true
  },
  businessDescription: {
    type: String,
    trim: true
  },
  foundingYear: {
    type: Number
  },
  
  // Contact Information
  primaryContact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    }
  },
  secondaryContacts: [{
    name: String,
    email: String,
    phone: String,
    designation: String,
    isActive: { type: Boolean, default: true }
  }],
  
  // Address
  registeredAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  correspondenceAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    },
    isSameAsRegistered: {
      type: Boolean,
      default: false
    }
  },
  
  // Legal & Compliance
  panNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  tanNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  cinNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  llpinNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  professionalTaxNumber: {
    type: String,
    trim: true
  },
  
  // Financial Information
  annualTurnover: {
    type: Number
  },
  currency: {
    type: String,
    default: 'INR'
  },
  bankDetails: [{
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branch: String,
    isActive: { type: Boolean, default: true }
  }],
  
  // Compliance Profile
  complianceProfile: {
    gstCategory: {
      type: String,
      enum: ['regular', 'composition', 'exempt', 'unregistered'],
      default: 'regular'
    },
    tdsCategory: {
      type: String,
      enum: ['deductor', 'deductee', 'both', 'none'],
      default: 'none'
    },
    rocCategory: {
      type: String,
      enum: ['private_limited', 'public_limited', 'llp', 'partnership', 'proprietorship', 'none'],
      default: 'none'
    },
    auditRequired: {
      type: Boolean,
      default: false
    },
    taxAuditRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Service Agreement
  services: [{
    type: {
      type: String,
      enum: [
        'gst_filing', 'tds_filing', 'itr_filing', 'roc_filing',
        'audit', 'tax_audit', 'bookkeeping', 'payroll',
        'consultation', 'compliance_review', 'other'
      ]
    },
    description: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    billingFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annually', 'one_time'],
      default: 'monthly'
    },
    rate: Number
  }],
  
  // Status & Risk Assessment
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  },
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
  
  // Important Dates
  importantDates: [{
    title: String,
    date: Date,
    type: {
      type: String,
      enum: ['compliance', 'business', 'personal', 'other']
    },
    description: String,
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: String
  }],
  
  // Notes & Communication
  notes: [{
    content: String,
    type: {
      type: String,
      enum: ['general', 'compliance', 'financial', 'risk', 'other']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
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
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
clientSchema.index({ firmId: 1, clientCode: 1 });
clientSchema.index({ firmId: 1, name: 1 });
clientSchema.index({ firmId: 1, status: 1 });
clientSchema.index({ firmId: 1, 'primaryContact.email': 1 });
clientSchema.index({ firmId: 1, panNumber: 1 });
clientSchema.index({ firmId: 1, gstNumber: 1 });

// Virtual for full registered address
clientSchema.virtual('fullRegisteredAddress').get(function() {
  const addr = this.registeredAddress;
  if (!addr) return '';
  
  return [
    addr.street,
    addr.city,
    addr.state,
    addr.pincode,
    addr.country
  ].filter(Boolean).join(', ');
});

// Virtual for full correspondence address
clientSchema.virtual('fullCorrespondenceAddress').get(function() {
  if (this.correspondenceAddress.isSameAsRegistered) {
    return this.fullRegisteredAddress;
  }
  
  const addr = this.correspondenceAddress;
  if (!addr) return '';
  
  return [
    addr.street,
    addr.city,
    addr.state,
    addr.pincode,
    addr.country
  ].filter(Boolean).join(', ');
});

// Method to check if client has service
clientSchema.methods.hasService = function(serviceType) {
  return this.services.some(service => 
    service.type === serviceType && service.isActive
  );
};

// Method to get active services
clientSchema.methods.getActiveServices = function() {
  return this.services.filter(service => service.isActive);
};

// Method to calculate compliance score
clientSchema.methods.getComplianceScore = function() {
  // This would be calculated based on actual compliance data
  // For now, return a placeholder
  return 85;
};

// Ensure virtual fields are serialized
clientSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Client', clientSchema);
