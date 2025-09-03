// FILE: ledgerfy/app/dashboard/documents/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Plus,
  FolderOpen,
  Calendar,
  User,
  Tag,
  File,
  Archive,
  Star,
  GitBranch,
  History,
  RotateCcw
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { UploadModal } from '@/components/documents/UploadModal'
import VersionHistoryModal from '@/components/documents/VersionHistoryModal'
import CreateVersionModal from '@/components/documents/CreateVersionModal'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Document {
  _id: string
  title: string
  description?: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  category: string
  tags: string[]
  clientId?: {
    _id: string
    name: string
  }
  projectId?: {
    _id: string
    name: string
  }
  complianceId?: {
    _id: string
    title: string
  }
  documentType: string
  financialYear?: string
  assessmentYear?: string
  filingPeriod?: string
  dueDate?: string
  isPublic: boolean
  isArchived: boolean
  isTemplate: boolean
  version: number
  isLatestVersion: boolean
  hasVersionHistory: boolean
  downloadCount: number
  lastAccessedAt?: string
  uploadedBy: {
    _id: string
    firstName: string
    lastName: string
  }
  changedBy?: {
    _id: string
    firstName: string
    lastName: string
  }
  changeNotes?: string
  createdAt: string
  updatedAt: string
}

export default function DocumentsPage() {
  const { hasPermission } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false)
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDocuments([
        {
          _id: '1',
          title: 'GST Return Q3 2024-25',
          description: 'Quarterly GST return for ABC Corporation',
          fileName: 'gst-return-q3-2024-25',
          originalName: 'GST_Return_Q3_2024_25.pdf',
          fileSize: 2048576,
          mimeType: 'application/pdf',
          category: 'compliance',
          tags: ['GST', 'Q3', '2024-25', 'ABC Corp'],
          clientId: { _id: '1', name: 'ABC Corporation' },
          documentType: 'GST',
          financialYear: '2024-2025',
          filingPeriod: 'Q3',
          dueDate: '2024-10-20',
          isPublic: false,
          isArchived: false,
          isTemplate: false,
          version: 3,
          isLatestVersion: true,
          hasVersionHistory: true,
          downloadCount: 5,
          lastAccessedAt: '2024-01-15T10:30:00Z',
          uploadedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
          changedBy: { _id: '2', firstName: 'Priya', lastName: 'Sharma' },
          changeNotes: 'Updated with revised turnover figures and corrected GST calculations',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          title: 'TDS Certificate FY 2023-24',
          description: 'TDS certificate for XYZ Limited',
          fileName: 'tds-certificate-fy-2023-24',
          originalName: 'TDS_Certificate_FY_2023_24.pdf',
          fileSize: 1536000,
          mimeType: 'application/pdf',
          category: 'compliance',
          tags: ['TDS', 'FY 2023-24', 'XYZ Ltd'],
          clientId: { _id: '2', name: 'XYZ Limited' },
          documentType: 'TDS',
          financialYear: '2023-2024',
          filingPeriod: 'Annual',
          isPublic: false,
          isArchived: false,
          isTemplate: false,
          version: 1,
          isLatestVersion: true,
          hasVersionHistory: false,
          downloadCount: 3,
          lastAccessedAt: '2024-01-14T14:20:00Z',
          uploadedBy: { _id: '2', firstName: 'John', lastName: 'Doe' },
          createdAt: '2024-01-12T11:00:00Z',
          updatedAt: '2024-01-14T14:20:00Z'
        },
        {
          _id: '3',
          title: 'Audit Report Template',
          description: 'Standard audit report template for CA firms',
          fileName: 'audit-report-template',
          originalName: 'Audit_Report_Template.docx',
          fileSize: 512000,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          category: 'template',
          tags: ['Audit', 'Template', 'Report'],
          documentType: 'AUDIT',
          isPublic: true,
          isArchived: false,
          isTemplate: true,
          version: 2,
          isLatestVersion: true,
          hasVersionHistory: true,
          downloadCount: 12,
          lastAccessedAt: '2024-01-13T16:45:00Z',
          uploadedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
          changedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
          changeNotes: 'Updated template with new compliance requirements',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T15:30:00Z'
        },
        {
          _id: '4',
          title: 'Client Agreement - DEF Industries',
          description: 'Service agreement with DEF Industries',
          fileName: 'client-agreement-def-industries',
          originalName: 'Client_Agreement_DEF_Industries.pdf',
          fileSize: 3072000,
          mimeType: 'application/pdf',
          category: 'client',
          tags: ['Agreement', 'DEF Industries', 'Contract'],
          clientId: { _id: '3', name: 'DEF Industries' },
          documentType: 'OTHER',
          isPublic: false,
          isArchived: false,
          isTemplate: false,
          version: 1,
          isLatestVersion: true,
          hasVersionHistory: false,
          downloadCount: 2,
          lastAccessedAt: '2024-01-11T09:15:00Z',
          uploadedBy: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
          createdAt: '2024-01-08T13:00:00Z',
          updatedAt: '2024-01-11T09:15:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory
    const matchesDocumentType = !selectedDocumentType || doc.documentType === selectedDocumentType
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag))
    const matchesArchived = showArchived ? true : !doc.isArchived
    const matchesTemplates = showTemplates ? true : !doc.isTemplate
    
    return matchesSearch && matchesCategory && matchesDocumentType && matchesTags && matchesArchived && matchesTemplates
  })

  const handleUploadSuccess = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev])
    setShowUploadModal(false)
  }

  const handleDownload = (documentId: string) => {
    // Implement download logic
    console.log('Downloading document:', documentId)
  }

  const handleViewVersionHistory = (document: Document) => {
    setSelectedDocument(document)
    setShowVersionHistoryModal(true)
  }

  const handleCreateVersion = (document: Document) => {
    setSelectedDocument(document)
    setShowCreateVersionModal(true)
  }

  const handleVersionCreated = (documentId: string) => {
    // Refresh documents or update the specific document
    console.log('New version created for document:', documentId)
    setShowCreateVersionModal(false)
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    return '📁'
  }

  const getFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'compliance': 'bg-red-100 text-red-800 border-red-200',
      'client': 'bg-blue-100 text-blue-800 border-blue-200',
      'project': 'bg-green-100 text-green-800 border-green-200',
      'template': 'bg-purple-100 text-purple-800 border-purple-200',
      'internal': 'bg-gray-100 text-gray-800 border-gray-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category] || colors['other']
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'GST': 'bg-green-100 text-green-800 border-green-200',
      'TDS': 'bg-blue-100 text-blue-800 border-blue-200',
      'ITR': 'bg-purple-100 text-purple-800 border-purple-200',
      'ROC': 'bg-orange-100 text-orange-800 border-orange-200',
      'AUDIT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'OTHER': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type] || colors['OTHER']
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage your firm's document library with version control and audit trails"
      >
        <PageHeaderActions>
          <RequirePermission permission="documents:upload">
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory || selectedDocumentType || selectedTags.length > 0 || showArchived || showTemplates) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedDocumentType('')
                  setSelectedTags([])
                  setShowArchived(false)
                  setShowTemplates(false)
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show Archived</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTemplates}
                  onChange={(e) => setShowTemplates(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show Templates</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Documents ({filteredDocuments.length})</span>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {viewMode === 'grid' ? 'Grid View' : 'List View'}
            </div>
          </CardTitle>
          <CardDescription>
            Manage your firm's document library with version control
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocuments.map((doc) => (
                <div key={doc._id} className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  {/* Document Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-2xl">{getFileIcon(doc.mimeType)}</span>
                  </div>

                  {/* Version Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      v{doc.version}
                    </Badge>
                  </div>

                  {/* Document Info */}
                  <div className="text-center mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Size:</span>
                      <span className="text-gray-900 dark:text-white">{getFileSize(doc.fileSize)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <Badge className={cn("text-xs", getDocumentTypeColor(doc.documentType))}>
                        {doc.documentType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                        {doc.category}
                      </Badge>
                    </div>
                    {doc.hasVersionHistory && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">History:</span>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                          <GitBranch className="w-3 h-3 mr-1" />
                          Available
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {doc.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            +{doc.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <User className="h-3 w-3" />
                      <span>{doc.uploadedBy.firstName} {doc.uploadedBy.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RequirePermission permission="documents:read">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </RequirePermission>
                      <RequirePermission permission="documents:read">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(doc._id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </RequirePermission>
                      {doc.hasVersionHistory && (
                        <RequirePermission permission="documents:read">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewVersionHistory(doc)}
                            title="View Version History"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </RequirePermission>
                      )}
                      <RequirePermission permission="documents:version">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleCreateVersion(doc)}
                          title="Create New Version"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </RequirePermission>
                      <RequirePermission permission="documents:share">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </RequirePermission>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    {doc.isTemplate && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    {doc.isArchived && (
                      <Archive className="h-4 w-4 text-gray-500" />
                    )}
                    {doc.isPublic && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Document</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Version</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Client/Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Uploaded</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{getFileIcon(doc.mimeType)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {doc.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.originalName}
                            </div>
                            {doc.description && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {doc.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                            v{doc.version}
                          </Badge>
                          {doc.hasVersionHistory && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                              <GitBranch className="w-3 h-3 mr-1" />
                              History
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={cn("text-xs", getCategoryColor(doc.category))}>
                            {doc.category}
                          </Badge>
                          <Badge className={cn("text-xs", getDocumentTypeColor(doc.documentType))}>
                            {doc.documentType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {doc.clientId?.name || doc.projectId?.name || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getFileSize(doc.fileSize)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(doc.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          by {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                        </div>
                        {doc.changedBy && doc.changedBy._id !== doc.uploadedBy._id && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Updated by {doc.changedBy.firstName} {doc.changedBy.lastName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <RequirePermission permission="documents:read">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </RequirePermission>
                          <RequirePermission permission="documents:read">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownload(doc._id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </RequirePermission>
                          {doc.hasVersionHistory && (
                            <RequirePermission permission="documents:read">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewVersionHistory(doc)}
                                title="View Version History"
                              >
                                <History className="h-4 w-4" />
                              </Button>
                            </RequirePermission>
                          )}
                          <RequirePermission permission="documents:version">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCreateVersion(doc)}
                              title="Create New Version"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </RequirePermission>
                          <RequirePermission permission="documents:share">
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </RequirePermission>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Version History Modal */}
      {selectedDocument && (
        <VersionHistoryModal
          isOpen={showVersionHistoryModal}
          onClose={() => setShowVersionHistoryModal(false)}
          documentId={selectedDocument._id}
          currentVersion={{
            _id: selectedDocument._id,
            version: selectedDocument.version,
            fileName: selectedDocument.fileName,
            originalName: selectedDocument.originalName,
            filePath: selectedDocument.fileName,
            fileSize: selectedDocument.fileSize,
            mimeType: selectedDocument.mimeType,
            fileExtension: selectedDocument.fileName.split('.').pop() || '',
            changedBy: {
              _id: (selectedDocument.changedBy || selectedDocument.uploadedBy)?._id || '',
              name: (selectedDocument.changedBy || selectedDocument.uploadedBy)?.firstName 
                ? `${(selectedDocument.changedBy || selectedDocument.uploadedBy)?.firstName} ${(selectedDocument.changedBy || selectedDocument.uploadedBy)?.lastName}`
                : 'Unknown User',
              email: 'user@example.com' // Default email since uploadedBy doesn't have email
            },
            changeNotes: selectedDocument.changeNotes,
            createdAt: selectedDocument.createdAt,
            isLatestVersion: selectedDocument.isLatestVersion
          }}
        />
      )}

      {/* Create Version Modal */}
      {selectedDocument && (
        <CreateVersionModal
          isOpen={showCreateVersionModal}
          onClose={() => setShowCreateVersionModal(false)}
          documentId={selectedDocument._id}
          currentDocument={{
            title: selectedDocument.title,
            originalName: selectedDocument.originalName,
            version: selectedDocument.version,
            fileSize: selectedDocument.fileSize,
            mimeType: selectedDocument.mimeType
          }}
          onSubmit={async (file, changeNotes) => {
            // Implement version creation logic
            console.log('Creating new version:', { file, changeNotes });
            await handleVersionCreated(selectedDocument._id);
          }}
        />
      )}
    </div>
  )
}
