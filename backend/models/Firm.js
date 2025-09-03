const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
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
  registrationNumber: {
    type: String,
    trim: true
  },
  
  // Contact Information
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
  website: {
    type: String,
    trim: true
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Business Details
  businessType: {
    type: String,
    enum: ['proprietorship', 'partnership', 'llp', 'private_limited', 'public_limited'],
    default: 'partnership'
  },
  industry: {
    type: String,
    trim: true
  },
  foundingYear: {
    type: Number
  },
  
  // CA Firm Specific
  firmType: {
    type: String,
    enum: ['individual', 'partnership', 'corporate'],
    default: 'partnership'
  },
  partnerCount: {
    type: Number,
    default: 1
  },
  staffCount: {
    type: Number,
    default: 0
  },
  clientCount: {
    type: Number,
    default: 0
  },
  
  // Compliance & Legal
  gstNumber: {
    type: String,
    trim: true
  },
  panNumber: {
    type: String,
    trim: true
  },
  tanNumber: {
    type: String,
    trim: true
  },
  professionalTaxNumber: {
    type: String,
    trim: true
  },
  
  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    features: [{
      type: String,
      enum: [
        'basic_docs', 'advanced_docs', 'compliance_calendar',
        'project_management', 'tally_integration', 'client_portal',
        'analytics', 'api_access', 'white_label'
      ]
    }]
  },
  
  // Settings & Configuration
  settings: {
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    language: {
      type: String,
      default: 'en'
    },
    complianceReminders: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    }
  },
  
  // Branding
  branding: {
    logo: {
      type: String
    },
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    secondaryColor: {
      type: String,
      default: '#64748b'
    },
    customDomain: {
      type: String
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
firmSchema.index({ name: 1 });
firmSchema.index({ email: 1 });
firmSchema.index({ registrationNumber: 1 });
firmSchema.index({ isActive: 1 });

// Virtual for full address
firmSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  return [
    addr.street,
    addr.city,
    addr.state,
    addr.pincode,
    addr.country
  ].filter(Boolean).join(', ');
});

// Method to check if firm has feature
firmSchema.methods.hasFeature = function(feature) {
  return this.subscription.features.includes(feature);
};

// Method to get subscription status
firmSchema.methods.isSubscriptionActive = function() {
  if (!this.subscription.isActive) return false;
  if (!this.subscription.endDate) return true;
  return new Date() <= this.subscription.endDate;
};

// Ensure virtual fields are serialized
firmSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Firm', firmSchema);
