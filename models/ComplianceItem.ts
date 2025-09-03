import mongoose, { Schema, Document as MongooseDocument } from 'mongoose'

export interface IComplianceItem extends MongooseDocument {
  title: string
  description?: string
  complianceType: 'GST' | 'TDS' | 'ITR' | 'ROC' | 'AUDIT' | 'OTHER'
  
  // Client Association
  clientId: mongoose.Types.ObjectId
  firmId: mongoose.Types.ObjectId
  
  // Timeline & Deadlines
  financialYear: string
  assessmentYear?: string
  filingPeriod: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Monthly' | 'Annual' | 'Half-Yearly'
  dueDate: Date
  extendedDueDate?: Date
  actualFilingDate?: Date
  
  // Status & Progress
  status: 'pending' | 'in_progress' | 'filed' | 'approved' | 'rejected' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number // 0-100
  
  // Assignment & Responsibility
  assignedTo?: mongoose.Types.ObjectId
  assignedBy?: mongoose.Types.ObjectId
  assignedAt?: Date
  
  // Financial Details
  amount?: number
  taxAmount?: number
  penaltyAmount?: number
  interestAmount?: number
  
  // Filing Details
  acknowledgmentNumber?: string
  challanNumber?: string
  filingMode?: 'online' | 'offline' | 'manual'
  
  // Documents & Attachments
  requiredDocuments: string[]
  uploadedDocuments: mongoose.Types.ObjectId[]
  
  // Notes & Comments
  internalNotes?: string
  clientNotes?: string
  
  // Audit & Tracking
  createdBy: mongoose.Types.ObjectId
  lastModifiedBy?: mongoose.Types.ObjectId
  reminderSent: boolean
  lastReminderSent?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const ComplianceItemSchema = new Schema<IComplianceItem>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  complianceType: {
    type: String,
    required: true,
    enum: ['GST', 'TDS', 'ITR', 'ROC', 'AUDIT', 'OTHER'],
    default: 'OTHER'
  },
  
  // Client Association
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  
  // Timeline & Deadlines
  financialYear: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{4}-\d{4}$/.test(v) // Format: 2024-2025
      },
      message: 'Financial year must be in format YYYY-YYYY'
    }
  },
  assessmentYear: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^\d{4}-\d{4}$/.test(v)
      },
      message: 'Assessment year must be in format YYYY-YYYY'
    }
  },
  filingPeriod: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4', 'Monthly', 'Annual', 'Half-Yearly']
  },
  dueDate: {
    type: Date,
    required: true
  },
  extendedDueDate: Date,
  actualFilingDate: Date,
  
  // Status & Progress
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'filed', 'approved', 'rejected', 'overdue'],
    default: 'pending'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Assignment & Responsibility
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  
  // Financial Details
  amount: {
    type: Number,
    min: 0
  },
  taxAmount: {
    type: Number,
    min: 0
  },
  penaltyAmount: {
    type: Number,
    min: 0
  },
  interestAmount: {
    type: Number,
    min: 0
  },
  
  // Filing Details
  acknowledgmentNumber: {
    type: String,
    trim: true
  },
  challanNumber: {
    type: String,
    trim: true
  },
  filingMode: {
    type: String,
    enum: ['online', 'offline', 'manual']
  },
  
  // Documents & Attachments
  requiredDocuments: [{
    type: String,
    trim: true
  }],
  uploadedDocuments: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Notes & Comments
  internalNotes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  clientNotes: {
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
  reminderSent: {
    type: Boolean,
    default: false
  },
  lastReminderSent: Date
}, {
  timestamps: true
})

// Indexes for efficient querying
ComplianceItemSchema.index({ firmId: 1, clientId: 1 })
ComplianceItemSchema.index({ firmId: 1, complianceType: 1 })
ComplianceItemSchema.index({ firmId: 1, status: 1 })
ComplianceItemSchema.index({ firmId: 1, priority: 1 })
ComplianceItemSchema.index({ firmId: 1, dueDate: 1 })
ComplianceItemSchema.index({ firmId: 1, assignedTo: 1 })
ComplianceItemSchema.index({ firmId: 1, financialYear: 1 })
ComplianceItemSchema.index({ firmId: 1, filingPeriod: 1 })

// Virtual for days until due
ComplianceItemSchema.virtual('daysUntilDue').get(function() {
  const now = new Date()
  const due = this.dueDate
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for days overdue
ComplianceItemSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'filed' || this.status === 'approved') return 0
  
  const now = new Date()
  const due = this.dueDate
  const diffTime = now.getTime() - due.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
})

// Virtual for status color
ComplianceItemSchema.virtual('statusColor').get(function() {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    filed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.status] || colors.pending
})

// Virtual for priority color
ComplianceItemSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.priority] || colors.medium
})

// Method to check if overdue
ComplianceItemSchema.methods.isOverdue = function(): boolean {
  if (this.status === 'filed' || this.status === 'approved') return false
  return new Date() > this.dueDate
}

// Method to update progress
ComplianceItemSchema.methods.updateProgress = function(progress: number) {
  this.progress = Math.max(0, Math.min(100, progress))
  
  // Auto-update status based on progress
  if (this.progress === 0) {
    this.status = 'pending'
  } else if (this.progress < 100) {
    this.status = 'in_progress'
  } else {
    this.status = 'filed'
  }
  
  return this.save()
}

// Method to mark as filed
ComplianceItemSchema.methods.markAsFiled = function(filingDate?: Date) {
  this.status = 'filed'
  this.progress = 100
  this.actualFilingDate = filingDate || new Date()
  return this.save()
}

// Method to assign to user
ComplianceItemSchema.methods.assignTo = function(userId: string, assignedBy: string) {
  this.assignedTo = new mongoose.Types.ObjectId(userId)
  this.assignedBy = new mongoose.Types.ObjectId(assignedBy)
  this.assignedAt = new Date()
  return this.save()
}

// Pre-save middleware to update status based on due date
ComplianceItemSchema.pre('save', function(next) {
  if (this.isModified('dueDate') || this.isModified('status')) {
    const now = new Date()
    
    if (this.status !== 'filed' && this.status !== 'approved') {
      if (now > this.dueDate) {
        this.status = 'overdue'
      } else if (this.status === 'overdue' && now <= this.dueDate) {
        this.status = 'pending'
      }
    }
  }
  
  next()
})

export default mongoose.models.ComplianceItem || mongoose.model<IComplianceItem>('ComplianceItem', ComplianceItemSchema)
