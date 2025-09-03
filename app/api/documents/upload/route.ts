import { NextRequest, NextResponse } from 'next/server'
import { getServerUser, hasPermission } from '@/lib/rbac'
import { logDocumentAction } from '@/lib/auditMiddleware'
import dbConnect from '@/lib/db'
import Document from '@/models/Document'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import mongoose from 'mongoose'

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Promisify multer
const uploadMiddleware = promisify(upload.single('file'))

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user has permission to upload documents
    if (!hasPermission(user, 'documents:upload')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || []
    const clientId = formData.get('clientId') as string
    const projectId = formData.get('projectId') as string
    const complianceId = formData.get('complianceId') as string
    const documentType = formData.get('documentType') as string
    const financialYear = formData.get('financialYear') as string
    const assessmentYear = formData.get('assessmentYear') as string
    const filingPeriod = formData.get('filingPeriod') as string
    const dueDate = formData.get('dueDate') as string
    const isPublic = formData.get('isPublic') === 'true'
    const isTemplate = formData.get('isTemplate') === 'true'
    
    // Validate required fields
    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      )
    }
    
    // Validate file size
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileExtension = path.extname(file.name)
    const fileName = `doc-${uniqueSuffix}`
    const filePath = path.join('uploads', fileName + fileExtension)
    
    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    fs.writeFileSync(path.join(uploadDir, fileName + fileExtension), buffer)
    
    // Create document record
    const document = new Document({
      title: title.trim(),
      description: description?.trim(),
      fileName,
      originalName: file.name,
      filePath,
      fileSize: file.size,
      mimeType: file.type,
      fileExtension: fileExtension.substring(1),
      
      // Metadata
      category: category || 'other',
      tags,
      clientId: clientId || undefined,
      projectId: projectId || undefined,
      complianceId: complianceId || undefined,
      
      // Access Control
      firmId: user.firmId,
      uploadedBy: user._id,
      
      // Document Properties
      isPublic,
      isTemplate,
      documentType: documentType || 'OTHER',
      financialYear: financialYear || undefined,
      assessmentYear: assessmentYear || undefined,
      filingPeriod: filingPeriod || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      
      // Enhanced versioning fields
      version: 1,
      isLatestVersion: true,
      changedBy: user._id,
      changeNotes: 'Initial version'
    })
    
    await document.save()
    
    // Populate references for response
    await document.populate([
      { path: 'clientId', select: 'name' },
      { path: 'projectId', select: 'name' },
      { path: 'complianceId', select: 'title' },
      { path: 'uploadedBy', select: 'firstName lastName' }
    ])
    
    // Enhanced audit logging using new middleware
    await logDocumentAction(
      user.firmId,
      user._id,
      'document_uploaded',
      document._id.toString(),
      {
        fileName: document.fileName,
        fileSize: document.fileSize,
        category: document.category,
        documentType: document.documentType,
        isComplianceDocument: documentType && ['GST', 'TDS', 'ITR', 'ROC', 'AUDIT'].includes(documentType),
        tags: document.tags,
        clientId: document.clientId,
        projectId: document.projectId,
        complianceId: document.complianceId
      }
    )
    
    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        _id: document._id,
        title: document.title,
        description: document.description,
        fileName: document.fileName,
        originalName: document.originalName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category,
        tags: document.tags,
        clientId: document.clientId,
        projectId: document.projectId,
        complianceId: document.complianceId,
        documentType: document.documentType,
        financialYear: document.financialYear,
        assessmentYear: document.assessmentYear,
        filingPeriod: document.filingPeriod,
        dueDate: document.dueDate,
        isPublic: document.isPublic,
        isTemplate: document.isTemplate,
        version: document.version,
        isLatestVersion: document.isLatestVersion,
        uploadedBy: document.uploadedBy,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Document upload error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('File size')) {
        return NextResponse.json(
          { error: 'File size exceeds limit' },
          { status: 400 }
        )
      }
      if (error.message.includes('Invalid file type')) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    
    const user = await getServerUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user has permission to view documents
    if (!hasPermission(user, 'documents:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const documentType = searchParams.get('documentType') || ''
    const clientId = searchParams.get('clientId') || ''
    const projectId = searchParams.get('projectId') || ''
    const tags = searchParams.get('tags') || ''
    const isArchived = searchParams.get('isArchived') || ''
    const isTemplate = searchParams.get('isTemplate') || ''
    const showLatestOnly = searchParams.get('showLatestOnly') || 'true'
    
    // Build query
    const query: any = { firmId: user.firmId }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (category) {
      query.category = category
    }
    
    if (documentType) {
      query.documentType = documentType
    }
    
    if (clientId) {
      query.clientId = clientId
    }
    
    if (projectId) {
      query.projectId = projectId
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      query.tags = { $in: tagArray }
    }
    
    if (isArchived !== '') {
      query.isArchived = isArchived === 'true'
    }
    
    if (isTemplate !== '') {
      query.isTemplate = isTemplate === 'true'
    }
    
    // Show only latest versions by default
    if (showLatestOnly === 'true') {
      query.isLatestVersion = true
    }
    
    // Get total count
    const total = await Document.countDocuments(query)
    
    // Get documents with pagination
    const documents = await Document.find(query)
      .populate('clientId', 'name')
      .populate('projectId', 'name')
      .populate('complianceId', 'title')
      .populate('uploadedBy', 'firstName lastName')
      .populate('changedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    // Log document access for audit
    await logDocumentAction(
      user.firmId,
      user._id,
      'documents_listed',
      'multiple',
      {
        searchTerm: search,
        category,
        documentType,
        page,
        limit,
        totalResults: total
      }
    )
    
    return NextResponse.json({
      success: true,
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
