// FILE: /lib/auditMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import AuditLog from '@/models/AuditLog';
import mongoose from 'mongoose';

export interface AuditConfig {
  entityType: string;
  entityIdField?: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'download' | 'share' | 'restore' | 'version';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isComplianceAction?: boolean;
  captureChanges?: boolean;
  captureMetadata?: boolean;
}

export interface AuditContext {
  firmId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  entityDescription?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isComplianceAction: boolean;
}

/**
 * Audit middleware factory that creates middleware for specific routes
 */
export function createAuditMiddleware(config: AuditConfig) {
  return async function auditMiddleware(
    req: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const startTime = Date.now();
    let response: NextResponse;
    let auditContext: Partial<AuditContext> = {};
    
    try {
      // Extract basic request information
      const ipAddress = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       req.ip || 
                       '127.0.0.1';
      
      const userAgent = req.headers.get('user-agent') || 'Unknown';
      
      // Get user information from session (this would need to be adapted based on your auth setup)
      // For now, we'll use placeholder values
      const userId = new mongoose.Types.ObjectId(); // This should come from session
      const firmId = new mongoose.Types.ObjectId(); // This should come from session
      const userRole = 'user'; // This should come from session
      
      // Prepare audit context
      auditContext = {
        firmId,
        userId,
        userRole,
        ipAddress,
        userAgent,
        action: req.method,
        entityType: config.entityType,
        entityId: '', // Will be populated after request processing
        severity: config.severity || 'medium',
        isComplianceAction: config.isComplianceAction || false
      };
      
      // Execute the actual handler
      response = await handler();
      
      // Extract entity ID from response or request
      if (config.entityIdField && req.body) {
        try {
          const body = await req.json();
          auditContext.entityId = body[config.entityIdField] || '';
        } catch (error) {
          // If we can't parse body, try to get from URL params
          const url = new URL(req.url);
          auditContext.entityId = url.searchParams.get('id') || '';
        }
      }
      
      // Capture changes if enabled and it's an update operation
      if (config.captureChanges && req.method === 'PUT' || req.method === 'PATCH') {
        try {
          const body = await req.json();
          // This would need to be implemented based on your specific needs
          // For now, we'll just capture the body
          auditContext.changes = [{
            field: 'body',
            oldValue: null,
            newValue: body
          }];
        } catch (error) {
          // Ignore parsing errors
        }
      }
      
      // Capture metadata if enabled
      if (config.captureMetadata) {
        auditContext.metadata = {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries(req.headers.entries()),
          responseTime: Date.now() - startTime,
          responseStatus: response.status
        };
      }
      
      return response;
      
    } catch (error) {
      // Log error in audit context
      auditContext.metadata = {
        ...auditContext.metadata,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
      
      // Re-throw the error
      throw error;
    } finally {
      // Always log the audit entry
      try {
        await logAuditEntry(auditContext as AuditContext);
      } catch (auditError) {
        console.error('Failed to log audit entry:', auditError);
      }
    }
  };
}

/**
 * Log an audit entry to the database
 */
async function logAuditEntry(context: AuditContext): Promise<void> {
  try {
    await AuditLog.create({
      firmId: context.firmId,
      actorUserId: context.userId,
      actorRole: context.userRole,
      action: context.action,
      entityType: context.entityType,
      entityId: context.entityId,
      ip: context.ipAddress,
      userAgent: context.userAgent,
      meta: context.metadata || {},
      timestamp: new Date(),
      ipAddress: context.ipAddress,
      userId: context.userId,
      actionType: context.action as any,
      entityName: context.entityName,
      entityDescription: context.entityDescription,
      changes: context.changes || [],
      severity: context.severity,
      isComplianceAction: context.isComplianceAction
    });
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
  }
}

/**
 * Helper function to manually log audit entries
 */
export async function logAuditAction(
  context: Partial<AuditContext> & { 
    firmId: mongoose.Types.ObjectId; 
    userId: mongoose.Types.ObjectId; 
    action: string; 
    entityType: string; 
    entityId: string; 
  }
): Promise<void> {
  const auditContext: AuditContext = {
    firmId: context.firmId,
    userId: context.userId,
    userRole: context.userRole || 'user',
    ipAddress: context.ipAddress || '127.0.0.1',
    userAgent: context.userAgent || 'System',
    action: context.action,
    entityType: context.entityType,
    entityId: context.entityId,
    entityName: context.entityName,
    entityDescription: context.entityDescription,
    changes: context.changes || [],
    metadata: context.metadata || {},
    severity: context.severity || 'medium',
    isComplianceAction: context.isComplianceAction || false
  };
  
  await logAuditEntry(auditContext);
}

/**
 * Helper function to log compliance-related actions
 */
export async function logComplianceAction(
  firmId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: any
): Promise<void> {
  await logAuditAction({
    firmId,
    userId,
    action,
    entityType,
    entityId,
    severity: 'high',
    isComplianceAction: true,
    metadata
  });
}

/**
 * Helper function to log document-related actions
 */
export async function logDocumentAction(
  firmId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  action: string,
  documentId: string,
  metadata?: any
): Promise<void> {
  await logAuditAction({
    firmId,
    userId,
    action,
    entityType: 'Document',
    entityId: documentId,
    metadata
  });
}

/**
 * Helper function to log user management actions
 */
export async function logUserAction(
  firmId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  action: string,
  targetUserId: string,
  metadata?: any
): Promise<void> {
  await logAuditAction({
    firmId,
    userId,
    action,
    entityType: 'User',
    entityId: targetUserId,
    severity: 'high',
    metadata
  });
}
