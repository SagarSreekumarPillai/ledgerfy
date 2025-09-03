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
  Star
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { UploadModal } from '@/components/documents/UploadModal'
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
  downloadCount: number
  lastAccessedAt?: string
  uploadedBy: {
    _id: string
    firstName: string
    lastName: string
  }
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
          version: 1,
          downloadCount: 5,
          lastAccessedAt: '2024-01-15T10:30:00Z',
          uploadedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
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
          downloadCount: 12,
          lastAccessedAt: '2024-01-13T16:45:00Z',
          uploadedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('text')) return '📄'
    return '📎'
  }

  const getFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      compliance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      client: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      project: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      internal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      template: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      GST: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      TDS: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      ITR: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ROC: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      AUDIT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[type as keyof typeof colors] || colors.OTHER
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleDownload = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '' // Will use the filename from Content-Disposition header
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleUploadSuccess = () => {
    // Refresh documents list
    // In a real app, you would fetch the updated list from the API
    console.log('Document uploaded successfully, refreshing list...')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Documents"
          description="Manage and organize your firm's documents"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage and organize your firm's documents"
      >
        <PageHeaderActions>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <RequirePermission permission="documents:upload">
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="compliance">Compliance</option>
                <option value="client">Client</option>
                <option value="project">Project</option>
                <option value="internal">Internal</option>
                <option value="template">Template</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="GST">GST</option>
                <option value="TDS">TDS</option>
                <option value="ITR">ITR</option>
                <option value="ROC">ROC</option>
                <option value="AUDIT">Audit</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="flex items-end">
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
            </div>

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
            Manage your firm's document library
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
    </div>
  )
}
