'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Tag,
  File,
  Archive,
  Star,
  GitBranch,
  History,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  MessageSquare,
  Lock,
  Unlock,
  Copy,
  ExternalLink
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  clientId: { _id: string; name: string }
  documentType: string
  isPublic: boolean
  isArchived: boolean
  isTemplate: boolean
  version: number
  isLatestVersion: boolean
  hasVersionHistory: boolean
  downloadCount: number
  lastAccessedAt: string
  uploadedBy: { _id: string; firstName: string; lastName: string }
  createdAt: string
  updatedAt: string
}

interface Version {
  _id: string
  version: number
  fileName: string
  fileSize: number
  uploadedBy: { _id: string; firstName: string; lastName: string }
  uploadedAt: string
  changeDescription: string
  isLatest: boolean
}

interface Comment {
  _id: string
  content: string
  author: { _id: string; firstName: string; lastName: string }
  createdAt: string
  isResolved: boolean
}

interface AccessLog {
  _id: string
  user: { _id: string; firstName: string; lastName: string }
  action: string
  timestamp: string
  ipAddress: string
}

export default function DocumentDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string

  const [document, setDocument] = useState<Document | null>(null)
  const [versions, setVersions] = useState<Version[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setDocument({
        _id: documentId,
        title: 'Annual Financial Statements 2023-24',
        description: 'Complete financial statements including balance sheet, profit & loss account, and cash flow statement for the financial year 2023-24.',
        fileName: 'annual_financial_statements_2023_24.pdf',
        originalName: 'Annual Financial Statements 2023-24.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf',
        category: 'client',
        tags: ['Financial Statements', 'Annual Report', 'ABC Company', 'Audit'],
        clientId: { _id: '1', name: 'ABC Company Ltd' },
        documentType: 'FINANCIAL_STATEMENT',
        isPublic: false,
        isArchived: false,
        isTemplate: false,
        version: 3,
        isLatestVersion: true,
        hasVersionHistory: true,
        downloadCount: 15,
        lastAccessedAt: '2025-01-15T10:30:00Z',
        uploadedBy: { _id: '1', firstName: 'John', lastName: 'Doe' },
        createdAt: '2024-12-01T09:00:00Z',
        updatedAt: '2025-01-10T14:20:00Z'
      })

      setVersions([
        {
          _id: '1',
          version: 3,
          fileName: 'annual_financial_statements_2023_24_v3.pdf',
          fileSize: 2048000,
          uploadedBy: { _id: '1', firstName: 'John', lastName: 'Doe' },
          uploadedAt: '2025-01-10T14:20:00Z',
          changeDescription: 'Updated with final audit adjustments and corrections',
          isLatest: true
        },
        {
          _id: '2',
          version: 2,
          fileName: 'annual_financial_statements_2023_24_v2.pdf',
          fileSize: 1980000,
          uploadedBy: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          uploadedAt: '2025-01-05T11:15:00Z',
          changeDescription: 'Added notes to financial statements and updated disclosures',
          isLatest: false
        },
        {
          _id: '3',
          version: 1,
          fileName: 'annual_financial_statements_2023_24_v1.pdf',
          fileSize: 1850000,
          uploadedBy: { _id: '1', firstName: 'John', lastName: 'Doe' },
          uploadedAt: '2024-12-01T09:00:00Z',
          changeDescription: 'Initial draft of financial statements',
          isLatest: false
        }
      ])

      setComments([
        {
          _id: '1',
          content: 'Please review the depreciation calculation on page 15. The rate seems incorrect.',
          author: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          createdAt: '2025-01-12T16:30:00Z',
          isResolved: true
        },
        {
          _id: '2',
          content: 'The cash flow statement looks good. Ready for final review.',
          author: { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
          createdAt: '2025-01-14T10:15:00Z',
          isResolved: false
        }
      ])

      setAccessLogs([
        {
          _id: '1',
          user: { _id: '1', firstName: 'John', lastName: 'Doe' },
          action: 'Downloaded',
          timestamp: '2025-01-15T10:30:00Z',
          ipAddress: '192.168.1.100'
        },
        {
          _id: '2',
          user: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          action: 'Viewed',
          timestamp: '2025-01-14T15:45:00Z',
          ipAddress: '192.168.1.101'
        },
        {
          _id: '3',
          user: { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
          action: 'Downloaded',
          timestamp: '2025-01-13T09:20:00Z',
          ipAddress: '192.168.1.102'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [documentId])

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      FINANCIAL_STATEMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      TAX_RETURN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      AUDIT_REPORT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      COMPLIANCE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[type as keyof typeof colors] || colors.OTHER
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      client: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      internal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      compliance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      template: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[category as keyof typeof colors] || colors.client
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Document..."
          description="Please wait while we fetch the document information."
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading document details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Document Not Found"
          description="The requested document could not be found."
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Document Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The document you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push('/dashboard/documents')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={document.title}
        description={`${document.originalName} • ${formatFileSize(document.fileSize)}`}
      >
        <PageHeaderActions>
          <Button variant="outline" onClick={() => router.push('/dashboard/documents')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Document Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">File Size</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatFileSize(document.fileSize)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{document.downloadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <GitBranch className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Version</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">v{document.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Accessed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatTimeAgo(document.lastAccessedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="access">Access Log</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Document Information */}
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Basic document details and metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Title</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{document.title}</p>
                </div>
                {document.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{document.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">File Name</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{document.originalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">MIME Type</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{document.mimeType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Category</p>
                  <Badge className={cn("text-xs", getCategoryColor(document.category))}>
                    {document.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Document Type</p>
                  <Badge className={cn("text-xs", getDocumentTypeColor(document.documentType))}>
                    {document.documentType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Document Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Document Properties</CardTitle>
                <CardDescription>Status and access information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Public Access</span>
                  <div className="flex items-center space-x-2">
                    {document.isPublic ? (
                      <Unlock className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {document.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Archived</span>
                  <div className="flex items-center space-x-2">
                    {document.isArchived ? (
                      <Archive className="h-4 w-4 text-orange-600" />
                    ) : (
                      <File className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {document.isArchived ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Template</span>
                  <div className="flex items-center space-x-2">
                    {document.isTemplate ? (
                      <Star className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {document.isTemplate ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Latest Version</span>
                  <div className="flex items-center space-x-2">
                    {document.isLatestVersion ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {document.isLatestVersion ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Client</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{document.clientId.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Uploaded By</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {document.uploadedBy.firstName} {document.uploadedBy.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(document.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Document tags for easy categorization and search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>All versions of this document with change descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Version {version.version}
                          </h4>
                          {version.isLatest && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {version.changeDescription}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{formatFileSize(version.fileSize)}</span>
                          <span>Uploaded by {version.uploadedBy.firstName} {version.uploadedBy.lastName}</span>
                          <span>{formatTimeAgo(version.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {!version.isLatest && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments & Discussions</CardTitle>
              <CardDescription>Comments and discussions about this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.author.firstName[0]}{comment.author.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author.firstName} {comment.author.lastName}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                        {comment.isResolved && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Log</CardTitle>
              <CardDescription>Recent access and download history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessLogs.map((log) => (
                  <div key={log._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.user.firstName} {log.user.lastName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {log.action} • {log.ipAddress}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Permissions</CardTitle>
              <CardDescription>Manage who can access and modify this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">John Doe</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Full Access
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Jane Smith</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Team Member</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Read & Comment
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mike Johnson</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    Read Only
                  </Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Permission
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

