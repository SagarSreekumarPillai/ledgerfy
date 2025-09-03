// FILE: /models/AuditLog.ts
import mongoose from 'mongoose';

export interface IAuditLog extends mongoose.Document {
  firmId: mongoose.Types.ObjectId;
  actorUserId: mongoose.Types.ObjectId;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  ip: string;
  userAgent: string;
  meta: any;
  timestamp: Date;
  
  // Enhanced fields (Blueprint requirement)
  ipAddress: string;
  userId: mongoose.Types.ObjectId;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'download' | 'share' | 'restore' | 'version';
  entityName?: string;
  entityDescription?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  isComplianceAction: boolean;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>({
  firmId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Firm', 
    required: true 
  },
  actorUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  actorRole: String,
  action: { 
    type: String, 
    required: true 
  },
  entityType: String,
  entityId: String,
  ip: String,
  userAgent: String,
  meta: mongoose.Schema.Types.Mixed,
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  
  // Enhanced fields (Blueprint requirement)
  ipAddress: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: ['create', 'update', 'delete', 'view', 'download', 'share', 'restore', 'version'],
    required: true
  },
  entityName: String,
  entityDescription: String,
  changes: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isComplianceAction: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
AuditLogSchema.index({ firmId: 1, timestamp: -1 });
AuditLogSchema.index({ actorUserId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

// Enhanced indexes (Blueprint requirement)
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ actionType: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ isComplianceAction: 1, timestamp: -1 });
AuditLogSchema.index({ ipAddress: 1, timestamp: -1 });

// Virtual for formatted timestamp
AuditLogSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for action description
AuditLogSchema.virtual('actionDescription').get(function() {
  const actionMap: { [key: string]: string } = {
    'create': 'Created',
    'update': 'Updated',
    'delete': 'Deleted',
    'view': 'Viewed',
    'download': 'Downloaded',
    'share': 'Shared',
    'restore': 'Restored',
    'version': 'Version created'
  };
  
  return actionMap[this.actionType] || this.actionType;
});

// Method to add change tracking
AuditLogSchema.methods.addChange = function(field: string, oldValue: any, newValue: any) {
  this.changes.push({
    field,
    oldValue,
    newValue
  });
  
  return this.save();
};

// Method to set severity based on action
AuditLogSchema.methods.setSeverity = function() {
  const severityMap: { [key: string]: 'low' | 'medium' | 'high' | 'critical' } = {
    'create': 'low',
    'view': 'low',
    'download': 'low',
    'update': 'medium',
    'share': 'medium',
    'restore': 'medium',
    'version': 'medium',
    'delete': 'high'
  };
  
  this.severity = severityMap[this.actionType] || 'medium';
  
  // Override for compliance actions
  if (this.isComplianceAction) {
    this.severity = 'high';
  }
  
  return this.save();
};

// Pre-save middleware to set severity
AuditLogSchema.pre('save', function(next) {
  if (this.isModified('actionType') || this.isModified('isComplianceAction')) {
    this.setSeverity();
  }
  next();
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
