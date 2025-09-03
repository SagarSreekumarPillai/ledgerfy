const mongoose = require('mongoose');

const tallyIntegrationSchema = new mongoose.Schema({
  // Firm & Client Reference
  firmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  
  // Connection Details
  connectionType: {
    type: String,
    enum: ['odbc', 'excel_import', 'api', 'manual', 'other'],
    required: true
  },
  connectionName: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // ODBC Connection Details
  odbcDetails: {
    serverName: String,
    databaseName: String,
    username: String,
    password: String,
    port: Number,
    connectionString: String,
    lastConnected: Date,
    connectionStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'error', 'unknown'],
      default: 'unknown'
    }
  },
  
  // Excel Import Details
  excelDetails: {
    filePath: String,
    fileName: String,
    lastImported: Date,
    importFrequency: {
      type: String,
      enum: ['manual', 'daily', 'weekly', 'monthly'],
      default: 'manual'
    },
    nextImportDate: Date,
    sheetNames: [String],
    mappingConfig: {
      ledgerSheet: String,
      voucherSheet: String,
      groupSheet: String,
      costCenterSheet: String
    }
  },
  
  // Sync Configuration
  syncSettings: {
    autoSync: {
      type: Boolean,
      default: false
    },
    syncFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    lastSyncDate: Date,
    nextSyncDate: Date,
    syncStatus: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed', 'skipped'],
      default: 'pending'
    },
    syncErrors: [{
      error: String,
      timestamp: Date,
      details: String
    }]
  },
  
  // Data Mappings
  dataMappings: {
    ledgerMapping: [{
      tallyGroup: String,
      tallyLedger: String,
      ledgerfyCategory: String,
      ledgerfySubcategory: String,
      isActive: { type: Boolean, default: true }
    }],
    voucherMapping: [{
      tallyVoucherType: String,
      ledgerfyVoucherType: String,
      isActive: { type: Boolean, default: true }
    }],
    costCenterMapping: [{
      tallyCostCenter: String,
      ledgerfyCostCenter: String,
      isActive: { type: Boolean, default: true }
    }]
  },
  
  // Sync History
  syncHistory: [{
    syncDate: {
      type: Date,
      default: Date.now
    },
    syncType: {
      type: String,
      enum: ['full', 'incremental', 'manual', 'scheduled']
    },
    status: {
      type: String,
      enum: ['success', 'partial', 'failed']
    },
    recordsProcessed: {
      ledgers: Number,
      vouchers: Number,
      groups: Number,
      costCenters: Number
    },
    errors: [{
      type: String,
      message: String,
      record: String
    }],
    duration: Number, // in seconds
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Data Statistics
  dataStatistics: {
    totalLedgers: {
      type: Number,
      default: 0
    },
    totalVouchers: {
      type: Number,
      default: 0
    },
    totalGroups: {
      type: Number,
      default: 0
    },
    totalCostCenters: {
      type: Number,
      default: 0
    },
    lastDataUpdate: Date,
    dataQuality: {
      completeness: Number, // percentage
      accuracy: Number, // percentage
      consistency: Number // percentage
    }
  },
  
  // Compliance Integration
  complianceIntegration: {
    gstIntegration: {
      isEnabled: { type: Boolean, default: false },
      gstLedgers: [String],
      gstVouchers: [String],
      lastGstSync: Date
    },
    tdsIntegration: {
      isEnabled: { type: Boolean, default: false },
      tdsLedgers: [String],
      tdsVouchers: [String],
      lastTdsSync: Date
    },
    itrIntegration: {
      isEnabled: { type: Boolean, default: false },
      incomeLedgers: [String],
      expenseLedgers: [String],
      lastItrSync: Date
    }
  },
  
  // Error Handling & Monitoring
  errorLog: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical']
    },
    message: String,
    details: String,
    stackTrace: String,
    resolved: { type: Boolean, default: false },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  }],
  
  // Performance Metrics
  performanceMetrics: {
    averageSyncTime: Number, // in seconds
    syncSuccessRate: Number, // percentage
    dataTransferRate: Number, // MB/s
    lastPerformanceCheck: Date
  },
  
  // Security & Access
  security: {
    encryptionEnabled: {
      type: Boolean,
      default: true
    },
    accessLog: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      action: String,
      timestamp: Date,
      ipAddress: String,
      userAgent: String
    }],
    lastAccess: Date
  },
  
  // Notes & Configuration
  notes: [{
    content: String,
    type: {
      type: String,
      enum: ['configuration', 'issue', 'improvement', 'other']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
tallyIntegrationSchema.index({ firmId: 1, clientId: 1 });
tallyIntegrationSchema.index({ firmId: 1, isActive: 1 });
tallyIntegrationSchema.index({ firmId: 1, 'syncSettings.lastSyncDate': 1 });
tallyIntegrationSchema.index({ firmId: 1, 'syncSettings.syncStatus': 1 });

// Virtual for connection status
tallyIntegrationSchema.virtual('connectionStatusText').get(function() {
  if (this.connectionType === 'odbc') {
    return this.odbcDetails?.connectionStatus || 'unknown';
  } else if (this.connectionType === 'excel_import') {
    return this.excelDetails?.lastImported ? 'connected' : 'disconnected';
  }
  return 'manual';
});

// Virtual for last sync status
tallyIntegrationSchema.virtual('lastSyncStatus').get(function() {
  if (this.syncHistory.length === 0) return 'never';
  const lastSync = this.syncHistory[this.syncHistory.length - 1];
  return lastSync.status;
});

// Virtual for sync health
tallyIntegrationSchema.virtual('syncHealth').get(function() {
  if (this.syncHistory.length === 0) return 'unknown';
  
  const recentSyncs = this.syncHistory
    .filter(sync => new Date() - sync.syncDate < 30 * 24 * 60 * 60 * 1000) // Last 30 days
    .slice(-10); // Last 10 syncs
  
  if (recentSyncs.length === 0) return 'unknown';
  
  const successCount = recentSyncs.filter(sync => sync.status === 'success').length;
  const successRate = (successCount / recentSyncs.length) * 100;
  
  if (successRate >= 90) return 'excellent';
  if (successRate >= 75) return 'good';
  if (successRate >= 50) return 'fair';
  return 'poor';
});

// Method to check if sync is due
tallyIntegrationSchema.methods.isSyncDue = function() {
  if (!this.syncSettings.autoSync) return false;
  
  const nextSync = this.syncSettings.nextSyncDate;
  if (!nextSync) return false;
  
  return new Date() >= nextSync;
};

// Method to calculate next sync date
tallyIntegrationSchema.methods.calculateNextSyncDate = function() {
  if (!this.syncSettings.autoSync) return null;
  
  const lastSync = this.syncSettings.lastSyncDate || new Date();
  const nextSync = new Date(lastSync);
  
  switch (this.syncSettings.syncFrequency) {
    case 'hourly':
      nextSync.setHours(nextSync.getHours() + 1);
      break;
    case 'daily':
      nextSync.setDate(nextSync.getDate() + 1);
      break;
    case 'weekly':
      nextSync.setDate(nextSync.getDate() + 7);
      break;
    case 'monthly':
      nextSync.setMonth(nextSync.getMonth() + 1);
      break;
  }
  
  return nextSync;
};

// Method to add sync record
tallyIntegrationSchema.methods.addSyncRecord = function(syncData) {
  this.syncHistory.push(syncData);
  
  // Keep only last 100 sync records
  if (this.syncHistory.length > 100) {
    this.syncHistory = this.syncHistory.slice(-100);
  }
  
  // Update last sync date
  this.syncSettings.lastSyncDate = new Date();
  this.syncSettings.nextSyncDate = this.calculateNextSyncDate();
  
  return this.save();
};

// Method to add error log
tallyIntegrationSchema.methods.addErrorLog = function(errorData) {
  this.errorLog.push(errorData);
  
  // Keep only last 1000 error logs
  if (this.errorLog.length > 1000) {
    this.errorLog = this.errorLog.slice(-1000);
  }
  
  return this.save();
};

// Method to get data quality score
tallyIntegrationSchema.methods.getDataQualityScore = function() {
  const stats = this.dataStatistics.dataQuality;
  if (!stats) return 0;
  
  return Math.round((stats.completeness + stats.accuracy + stats.consistency) / 3);
};

// Method to check if compliance integration is enabled
tallyIntegrationSchema.methods.hasComplianceIntegration = function(complianceType) {
  return this.complianceIntegration[`${complianceType}Integration`]?.isEnabled || false;
};

// Ensure virtual fields are serialized
tallyIntegrationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('TallyIntegration', tallyIntegrationSchema);
