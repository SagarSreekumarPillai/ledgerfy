import mongoose, { Schema, Document as MongooseDocument } from 'mongoose'

export interface IDocument extends MongooseDocument {
  title: string
  description?: string
  fileName: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
  fileExtension: string
  
  // Metadata
  category: string
  tags: string[]
  clientId?: mongoose.Types.ObjectId
  projectId?: mongoose.Types.ObjectId
  complianceId?: mongoose.Types.ObjectId
  
  // Access Control
  firmId: mongoose.Types.ObjectId
  uploadedBy: mongoose.Types.ObjectId
  sharedWith: {
    userId: mongoose.Types.ObjectId
    roleId: mongoose.Types.ObjectId
    permissions: string[]
    expiresAt?: Date
  }[]
  
  // Document Properties
  isPublic: boolean
  isArchived: boolean
  isTemplate: boolean
  version: number
  previousVersions: mongoose.Types.ObjectId[]
  
  // Enhanced Versioning (Blueprint requirement)
  parentFileId?: mongoose.Types.ObjectId
  changedBy?: mongoose.Types.ObjectId
  changeNotes?: string
  isLatestVersion: boolean
  
  // Audit & Tracking
  downloadCount: number
  lastAccessedAt?: Date
  lastModifiedAt: Date
  
  // Indian Business Context
  financialYear?: string
  assessmentYear?: string
  documentType: 'GST' | 'TDS' | 'ITR' | 'ROC' | 'AUDIT' | 'OTHER'
  filingPeriod?: string
  dueDate?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // Methods
  hasUserPermission(userId: string, permission: string): boolean
  hasRolePermission(roleId: string, permission: string): boolean
  addSharing(userId: string, roleId: string, permissions: string[], expiresAt?: Date): Promise<IDocument>
  removeSharing(userId: string, roleId: string): Promise<IDocument>
  createNewVersion(newFilePath: string, newFileName: string, changedBy: mongoose.Types.ObjectId, changeNotes?: string): Promise<IDocument>
  getVersionHistory(): Promise<IDocument[]>
  restoreToVersion(versionId: string, restoredBy: mongoose.Types.ObjectId): Promise<IDocument>
  hasVersions(): boolean
}

const DocumentSchema = new Schema<IDocument>({
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
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true,
    min: 0
  },
  mimeType: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  
  // Metadata
  category: {
    type: String,
    required: true,
    enum: ['compliance', 'client', 'project', 'internal', 'template', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  complianceId: {
    type: Schema.Types.ObjectId,
    ref: 'ComplianceItem'
  },
  
  // Access Control
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true,
    index: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    permissions: [{
      type: String,
      enum: ['read', 'download', 'edit', 'share', 'delete']
    }],
    expiresAt: Date
  }],
  
  // Document Properties
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  previousVersions: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  // Enhanced Versioning (Blueprint requirement)
  parentFileId: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  changeNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  
  // Audit & Tracking
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAccessedAt: Date,
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  
  // Indian Business Context
  financialYear: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
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
        return /^\d{4}-\d{4}$/.test(v) // Format: 2024-2025
      },
      message: 'Assessment year must be in format YYYY-YYYY'
    }
  },
  documentType: {
    type: String,
    required: true,
    enum: ['GST', 'TDS', 'ITR', 'ROC', 'AUDIT', 'OTHER'],
    default: 'OTHER'
  },
  filingPeriod: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true
        return /^(Q[1-4]|Monthly|Annual)$/.test(v)
      },
      message: 'Filing period must be Q1, Q2, Q3, Q4, Monthly, or Annual'
    }
  },
  dueDate: Date
}, {
  timestamps: true
})

// Indexes for efficient querying
DocumentSchema.index({ firmId: 1, category: 1 })
DocumentSchema.index({ firmId: 1, clientId: 1 })
DocumentSchema.index({ firmId: 1, projectId: 1 })
DocumentSchema.index({ firmId: 1, uploadedBy: 1 })
DocumentSchema.index({ firmId: 1, documentType: 1 })
DocumentSchema.index({ firmId: 1, tags: 1 })
DocumentSchema.index({ firmId: 1, isArchived: 1 })
DocumentSchema.index({ firmId: 1, isTemplate: 1 })
DocumentSchema.index({ 'sharedWith.userId': 1 })
DocumentSchema.index({ 'sharedWith.roleId': 1 })
DocumentSchema.index({ dueDate: 1 })
DocumentSchema.index({ createdAt: 1 })

// Enhanced versioning indexes
DocumentSchema.index({ parentFileId: 1 })
DocumentSchema.index({ firmId: 1, isLatestVersion: 1 })
DocumentSchema.index({ firmId: 1, version: 1 })

// Virtual for full file name
DocumentSchema.virtual('fullFileName').get(function() {
  return `${this.fileName}.${this.fileExtension}`
})

// Virtual for file size in human readable format
DocumentSchema.virtual('fileSizeFormatted').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (this.fileSize === 0) return '0 Bytes'
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024))
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
})

// Virtual for document age
DocumentSchema.virtual('ageInDays').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now.getTime() - created.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Virtual for version history
DocumentSchema.virtual('hasVersionHistory').get(function() {
  return this.previousVersions.length > 0 || this.parentFileId
})

// Method to check if user has permission
DocumentSchema.methods.hasUserPermission = function(userId: string, permission: string): boolean {
  // Check if user is the uploader
  if (this.uploadedBy.toString() === userId) {
    return true
  }
  
  // Check if document is public
  if (this.isPublic) {
    return permission === 'read' || permission === 'download'
  }
  
  // Check shared permissions
  const sharedAccess = this.sharedWith.find((share: any) => 
    share.userId.toString() === userId
  )
  
  if (sharedAccess) {
    return sharedAccess.permissions.includes(permission)
  }
  
  return false
}

// Method to check if role has permission
DocumentSchema.methods.hasRolePermission = function(roleId: string, permission: string): boolean {
  // Check shared permissions by role
  const sharedAccess = this.sharedWith.find((share: any) => 
    share.roleId.toString() === roleId
  )
  
  if (sharedAccess) {
    return sharedAccess.permissions.includes(permission)
  }
  
  return false
}

// Method to add sharing
DocumentSchema.methods.addSharing = function(userId: string, roleId: string, permissions: string[], expiresAt?: Date) {
  const existingShare = this.sharedWith.find((share: any) => 
    share.userId.toString() === userId && share.roleId.toString() === roleId
  )
  
  if (existingShare) {
    // Update existing share
    existingShare.permissions = permissions
    if (expiresAt) existingShare.expiresAt = expiresAt
  } else {
    // Add new share
    this.sharedWith.push({
      userId: new mongoose.Types.ObjectId(userId),
      roleId: new mongoose.Types.ObjectId(roleId),
      permissions,
      expiresAt
    })
  }
  
  return this.save()
}

// Method to remove sharing
DocumentSchema.methods.removeSharing = function(userId: string, roleId: string) {
  this.sharedWith = this.sharedWith.filter((share: any) => 
    !(share.userId.toString() === userId && share.roleId.toString() === roleId)
  )
  
  return this.save()
}

// Enhanced method to create new version (Blueprint requirement)
DocumentSchema.methods.createNewVersion = async function(
  newFilePath: string, 
  newFileName: string, 
  changedBy: mongoose.Types.ObjectId, 
  changeNotes?: string
) {
  // Mark current version as not latest
  this.isLatestVersion = false
  await this.save()
  
  // Add current version to previous versions
  this.previousVersions.push(this._id)
  
  // Create new document with incremented version
  const newDoc = new (this.constructor as any)({
    ...this.toObject(),
    _id: new mongoose.Types.ObjectId(),
    filePath: newFilePath,
    fileName: newFileName,
    version: this.version + 1,
    previousVersions: [],
    parentFileId: this._id,
    changedBy: changedBy,
    changeNotes: changeNotes || `Version ${this.version + 1} created`,
    isLatestVersion: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  return newDoc.save()
}

// Method to get version history
DocumentSchema.methods.getVersionHistory = async function() {
  const DocumentModel = this.constructor as any
  
  // Get all versions of this document
  const versions = await DocumentModel.find({
    $or: [
      { _id: this._id },
      { parentFileId: this._id },
      { _id: { $in: this.previousVersions } }
    ]
  }).sort({ version: 1 }).populate('changedBy', 'name email')
  
  return versions
}

// Method to restore to previous version
DocumentSchema.methods.restoreToVersion = async function(versionId: string, restoredBy: mongoose.Types.ObjectId) {
  const DocumentModel = this.constructor as any
  
  // Find the target version
  const targetVersion = await DocumentModel.findById(versionId)
  if (!targetVersion) {
    throw new Error('Version not found')
  }
  
  // Create new version from target
  const restoredDoc = new DocumentModel({
    ...targetVersion.toObject(),
    _id: new mongoose.Types.ObjectId(),
    version: this.version + 1,
    previousVersions: [this._id],
    parentFileId: this._id,
    changedBy: restoredBy,
    changeNotes: `Restored from version ${targetVersion.version}`,
    isLatestVersion: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  // Mark current version as not latest
  this.isLatestVersion = false
  await this.save()
  
  return restoredDoc.save()
}

// Pre-save middleware to update lastModifiedAt
DocumentSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date()
  next()
})

// Pre-save middleware to validate file size
DocumentSchema.pre('save', function(next) {
  // Check if file size is within limits (50MB default)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (this.fileSize > maxSize) {
    return next(new Error('File size exceeds maximum allowed size'))
  }
  next()
})

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema)
