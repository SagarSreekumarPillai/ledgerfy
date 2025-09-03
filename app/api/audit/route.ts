// FILE: /app/api/audit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser, hasPermission } from '@/lib/rbac';
import dbConnect from '@/lib/db';
import AuditLog from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to view audit logs
    if (!hasPermission(user, 'audit:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view audit logs' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const severity = searchParams.get('severity') || '';
    const actionType = searchParams.get('actionType') || '';
    const entityType = searchParams.get('entityType') || '';
    const userId = searchParams.get('userId') || '';
    const isComplianceAction = searchParams.get('isComplianceAction') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const ipAddress = searchParams.get('ipAddress') || '';
    
    // Build query
    const query: any = { firmId: user.firmId };
    
    // Search across multiple fields
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { entityType: { $regex: search, $options: 'i' } },
        { entityName: { $regex: search, $options: 'i' } },
        { entityDescription: { $regex: search, $options: 'i' } },
        { 'actorUserId.name': { $regex: search, $options: 'i' } },
        { 'actorUserId.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by severity
    if (severity && severity !== 'all') {
      query.severity = severity;
    }
    
    // Filter by action type
    if (actionType && actionType !== 'all') {
      query.actionType = actionType;
    }
    
    // Filter by entity type
    if (entityType && entityType !== 'all') {
      query.entityType = entityType;
    }
    
    // Filter by user
    if (userId && userId !== 'all') {
      query.actorUserId = userId;
    }
    
    // Filter by compliance actions
    if (isComplianceAction !== '') {
      query.isComplianceAction = isComplianceAction === 'true';
    }
    
    // Filter by IP address
    if (ipAddress) {
      query.ipAddress = { $regex: ipAddress, $options: 'i' };
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Get total count
    const total = await AuditLog.countDocuments(query);
    
    // Get audit logs with pagination
    const auditLogs = await AuditLog.find(query)
      .populate('actorUserId', 'firstName lastName email')
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Format response data
    const formattedLogs = auditLogs.map(log => ({
      _id: log._id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      entityName: log.entityName,
      entityDescription: log.entityDescription,
      actorUserId: log.actorUserId,
      userId: log.userId,
      timestamp: log.timestamp,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      severity: log.severity,
      actionType: log.actionType,
      isComplianceAction: log.isComplianceAction,
      changes: log.changes || [],
      metadata: log.meta || {},
      formattedTimestamp: log.formattedTimestamp,
      actionDescription: log.actionDescription
    }));
    
    // Get summary statistics
    const severityStats = await AuditLog.aggregate([
      { $match: { firmId: user.firmId } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    const actionTypeStats = await AuditLog.aggregate([
      { $match: { firmId: user.firmId } },
      { $group: { _id: '$actionType', count: { $sum: 1 } } }
    ]);
    
    const entityTypeStats = await AuditLog.aggregate([
      { $match: { firmId: user.firmId } },
      { $group: { _id: '$entityType', count: { $sum: 1 } } }
    ]);
    
    const complianceStats = await AuditLog.aggregate([
      { $match: { firmId: user.firmId } },
      { $group: { _id: '$isComplianceAction', count: { $sum: 1 } } }
    ]);
    
    // Get recent activity summary
    const recentActivity = await AuditLog.find({ firmId: user.firmId })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('actorUserId', 'firstName lastName')
      .select('action entityType entityId timestamp severity');
    
    return NextResponse.json({
      success: true,
      data: {
        auditLogs: formattedLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: {
          severity: severityStats,
          actionType: actionTypeStats,
          entityType: entityTypeStats,
          compliance: complianceStats
        },
        recentActivity,
        summary: {
          totalLogs: total,
          highSeverityCount: severityStats.find(s => s._id === 'high')?.count || 0,
          complianceActionCount: complianceStats.find(s => s._id === true)?.count || 0,
          uniqueUsers: await AuditLog.distinct('actorUserId', { firmId: user.firmId }).countDocuments()
        }
      }
    });
    
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const user = await getServerUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to export audit logs
    if (!hasPermission(user, 'audit:export')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to export audit logs' },
        { status: 403 }
      );
    }
    
    const { filters, format = 'json' } = await req.json();
    
    // Build query based on filters
    const query: any = { firmId: user.firmId };
    
    if (filters) {
      if (filters.severity && filters.severity !== 'all') {
        query.severity = filters.severity;
      }
      if (filters.actionType && filters.actionType !== 'all') {
        query.actionType = filters.actionType;
      }
      if (filters.entityType && filters.entityType !== 'all') {
        query.entityType = filters.entityType;
      }
      if (filters.startDate) {
        query.timestamp = { $gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        if (query.timestamp) {
          query.timestamp.$lte = new Date(filters.endDate);
        } else {
          query.timestamp = { $lte: new Date(filters.endDate) };
        }
      }
      if (filters.isComplianceAction !== undefined) {
        query.isComplianceAction = filters.isComplianceAction;
      }
    }
    
    // Get audit logs for export
    const auditLogs = await AuditLog.find(query)
      .populate('actorUserId', 'firstName lastName email')
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(10000); // Limit export to 10k records
    
    if (format === 'csv') {
      // Generate CSV format
      const csvHeaders = [
        'Timestamp',
        'Action',
        'Entity Type',
        'Entity ID',
        'Entity Name',
        'Actor User',
        'Severity',
        'Action Type',
        'IP Address',
        'User Agent',
        'Compliance Action',
        'Changes',
        'Metadata'
      ];
      
      const csvData = auditLogs.map(log => [
        log.timestamp.toISOString(),
        log.action,
        log.entityType,
        log.entityId,
        log.entityName || '',
        log.actorUserId ? `${log.actorUserId.firstName} ${log.actorUserId.lastName}` : '',
        log.severity,
        log.actionType,
        log.ipAddress,
        log.userAgent || '',
        log.isComplianceAction ? 'Yes' : 'No',
        log.changes ? JSON.stringify(log.changes) : '',
        log.meta ? JSON.stringify(log.meta) : ''
      ]);
      
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }
    
    // Return JSON format
    return NextResponse.json({
      success: true,
      data: auditLogs,
      exportInfo: {
        format: 'json',
        recordCount: auditLogs.length,
        exportDate: new Date().toISOString(),
        filters: filters || {}
      }
    });
    
  } catch (error) {
    console.error('Export audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
