// FILE: /models/Firm.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFirm extends Document {
  name: string;
  type: 'CA' | 'CS' | 'CMA' | 'LAW' | 'OTHER';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  business: {
    gstin?: string;
    pan: string;
    tan?: string;
    cin?: string;
    llpin?: string;
  };
  settings: {
    timezone: string;
    currency: string;
    dateFormat: string;
    mfaRequired: boolean;
    sessionTimeout: number; // in minutes
    maxFileSize: number; // in MB
    allowedFileTypes: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FirmSchema = new Schema<IFirm>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['CA', 'CS', 'CMA', 'LAW', 'OTHER'],
    default: 'CA'
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      default: 'India'
    }
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    website: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },
  business: {
    gstin: {
      type: String,
      trim: true,
      maxlength: 15,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: 'Invalid GSTIN format'
      }
    },
    pan: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      validate: {
        validator: function(v: string) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: 'Invalid PAN format'
      }
    },
    tan: {
      type: String,
      trim: true,
      maxlength: 10,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional
          return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(v);
        },
        message: 'Invalid TAN format'
      }
    },
    cin: {
      type: String,
      trim: true,
      maxlength: 21,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional
          return /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v);
        },
        message: 'Invalid CIN format'
      }
    },
    llpin: {
      type: String,
      trim: true,
      maxlength: 7,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional
          return /^[A-Z]{3}-[0-9]{4}$/.test(v);
        },
        message: 'Invalid LLPIN format'
      }
    }
  },
  settings: {
    timezone: {
      type: String,
      required: true,
      default: 'Asia/Kolkata'
    },
    currency: {
      type: String,
      required: true,
      default: 'INR'
    },
    dateFormat: {
      type: String,
      required: true,
      default: 'DD/MM/YYYY'
    },
    mfaRequired: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 480, // 8 hours
      min: 15,
      max: 1440
    },
    maxFileSize: {
      type: Number,
      default: 50, // 50 MB
      min: 1,
      max: 500
    },
    allowedFileTypes: {
      type: [String],
      default: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'txt']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
FirmSchema.index({ name: 1 }, { unique: true });
FirmSchema.index({ 'contact.email': 1 });
FirmSchema.index({ 'business.pan': 1 });
FirmSchema.index({ 'business.gstin': 1 });
FirmSchema.index({ isActive: 1 });

// Virtual for full address
FirmSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}`;
});

// Virtual for business identifiers
FirmSchema.virtual('businessIdentifiers').get(function() {
  const identifiers = [];
  if (this.business.gstin) identifiers.push(`GSTIN: ${this.business.gstin}`);
  if (this.business.pan) identifiers.push(`PAN: ${this.business.pan}`);
  if (this.business.tan) identifiers.push(`TAN: ${this.business.tan}`);
  if (this.business.cin) identifiers.push(`CIN: ${this.business.cin}`);
  if (this.business.llpin) identifiers.push(`LLPIN: ${this.business.llpin}`);
  return identifiers;
});

// Method to validate business identifiers
FirmSchema.methods.validateBusinessIdentifiers = function(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (this.business.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(this.business.gstin)) {
    errors.push('Invalid GSTIN format');
  }
  
  if (this.business.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.business.pan)) {
    errors.push('Invalid PAN format');
  }
  
  if (this.business.tan && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(this.business.tan)) {
    errors.push('Invalid TAN format');
  }
  
  if (this.business.cin && !/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(this.business.cin)) {
    errors.push('Invalid CIN format');
  }
  
  if (this.business.llpin && !/^[A-Z]{3}-[0-9]{4}$/.test(this.business.llpin)) {
    errors.push('Invalid LLPIN format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Pre-save middleware to validate business identifiers
FirmSchema.pre('save', function(next) {
  const validation = this.validateBusinessIdentifiers();
  if (!validation.isValid) {
    return next(new Error(`Business identifier validation failed: ${validation.errors.join(', ')}`));
  }
  next();
});

export default mongoose.model<IFirm>('Firm', FirmSchema);
