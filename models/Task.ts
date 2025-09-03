import mongoose, { Schema, Document as MongooseDocument } from 'mongoose'

export interface ITask extends MongooseDocument {
  title: string
  description?: string
  taskType: 'development' | 'design' | 'research' | 'review' | 'meeting' | 'other'
  
  // Project Association
  projectId?: mongoose.Types.ObjectId
  firmId: mongoose.Types.ObjectId
  
  // Assignment & Responsibility
  assignedTo?: mongoose.Types.ObjectId
  assignedBy?: mongoose.Types.ObjectId
  assignedAt?: Date
  
  // Status & Progress
  status: 'todo' | 'in_progress' | 'review' | 'testing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number // 0-100
  
  // Timeline & Deadlines
  dueDate?: Date
  startDate?: Date
  estimatedHours?: number
  actualHours?: number
  timeSpent: number // in minutes
  
  // Dependencies & Relationships
  dependencies: mongoose.Types.ObjectId[]
  blockedBy: mongoose.Types.ObjectId[]
  subtasks: mongoose.Types.ObjectId[]
  parentTask?: mongoose.Types.ObjectId
  
  // Task Details
  tags: string[]
  category?: string
  complexity: 'low' | 'medium' | 'high' | 'expert'
  
  // Attachments & References
  attachments: mongoose.Types.ObjectId[]
  relatedDocuments: mongoose.Types.ObjectId[]
  
  // Notes & Comments
  notes?: string
  internalNotes?: string
  
  // Time Tracking
  timeEntries: {
    startTime: Date
    endTime?: Date
    duration: number // in minutes
    description?: string
    userId: mongoose.Types.ObjectId
  }[]
  
  // Audit & Tracking
  createdBy: mongoose.Types.ObjectId
  lastModifiedBy?: mongoose.Types.ObjectId
  lastActivityAt?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>({
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
  taskType: {
    type: String,
    required: true,
    enum: ['development', 'design', 'research', 'review', 'meeting', 'other'],
    default: 'other'
  },
  
  // Project Association
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
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
  
  // Status & Progress
  status: {
    type: String,
    required: true,
    enum: ['todo', 'in_progress', 'review', 'testing', 'completed', 'cancelled'],
    default: 'todo'
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
  
  // Timeline & Deadlines
  dueDate: Date,
  startDate: Date,
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Dependencies & Relationships
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  blockedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  subtasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  parentTask: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  },
  
  // Task Details
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  complexity: {
    type: String,
    enum: ['low', 'medium', 'high', 'expert'],
    default: 'medium'
  },
  
  // Attachments & References
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  relatedDocuments: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Notes & Comments
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
  
  // Time Tracking
  timeEntries: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    duration: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
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
TaskSchema.index({ firmId: 1, projectId: 1 })
TaskSchema.index({ firmId: 1, assignedTo: 1 })
TaskSchema.index({ firmId: 1, status: 1 })
TaskSchema.index({ firmId: 1, priority: 1 })
TaskSchema.index({ firmId: 1, dueDate: 1 })
TaskSchema.index({ firmId: 1, taskType: 1 })
TaskSchema.index({ firmId: 1, complexity: 1 })
TaskSchema.index({ 'timeEntries.userId': 1 })

// Virtual for days until due
TaskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for days overdue
TaskSchema.virtual('daysOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return 0
  
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = now.getTime() - due.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

// Virtual for task status color
TaskSchema.virtual('statusColor').get(function() {
  const colors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    testing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.status] || colors.todo
})

// Virtual for priority color
TaskSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.priority] || colors.medium
})

// Virtual for complexity color
TaskSchema.virtual('complexityColor').get(function() {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.complexity] || colors.medium
})

// Virtual for time efficiency
TaskSchema.virtual('timeEfficiency').get(function() {
  if (!this.estimatedHours || !this.actualHours) return null
  return (this.estimatedHours / this.actualHours) * 100
})

// Virtual for total time spent in hours
TaskSchema.virtual('totalTimeSpentHours').get(function() {
  return this.timeSpent / 60
})

// Method to check if task is overdue
TaskSchema.methods.isOverdue = function(): boolean {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return false
  return new Date() > this.dueDate
}

// Method to check if task is due soon
TaskSchema.methods.isDueSoon = function(days: number = 3): boolean {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return false
  
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= days && diffDays >= 0
}

// Method to update progress
TaskSchema.methods.updateProgress = function(progress: number) {
  this.progress = Math.max(0, Math.min(100, progress))
  
  // Auto-update status based on progress
  if (this.progress === 0) {
    this.status = 'todo'
  } else if (this.progress < 100) {
    this.status = 'in_progress'
  } else {
    this.status = 'completed'
  }
  
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to assign task
TaskSchema.methods.assignTo = function(userId: string, assignedBy: string) {
  this.assignedTo = new mongoose.Types.ObjectId(userId)
  this.assignedBy = new mongoose.Types.ObjectId(assignedBy)
  this.assignedAt = new Date()
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to start time tracking
TaskSchema.methods.startTimeTracking = function(userId: string, description?: string) {
  const timeEntry = {
    startTime: new Date(),
    duration: 0,
    description,
    userId: new mongoose.Types.ObjectId(userId)
  }
  
  this.timeEntries.push(timeEntry)
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to stop time tracking
TaskSchema.methods.stopTimeTracking = function(userId: string) {
  const timeEntry = this.timeEntries.find(entry => 
    entry.userId.toString() === userId && !entry.endTime
  )
  
  if (timeEntry) {
    timeEntry.endTime = new Date()
    timeEntry.duration = Math.round((timeEntry.endTime.getTime() - timeEntry.startTime.getTime()) / (1000 * 60))
    
    // Update total time spent
    this.timeSpent += timeEntry.duration
    if (this.actualHours) {
      this.actualHours = this.timeSpent / 60
    }
    
    this.lastActivityAt = new Date()
    return this.save()
  }
  
  return this
}

// Method to add dependency
TaskSchema.methods.addDependency = function(taskId: string) {
  if (!this.dependencies.includes(taskId)) {
    this.dependencies.push(new mongoose.Types.ObjectId(taskId))
    this.lastActivityAt = new Date()
    return this.save()
  }
  return this
}

// Method to remove dependency
TaskSchema.methods.removeDependency = function(taskId: string) {
  this.dependencies = this.dependencies.filter(id => id.toString() !== taskId)
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to add subtask
TaskSchema.methods.addSubtask = function(taskId: string) {
  if (!this.subtasks.includes(taskId)) {
    this.subtasks.push(new mongoose.Types.ObjectId(taskId))
    this.lastActivityAt = new Date()
    return this.save()
  }
  return this
}

// Method to remove subtask
TaskSchema.methods.removeSubtask = function(taskId: string) {
  this.subtasks = this.subtasks.filter(id => id.toString() !== taskId)
  this.lastActivityAt = new Date()
  return this.save()
}

// Method to calculate task health
TaskSchema.methods.getTaskHealth = function(): 'excellent' | 'good' | 'warning' | 'critical' {
  if (this.status === 'completed' || this.status === 'cancelled') return 'excellent'
  
  const daysUntilDue = this.daysUntilDue
  if (daysUntilDue === null) return 'good'
  
  if (daysUntilDue < 0) return 'critical'
  if (daysUntilDue <= 1) return 'critical'
  if (daysUntilDue <= 3) return 'warning'
  
  // Check progress vs time
  if (this.dueDate && this.startDate) {
    const totalDuration = Math.ceil((this.dueDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const elapsed = Math.ceil((new Date().getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24))
    const timeProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
    const progressGap = this.progress - timeProgress
    
    if (progressGap >= 20) return 'excellent'
    if (progressGap >= 0) return 'good'
    if (progressGap >= -20) return 'warning'
    return 'critical'
  }
  
  return 'good'
}

// Pre-save middleware to update lastActivityAt
TaskSchema.pre('save', function(next) {
  this.lastActivityAt = new Date()
  next()
})

// Pre-save middleware to validate dates
TaskSchema.pre('save', function(next) {
  if (this.startDate && this.dueDate && this.startDate >= this.dueDate) {
    return next(new Error('Start date must be before due date'))
  }
  next()
})

// Pre-save middleware to update status based on progress
TaskSchema.pre('save', function(next) {
  if (this.isModified('progress')) {
    if (this.progress === 0) {
      this.status = 'todo'
    } else if (this.progress < 100) {
      this.status = 'in_progress'
    } else {
      this.status = 'completed'
    }
  }
  next()
})

export default mongoose.model<ITask>('Task', TaskSchema)
