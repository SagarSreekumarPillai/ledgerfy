import mongoose, { Schema, Document as MongooseDocument } from 'mongoose'

export interface IProject extends MongooseDocument {
  name: string
  description?: string
  projectType: 'compliance' | 'audit' | 'consulting' | 'tax' | 'other'
  
  // Client Association
  clientId: mongoose.Types.ObjectId
  firmId: mongoose.Types.ObjectId
  
  // Timeline & Deadlines
  startDate: Date
  endDate: Date
  actualStartDate?: Date
  actualEndDate?: Date
  
  // Status & Progress
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number // 0-100
  
  // Team & Assignment
  projectManager: mongoose.Types.ObjectId
  teamMembers: mongoose.Types.ObjectId[]
  assignedBy?: mongoose.Types.ObjectId
  assignedAt?: Date
  
  // Financial Details
  budget?: number
  actualCost?: number
  estimatedHours?: number
  actualHours?: number
  billingRate?: number
  currency: string
  
  // Project Details
  objectives?: string[]
  deliverables?: string[]
  risks?: string[]
  assumptions?: string[]
  
  // Milestones & Tasks
  milestones: {
    title: string
    description?: string
    dueDate: Date
    completedAt?: Date
    status: 'pending' | 'completed' | 'overdue'
  }[]
  
  // Documents & Attachments
  documents: mongoose.Types.ObjectId[]
  templates: mongoose.Types.ObjectId[]
  
  // Notes & Comments
  internalNotes?: string
  clientNotes?: string
  
  // Audit & Tracking
  createdBy: mongoose.Types.ObjectId
  lastModifiedBy?: mongoose.Types.ObjectId
  lastActivityAt?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
  name: {
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
  projectType: {
    type: String,
    required: true,
    enum: ['compliance', 'audit', 'consulting', 'tax', 'other'],
    default: 'other'
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  actualStartDate: Date,
  actualEndDate: Date,
  
  // Status & Progress
  status: {
    type: String,
    required: true,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
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
  
  // Team & Assignment
  projectManager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  
  // Financial Details
  budget: {
    type: Number,
    min: 0
  },
  actualCost: {
    type: Number,
    min: 0
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  billingRate: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Project Details
  objectives: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  deliverables: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  risks: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  assumptions: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  
  // Milestones & Tasks
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    dueDate: {
      type: Date,
      required: true
    },
    completedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    }
  }],
  
  // Documents & Attachments
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  templates: [{
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
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for efficient querying
ProjectSchema.index({ firmId: 1, clientId: 1 })
ProjectSchema.index({ firmId: 1, projectType: 1 })
ProjectSchema.index({ firmId: 1, status: 1 })
ProjectSchema.index({ firmId: 1, priority: 1 })
ProjectSchema.index({ firmId: 1, projectManager: 1 })
ProjectSchema.index({ firmId: 1, teamMembers: 1 })
ProjectSchema.index({ firmId: 1, startDate: 1 })
ProjectSchema.index({ firmId: 1, endDate: 1 })
ProjectSchema.index({ firmId: 1, progress: 1 })

// Virtual for project duration in days
ProjectSchema.virtual('durationDays').get(function() {
  const start = new Date(this.startDate)
  const end = new Date(this.endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for days until start
ProjectSchema.virtual('daysUntilStart').get(function() {
  const now = new Date()
  const start = new Date(this.startDate)
  const diffTime = start.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for days until end
ProjectSchema.virtual('daysUntilEnd').get(function() {
  const now = new Date()
  const end = new Date(this.endDate)
  const diffTime = end.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for project status color
ProjectSchema.virtual('statusColor').get(function() {
  const colors = {
    planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.status] || colors.planning
})

// Virtual for priority color
ProjectSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.priority] || colors.medium
})

// Virtual for project type color
ProjectSchema.virtual('projectTypeColor').get(function() {
  const colors = {
    compliance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    audit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    consulting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    tax: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[this.projectType] || colors.other
})

// Virtual for budget variance
ProjectSchema.virtual('budgetVariance').get(function() {
  if (!this.budget || !this.actualCost) return 0
  return this.budget - this.actualCost
})

// Virtual for budget variance percentage
ProjectSchema.virtual('budgetVariancePercentage').get(function() {
  if (!this.budget || !this.actualCost) return 0
  return ((this.budget - this.actualCost) / this.budget) * 100
})

// Virtual for time efficiency
ProjectSchema.virtual('timeEfficiency').get(function() {
  if (!this.estimatedHours || !this.actualHours) return 0
  return (this.estimatedHours / this.actualHours) * 100
})

// Method to check if project is overdue
ProjectSchema.methods.isOverdue = function(): boolean {
  if (this.status === 'completed' || this.status === 'cancelled') return false
  return new Date() > this.endDate
}

// Method to check if project is starting soon
ProjectSchema.methods.isStartingSoon = function(days: number = 7): boolean {
  if (this.status !== 'planning') return false
  const now = new Date()
  const start = new Date(this.startDate)
  const diffTime = start.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays >= 0
}

// Method to update progress
ProjectSchema.methods.updateProgress = function(progress: number) {
  this.progress = Math.max(0, Math.min(100, progress))
  
  // Auto-update status based on progress
  if (this.progress === 0) {
    this.status = 'planning'
  } else if (this.progress < 100) {
    this.status = 'active'
  } else {
    this.status = 'completed'
    this.actualEndDate = new Date()
  }
  
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to add team member
ProjectSchema.methods.addTeamMember = function(userId: string) {
  if (!this.teamMembers.includes(userId)) {
    this.teamMembers.push(new mongoose.Types.ObjectId(userId))
    this.lastActivityAt = new Date()
    return this.save()
  }
  return this
}

// Method to remove team member
ProjectSchema.methods.removeTeamMember = function(userId: string) {
  this.teamMembers = this.teamMembers.filter((id: any) => id.toString() !== userId)
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to add milestone
ProjectSchema.methods.addMilestone = function(milestone: {
  title: string
  description?: string
  dueDate: Date
}) {
  this.milestones.push({
    ...milestone,
    status: 'pending'
  })
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to complete milestone
ProjectSchema.methods.completeMilestone = function(milestoneIndex: number) {
  if (this.milestones[milestoneIndex]) {
    this.milestones[milestoneIndex].status = 'completed'
    this.milestones[milestoneIndex].completedAt = new Date()
    this.lastActivityAt = new Date()
    return this.save()
  }
  return this
}

// Method to calculate project health
ProjectSchema.methods.getProjectHealth = function(): 'excellent' | 'good' | 'warning' | 'critical' {
  const now = new Date()
  const end = new Date(this.endDate)
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  // Check if overdue
  if (daysLeft < 0) return 'critical'
  
  // Check progress vs time
  const timeProgress = Math.max(0, Math.min(100, ((this.durationDays - daysLeft) / this.durationDays) * 100))
  const progressGap = this.progress - timeProgress
  
  if (progressGap >= 20) return 'excellent'
  if (progressGap >= 0) return 'good'
  if (progressGap >= -20) return 'warning'
  return 'critical'
}

// Pre-save middleware to update lastActivityAt
ProjectSchema.pre('save', function(next) {
  this.lastActivityAt = new Date()
  next()
})

// Pre-save middleware to validate dates
ProjectSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('Start date must be before end date'))
  }
  next()
})

// Pre-save middleware to update milestone statuses
ProjectSchema.pre('save', function(next) {
  if (this.isModified('milestones')) {
    const now = new Date()
    this.milestones.forEach(milestone => {
      if (milestone.status === 'pending' && now > milestone.dueDate) {
        milestone.status = 'overdue'
      }
    })
  }
  next()
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
