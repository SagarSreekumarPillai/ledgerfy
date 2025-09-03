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
    required: true,
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

// Virtuals
TaskSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

TaskSchema.virtual('daysOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return 0
  
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = now.getTime() - due.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
})

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

TaskSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.priority] || colors.medium
})

TaskSchema.virtual('complexityColor').get(function() {
  const colors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[this.complexity] || colors.medium
})

TaskSchema.virtual('timeEfficiency').get(function() {
  if (!this.estimatedHours || !this.actualHours) return null
  return (this.estimatedHours / this.actualHours) * 100
})

TaskSchema.virtual('totalTimeSpentHours').get(function() {
  return this.timeSpent / 60
})

// Methods
TaskSchema.methods.isOverdue = function(): boolean {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return false
  return new Date() > this.dueDate
}

TaskSchema.methods.isDueSoon = function(days: number = 3): boolean {
  if (!this.dueDate || this.status === 'completed' || this.status === 'cancelled') return false
  
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= days && diffDays >= 0
}

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

TaskSchema.methods.assignTo = function(userId: string, assignedBy: string) {
  this.assignedTo = new mongoose.Types.ObjectId(userId)
  this.assignedBy = new mongoose.Types.ObjectId(assignedBy)
  this.assignedAt = new Date()
  this.lastActivityAt = new Date()
  return this.save()
}

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

TaskSchema.methods.stopTimeTracking = function(userId: string) {
  const lastEntry = this.timeEntries[this.timeEntries.length - 1]
  
  if (lastEntry && !lastEntry.endTime) {
    lastEntry.endTime = new Date()
    lastEntry.duration = Math.round((lastEntry.endTime.getTime() - lastEntry.startTime.getTime()) / (1000 * 60))
    this.timeSpent += lastEntry.duration
    this.lastActivityAt = new Date()
    return this.save()
  }
  
  return Promise.resolve(this)
}

TaskSchema.methods.addDependency = function(taskId: string) {
  if (!this.dependencies.includes(taskId)) {
    this.dependencies.push(new mongoose.Types.ObjectId(taskId))
    this.lastActivityAt = new Date()
    return this.save()
  }
  return Promise.resolve(this)
}

TaskSchema.methods.removeDependency = function(taskId: string) {
  this.dependencies = this.dependencies.filter((id: any) => id.toString() !== taskId)
  this.lastActivityAt = new Date()
  return this.save()
}

TaskSchema.methods.addSubtask = function(taskId: string) {
  if (!this.subtasks.includes(taskId)) {
    this.subtasks.push(new mongoose.Types.ObjectId(taskId))
    this.lastActivityAt = new Date()
    return this.save()
  }
  return Promise.resolve(this)
}

TaskSchema.methods.removeSubtask = function(taskId: string) {
  this.subtasks = this.subtasks.filter((id: any) => id.toString() !== taskId)
  this.lastActivityAt = new Date()
  return this.save()
}

TaskSchema.methods.getTaskHealth = function(): 'excellent' | 'good' | 'warning' | 'critical' {
  if (this.status === 'completed') return 'excellent'
  
  const now = new Date()
  const dueDate = this.dueDate
  
  if (!dueDate) return 'good'
  
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDue < 0) return 'critical'
  if (daysUntilDue <= 3) return 'warning'
  if (daysUntilDue <= 7) return 'good'
  
  return 'excellent'
}

// Pre-save middleware
TaskSchema.pre('save', function(next) {
  this.lastActivityAt = new Date()
  next()
})

TaskSchema.pre('save', function(next) {
  if (this.isModified('progress')) {
    this.lastActivityAt = new Date()
  }
  next()
})

TaskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastActivityAt = new Date()
  }
  next()
})

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)
