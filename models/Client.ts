import mongoose, { Schema, Document as MongooseDocument } from 'mongoose'

export interface IClient extends MongooseDocument {
  name: string
  displayName?: string
  description?: string
  
  // Firm Association
  firmId: mongoose.Types.ObjectId
  
  // Client Type & Category
  clientType: 'individual' | 'company' | 'partnership' | 'llp' | 'trust' | 'other'
  industry?: string
  sector?: string
  
  // Contact Information
  primaryContact: {
    name: string
    email: string
    phone?: string
    designation?: string
  }
  secondaryContacts: {
    name: string
    email: string
    phone?: string
    designation?: string
  }[]
  
  // Address Information
  billingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  
  // Indian Business Identifiers
  gstin?: string
  pan?: string
  tan?: string
  cin?: string
  llpin?: string
  
  // Financial Information
  annualRevenue?: number
  employeeCount?: number
  currency: string
  paymentTerms?: string
  creditLimit?: number
  
  // Business Details
  businessNature?: string
  registrationDate?: Date
  fiscalYearEnd?: string
  
  // Client Status & Relationship
  status: 'active' | 'inactive' | 'prospect' | 'former'
  relationshipStartDate?: Date
  relationshipEndDate?: Date
  source?: string
  
  // Service Areas
  services: string[]
  complianceTypes: string[]
  
  // Risk Assessment
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskFactors?: string[]
  
  // Communication Preferences
  preferredContactMethod: 'email' | 'phone' | 'sms' | 'whatsapp'
  preferredLanguage: 'english' | 'hindi' | 'gujarati' | 'marathi' | 'other'
  timezone?: string
  
  // Notes & History
  notes?: string
  internalNotes?: string
  
  // Audit & Tracking
  createdBy: mongoose.Types.ObjectId
  lastModifiedBy?: mongoose.Types.ObjectId
  lastContactDate?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const ClientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Firm Association
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  
  // Client Type & Category
  clientType: {
    type: String,
    required: true,
    enum: ['individual', 'company', 'partnership', 'llp', 'trust', 'other'],
    default: 'company'
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 100
  },
  sector: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Contact Information
  primaryContact: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  secondaryContacts: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100
    }
  }],
  
  // Address Information
  billingAddress: {
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
      maxlength: 100
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    }
  },
  shippingAddress: {
    street: {
      type: String,
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: 20
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  
  // Indian Business Identifiers
  gstin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v)
      },
      message: 'Invalid GSTIN format'
    }
  },
  pan: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)
      },
      message: 'Invalid PAN format'
    }
  },
  tan: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(v)
      },
      message: 'Invalid TAN format'
    }
  },
  cin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v)
      },
      message: 'Invalid CIN format'
    }
  },
  llpin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^[A-Z]{3}-[0-9]{4}$/.test(v)
      },
      message: 'Invalid LLPIN format'
    }
  },
  
  // Financial Information
  annualRevenue: {
    type: Number,
    min: 0
  },
  employeeCount: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentTerms: {
    type: String,
    trim: true,
    maxlength: 100
  },
  creditLimit: {
    type: Number,
    min: 0
  },
  
  // Business Details
  businessNature: {
    type: String,
    trim: true,
    maxlength: 200
  },
  registrationDate: Date,
  fiscalYearEnd: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^(0[1-9]|[12][0-9]|3[01])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/.test(v)
      },
      message: 'Fiscal year end must be in format DD-MMM (e.g., 31-Mar)'
    }
  },
  
  // Client Status & Relationship
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'prospect', 'former'],
    default: 'active'
  },
  relationshipStartDate: Date,
  relationshipEndDate: Date,
  source: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Service Areas
  services: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  complianceTypes: [{
    type: String,
    enum: ['GST', 'TDS', 'ITR', 'ROC', 'AUDIT', 'TDS', 'OTHER'],
    maxlength: 50
  }],
  
  // Risk Assessment
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  riskFactors: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  
  // Communication Preferences
  preferredContactMethod: {
    type: String,
    required: true,
    enum: ['email', 'phone', 'sms', 'whatsapp'],
    default: 'email'
  },
  preferredLanguage: {
    type: String,
    required: true,
    enum: ['english', 'hindi', 'gujarati', 'marathi', 'other'],
    default: 'english'
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Notes & History
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  // Audit & Tracking
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastContactDate: Date
}, {
  timestamps: true
})

// Indexes for efficient querying
ClientSchema.index({ firmId: 1, name: 1 })
ClientSchema.index({ firmId: 1, clientType: 1 })
ClientSchema.index({ firmId: 1, status: 1 })
ClientSchema.index({ firmId: 1, industry: 1 })
ClientSchema.index({ firmId: 1, riskLevel: 1 })
ClientSchema.index({ firmId: 1, 'primaryContact.email': 1 })
ClientSchema.index({ firmId: 1, gstin: 1 })
ClientSchema.index({ firmId: 1, pan: 1 })
ClientSchema.index({ firmId: 1, createdAt: 1 })

// Virtual for full address
ClientSchema.virtual('billingAddressFull').get(function() {
  const addr = this.billingAddress
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
})

ClientSchema.virtual('shippingAddressFull').get(function() {
  if (!this.shippingAddress) return null
  const addr = this.shippingAddress
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`
})

// Virtual for client status color
ClientSchema.virtual('statusColor').get(function() {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    prospect: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    former: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.status] || colors.active
})

// Virtual for risk level color
ClientSchema.virtual('riskLevelColor').get(function() {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.riskLevel] || colors.medium
})

// Virtual for client type color
ClientSchema.virtual('clientTypeColor').get(function() {
  const colors = {
    individual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    company: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    partnership: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    llp: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    trust: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[this.clientType] || colors.other
})

// Virtual for relationship duration
ClientSchema.virtual('relationshipDuration').get(function() {
  if (!this.relationshipStartDate) return null
  
  const start = new Date(this.relationshipStartDate)
  const end = this.relationshipEndDate ? new Date(this.relationshipEndDate) : new Date()
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 365) {
    return `${diffDays} days`
  } else {
    const years = Math.floor(diffDays / 365)
    const remainingDays = diffDays % 365
    if (remainingDays === 0) {
      return `${years} year${years > 1 ? 's' : ''}`
    } else {
      return `${years} year${years > 1 ? 's' : ''} ${remainingDays} days`
    }
  }
})

// Virtual for days since last contact
ClientSchema.virtual('daysSinceLastContact').get(function() {
  if (!this.lastContactDate) return null
  
  const now = new Date()
  const lastContact = new Date(this.lastContactDate)
  const diffTime = Math.abs(now.getTime() - lastContact.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Method to check if client is active
ClientSchema.methods.isActive = function(): boolean {
  return this.status === 'active'
}

// Method to check if client is a prospect
ClientSchema.methods.isProspect = function(): boolean {
  return this.status === 'prospect'
}

// Method to check if client has valid business identifiers
ClientSchema.methods.hasValidIdentifiers = function(): boolean {
  return !!(this.gstin || this.pan || this.tan || this.cin || this.llpin)
}

// Method to get primary contact info
ClientSchema.methods.getPrimaryContact = function() {
  return {
    name: this.primaryContact.name,
    email: this.primaryContact.email,
    phone: this.primaryContact.phone,
    designation: this.primaryContact.designation
  }
}

// Method to add secondary contact
ClientSchema.methods.addSecondaryContact = function(contact: {
  name: string
  email: string
  phone?: string
  designation?: string
}) {
  this.secondaryContacts.push(contact)
  return this.save()
}

// Method to remove secondary contact
ClientSchema.methods.removeSecondaryContact = function(email: string) {
  this.secondaryContacts = this.secondaryContacts.filter(contact => contact.email !== email)
  return this.save()
}

// Method to update last contact date
ClientSchema.methods.updateLastContactDate = function() {
  this.lastContactDate = new Date()
  return this.save()
}

// Method to calculate client value score
ClientSchema.methods.getClientValueScore = function(): number {
  let score = 0
  
  // Status score
  if (this.status === 'active') score += 30
  else if (this.status === 'prospect') score += 20
  else if (this.status === 'inactive') score += 10
  
  // Risk level score
  if (this.riskLevel === 'low') score += 25
  else if (this.riskLevel === 'medium') score += 20
  else if (this.riskLevel === 'high') score += 15
  else if (this.riskLevel === 'critical') score += 10
  
  // Business identifiers score
  if (this.hasValidIdentifiers()) score += 15
  
  // Revenue score
  if (this.annualRevenue) {
    if (this.annualRevenue > 10000000) score += 20 // > 1 crore
    else if (this.annualRevenue > 1000000) score += 15 // > 10 lakhs
    else if (this.annualRevenue > 100000) score += 10 // > 1 lakh
    else score += 5
  }
  
  // Relationship duration score
  const duration = this.relationshipDuration
  if (duration && duration.includes('year')) {
    const years = parseInt(duration.split(' ')[0])
    if (years >= 5) score += 10
    else if (years >= 3) score += 8
    else if (years >= 1) score += 5
  }
  
  return Math.min(100, score)
}

// Pre-save middleware to validate business identifiers
ClientSchema.pre('save', function(next) {
  // Validate GSTIN if provided
  if (this.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(this.gstin)) {
    return next(new Error('Invalid GSTIN format'))
  }
  
  // Validate PAN if provided
  if (this.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(this.pan)) {
    return next(new Error('Invalid PAN format'))
  }
  
  // Validate TAN if provided
  if (this.tan && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(this.tan)) {
    return next(new Error('Invalid TAN format'))
  }
  
  // Validate CIN if provided
  if (this.cin && !/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(this.cin)) {
    return next(new Error('Invalid CIN format'))
  }
  
  // Validate LLPIN if provided
  if (this.llpin && !/^[A-Z]{3}-[0-9]{4}$/.test(this.llpin)) {
    return next(new Error('Invalid LLPIN format'))
  }
  
  next()
})

// Pre-save middleware to validate dates
ClientSchema.pre('save', function(next) {
  if (this.relationshipStartDate && this.relationshipEndDate && 
      this.relationshipStartDate >= this.relationshipEndDate) {
    return next(new Error('Relationship start date must be before end date'))
  }
  next()
})

export default mongoose.model<IClient>('Client', ClientSchema)
