// FILE: /lib/audit.ts
import { getServerUser } from './auth';
import { withCurrentFirmScope } from './scope';
import AuditLog from '../models/AuditLog';

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string;
  meta?: Record<string, any>;
  ip?: string;
}

/**
 * Log an action to the audit trail
 */
export async function logAction(entry: AuditLogEntry): Promise<void> {
  try {
    const user = await getServerUser();
    if (!user) {
      console.warn('Cannot log action: No authenticated user');
      return;
    }

    const auditEntry = {
      actorUserId: user._id,
      actorRole: user.roleId, // This should be populated with role name
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      firmId: user.firmId,
      ip: entry.ip || 'unknown',
      meta: entry.meta || {},
      timestamp: new Date()
    };

    await AuditLog.create(auditEntry);
  } catch (error) {
    console.error('Failed to log audit entry:', error);
    // Don't throw - audit logging should not break main functionality
  }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(filters: {
  entityType?: string;
  entityId?: string;
  action?: string;
  actorUserId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
} = {}) {
  const query = await withCurrentFirmScope();
  
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.action) query.action = filters.action;
  if (filters.actorUserId) query.actorUserId = filters.actorUserId;
  
  if (filters.dateFrom || filters.dateTo) {
    query.timestamp = {};
    if (filters.dateFrom) query.timestamp.$gte = filters.dateFrom;
    if (filters.dateTo) query.timestamp.$lte = filters.dateTo;
  }

  const limit = filters.limit || 100;
  const offset = filters.offset || 0;

  const logs = await AuditLog.find(query)
    .populate('actorUserId', 'name email')
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(offset);

  const total = await AuditLog.countDocuments(query);

  return {
    logs,
    total,
    hasMore: total > offset + limit
  };
}

/**
 * Export audit logs to CSV
 */
export async function exportAuditLogsCsv(filters: any = {}): Promise<string> {
  const { logs } = await getAuditLogs({ ...filters, limit: 10000 }); // Max 10k for export
  
  const headers = ['Timestamp', 'Actor', 'Action', 'Entity Type', 'Entity ID', 'IP', 'Metadata'];
  
  const rows = logs.map(log => [
    log.timestamp.toISOString(),
    (log.actorUserId as any)?.name || 'Unknown',
    log.action,
    log.entityType,
    log.entityId,
    log.ip,
    JSON.stringify(log.meta)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}

/**
 * Clean up old audit logs based on retention policy
 */
export async function cleanupOldAuditLogs(retentionDays: number = 365): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  const result = await AuditLog.deleteMany({
    timestamp: { $lt: cutoffDate }
  });
  
  return result.deletedCount || 0;
}

/**
 * Get audit statistics for dashboard
 */
export async function getAuditStats(): Promise<{
  totalActions: number;
  actionsToday: number;
  topActions: Array<{ action: string; count: number }>;
  topUsers: Array<{ userId: string; name: string; count: number }>;
}> {
  const firmId = (await withCurrentFirmScope()).firmId;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [totalActions, actionsToday, topActions, topUsers] = await Promise.all([
    AuditLog.countDocuments({ firmId }),
    AuditLog.countDocuments({ firmId, timestamp: { $gte: today } }),
    AuditLog.aggregate([
      { $match: { firmId } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]),
    AuditLog.aggregate([
      { $match: { firmId } },
      { $group: { _id: '$actorUserId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { userId: '$_id', name: '$user.name', count: 1 } }
    ])
  ]);
  
  return {
    totalActions,
    actionsToday,
    topActions: topActions.map(item => ({ action: item._id, count: item.count })),
    topUsers: topUsers.map(item => ({ userId: item.userId, name: item.name, count: item.count }))
  };
}
