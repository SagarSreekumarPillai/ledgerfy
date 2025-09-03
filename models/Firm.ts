// FILE: /models/Firm.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IFirm extends Document {
  name: string
  legalName: string
  registrationNumber: string
  taxId: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  contact: {
    email: string
    phone: string
    website?: string
  }
  industry: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise' | 'custom'
    status: 'active' | 'suspended' | 'cancelled'
    startDate: Date
    endDate: Date
    features: string[]
  }
  settings: {
    currency: string
    timezone: string
    language: string
    dateFormat: string
    numberFormat: string
    fiscalYearStart: string
    workingDays: number[]
    workingHours: {
      start: string
      end: string
    }
  }
  integrations: {
    tally: boolean
    zoho: boolean
    quickbooks: boolean
    xero: boolean
    custom: string[]
  }
  isActive: boolean
  createdBy?: mongoose.Types.ObjectId
  updatedBy?: mongoose.Types.ObjectId
}

const firmSchema = new Schema<IFirm>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  legalName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  registrationNumber: {
    type: String,
    trim: true,
    maxlength: 100
  },
  taxId: {
    type: String,
    trim: true,
    maxlength: 100
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    }
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    default: 'medium'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'professional', 'enterprise', 'custom'],
      default: 'basic'
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    features: [String]
  },
  settings: {
    currency: {
      type: String,
      default: 'INR'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    language: {
      type: String,
      default: 'en'
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    numberFormat: {
      type: String,
      default: 'Indian'
    },
    fiscalYearStart: {
      type: String,
      default: '01/04'
    },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5] // Monday to Friday
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '18:00'
      }
    }
  },
  integrations: {
    tally: {
      type: Boolean,
      default: false
    },
    zoho: {
      type: Boolean,
      default: false
    },
    quickbooks: {
      type: Boolean,
      default: false
    },
    xero: {
      type: Boolean,
      default: false
    },
    custom: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes for performance
firmSchema.index({ name: 1 })
firmSchema.index({ 'contact.email': 1 })
firmSchema.index({ isActive: 1 })

// Use Mongoose's built-in model caching
export default mongoose.models.Firm || mongoose.model<IFirm>('Firm', firmSchema)
