const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Firm & Client Reference
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // File Details
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  
  // Document Classification
  type: {
    type: String,
    enum: [
      'invoice', 'challan', 'contract', 'agreement', 'certificate',
      'return', 'statement', 'report', 'receipt', 'bill',
      'form', 'id_proof', 'address_proof', 'financial_statement',
      'compliance_document', 'other'
    ],
    required: true
  },
  category: {
    type: String,
    enum: [
      'gst', 'tds', 'itr', 'roc', 'audit', 'bookkeeping',
      'payroll', 'consultation', 'client_upload', 'internal',
      'government', 'other'
    ],
    required: true
  },
  
  // Compliance Specific Fields
  complianceDetails: {
    period: {
      start: Date,
      end: Date
    },
    filingType: {
      type: String,
      enum: ['original', 'revised', 'belated', 'other']
    },
    dueDate: Date,
    filingDate: Date,
    acknowledgmentNumber: String,
    status: {
      type: String,
      enum: ['pending', 'filed', 'accepted', 'rejected', 'other']
    }
  },
  
  // Document Properties
  properties: {
    isConfidential: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    expiryDate: Date,
    tags: [String],
    customFields: [{
      key: String,
      value: String,
      type: {
        type: String,
        enum: ['text', 'number', 'date', 'boolean']
      }
    }]
  },
  
  // Version Control
  version: {
    major: {
      type: Number,
      default: 1
    },
    minor: {
      type: Number,
      default: 0
    },
    patch: {
      type: Number,
      default: 0
    }
  },
  versionHistory: [{
    version: {
      major: Number,
      minor: Number,
      patch: Number
    },
    fileName: String,
    filePath: String,
    fileSize: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    changeDescription: String
  }],
  
  // Access Control
  accessLevel: {
    type: String,
    enum: ['public', 'internal', 'confidential', 'restricted'],
    default: 'internal'
  },
  permissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'viewer', 'none']
    },
    grantedAt: {
      type: Date,
      default: Date.now
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Sharing & Collaboration
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'download', 'edit', 'comment']
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiresAt: Date
  }],
  
  // Client Portal Access
  clientAccess: {
    isVisible: {
      type: Boolean,
      default: false
    },
    canDownload: {
      type: Boolean,
      default: false
    },
    canUpload: {
      type: Boolean,
      default: false
    },
    lastAccessed: Date,
    accessCount: {
      type: Number,
      default: 0
    }
  },
  
  // OCR & Processing
  ocrData: {
    isProcessed: {
      type: Boolean,
      default: false
    },
    extractedText: String,
    confidence: Number,
    processedAt: Date,
    keywords: [String]
  },
  
  // Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'approved', 'rejected', 'archived'],
    default: 'draft'
  },
  workflow: {
    currentStep: String,
    steps: [{
      name: String,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'skipped']
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      dueDate: Date,
      completedAt: Date,
      comments: String
    }]
  },
  
  // Audit & Tracking
  uploadInfo: {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      enum: ['web_upload', 'client_portal', 'email', 'api', 'other']
    },
    ipAddress: String,
    userAgent: String
  },
  
  // Usage Statistics
  statistics: {
    downloadCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    lastDownloaded: Date,
    lastViewed: Date
  },
  
  // Audit Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
documentSchema.index({ firmId: 1, clientId: 1 });
documentSchema.index({ firmId: 1, projectId: 1 });
documentSchema.index({ firmId: 1, type: 1 });
documentSchema.index({ firmId: 1, category: 1 });
documentSchema.index({ firmId: 1, status: 1 });
documentSchema.index({ firmId: 1, 'uploadInfo.uploadedBy': 1 });
documentSchema.index({ firmId: 1, 'permissions.userId': 1 });
documentSchema.index({ firmId: 1, 'sharedWith.userId': 1 });
documentSchema.index({ firmId: 1, 'properties.tags': 1 });

// Virtual for full version string
documentSchema.virtual('fullVersion').get(function() {
  return `${this.version.major}.${this.version.minor}.${this.version.patch}`;
});

// Virtual for file size in human readable format
documentSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for is expired
documentSchema.virtual('isExpired').get(function() {
  if (!this.properties.expiryDate) return false;
  return new Date() > this.properties.expiryDate;
});

// Virtual for days until expiry
documentSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.properties.expiryDate) return null;
  const now = new Date();
  const diffTime = this.properties.expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Method to check if user has permission
documentSchema.methods.hasPermission = function(userId, permission) {
  const userPermission = this.permissions.find(p => p.userId.equals(userId));
  if (!userPermission) return false;
  
  const permissionLevels = {
    'none': 0,
    'viewer': 1,
    'editor': 2,
    'owner': 3
  };
  
  const requiredLevel = permissionLevels[permission] || 0;
  return permissionLevels[userPermission.role] >= requiredLevel;
};

// Method to check if user can access
documentSchema.methods.canAccess = function(userId) {
  // Check direct permissions
  if (this.hasPermission(userId, 'viewer')) return true;
  
  // Check shared access
  const sharedAccess = this.sharedWith.find(s => s.userId.equals(userId));
  if (sharedAccess && (!sharedAccess.expiresAt || new Date() <= sharedAccess.expiresAt)) {
    return true;
  }
  
  return false;
};

// Method to increment view count
documentSchema.methods.incrementViewCount = function() {
  this.statistics.viewCount += 1;
  this.statistics.lastViewed = new Date();
  return this.save();
};

// Method to increment download count
documentSchema.methods.incrementDownloadCount = function() {
  this.statistics.downloadCount += 1;
  this.statistics.lastDownloaded = new Date();
  return this.save();
};

// Method to create new version
documentSchema.methods.createNewVersion = function(fileData, userId, changeDescription) {
  // Add current version to history
  this.versionHistory.push({
    version: { ...this.version },
    fileName: this.fileName,
    filePath: this.filePath,
    fileSize: this.fileSize,
    uploadedBy: this.uploadInfo.uploadedBy,
    uploadedAt: this.uploadInfo.uploadedAt,
    changeDescription: 'Original version'
  });
  
  // Update current version
  this.version.patch += 1;
  this.fileName = fileData.fileName;
  this.filePath = fileData.filePath;
  this.fileSize = fileData.fileSize;
  this.uploadInfo.uploadedBy = userId;
  this.uploadInfo.uploadedAt = new Date();
  
  return this.save();
};

// Ensure virtual fields are serialized
documentSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Document', documentSchema);
