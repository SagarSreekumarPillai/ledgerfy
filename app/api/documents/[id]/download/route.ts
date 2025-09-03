import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission } from '@/lib/rbac'
import { logDocumentAction } from '@/lib/auditMiddleware'
import dbConnect from '@/lib/db'
import Document from '@/models/Document'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user has permission to download documents
    if (!hasPermission(user, 'documents:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const documentId = params.id
    
    // Get document with access control
    const document = await Document.findById(documentId)
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // Check if document belongs to user's firm
    if (document.firmId.toString() !== user.firmId.toString()) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Check if user has permission to download this specific document
    const canDownload = document.hasUserPermission(user._id.toString(), 'download') ||
                       document.hasRolePermission(user.roleId.toString(), 'download')
    
    if (!canDownload) {
      return NextResponse.json(
        { error: 'Insufficient permissions to download this document' },
        { status: 403 }
      )
    }
    
    // Check if file exists
    const filePath = path.join(process.cwd(), document.filePath)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      )
    }
    
    // Update document stats
    document.downloadCount += 1
    document.lastAccessedAt = new Date()
    await document.save()
    
    // Enhanced audit logging using new middleware
    await logDocumentAction(
      new mongoose.Types.ObjectId(user.firmId),
      new mongoose.Types.ObjectId(user._id),
      'document_downloaded',
      (document._id as mongoose.Types.ObjectId).toString(),
      {
        fileName: document.fileName,
        originalName: document.originalName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        version: document.version,
        isLatestVersion: document.isLatestVersion,
        category: document.category,
        documentType: document.documentType,
        downloadCount: document.downloadCount,
        clientId: document.clientId,
        projectId: document.projectId,
        complianceId: document.complianceId,
        ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    )
    
    // Read file and send response
    const fileBuffer = fs.readFileSync(filePath)
    
    const response = new NextResponse(fileBuffer)
    
    // Set appropriate headers
    response.headers.set('Content-Type', document.mimeType)
    response.headers.set('Content-Disposition', `attachment; filename="${document.originalName}"`)
    response.headers.set('Content-Length', document.fileSize.toString())
    
    return response
    
  } catch (error) {
    console.error('Document download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
