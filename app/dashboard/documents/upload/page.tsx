'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  FolderOpen, 
  Users, 
  Tag, 
  Calendar,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Info,
  Download,
  Eye,
  Trash2,
  Edit3,
  Share2,
  Lock,
  Globe,
  UserCheck,
  Clock,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  status: 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  metadata: {
    title: string
    description: string
    tags: string[]
    category: string
    clientId?: string
    projectId?: string
    confidentiality: 'public' | 'internal' | 'confidential' | 'restricted'
    retentionPeriod: number
  }
}

interface Folder {
  id: string
  name: string
  path: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export default function DocumentUploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showMetadataEditor, setShowMetadataEditor] = useState(false)
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Mock folders data
  useState(() => {
    setFolders([
      { id: '1', name: 'Root', path: '/', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Client Documents', path: '/client-documents', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: 'Compliance', path: '/compliance', createdAt: new Date(), updatedAt: new Date() },
      { id: '4', name: 'Projects', path: '/projects', createdAt: new Date(), updatedAt: new Date() },
      { id: '5', name: 'Templates', path: '/templates', createdAt: new Date(), updatedAt: new Date() }
    ])
  })

  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'uploading',
      progress: 0,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        tags: [],
        category: 'general',
        confidentiality: 'internal',
        retentionPeriod: 7 * 365 // 7 years default
      }
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 20, 100) }
              : f
          )
        )

        if (file.progress >= 100) {
          clearInterval(interval)
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'completed', progress: 100 }
                : f
            )
          )
        }
      }, 200)
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />
    if (type.startsWith('video/')) return <FileVideo className="h-8 w-8 text-purple-500" />
    if (type.startsWith('audio/')) return <FileAudio className="h-8 w-8 text-green-500" />
    if (type.includes('zip') || type.includes('rar')) return <FileArchive className="h-8 w-8 text-orange-500" />
    if (type.includes('code') || type.includes('json')) return <FileCode className="h-8 w-8 text-gray-500" />
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  const handleBulkAction = (action: 'delete' | 'share' | 'download') => {
    if (action === 'delete') {
      setUploadedFiles(prev => prev.filter(f => !selectedFiles.has(f.id)))
      setSelectedFiles(new Set())
    }
    // Implement other actions
  }

  const openMetadataEditor = (file: UploadedFile) => {
    setEditingFile(file)
    setShowMetadataEditor(true)
  }

  const saveMetadata = () => {
    if (editingFile) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === editingFile.id ? editingFile : f)
      )
      setShowMetadataEditor(false)
      setEditingFile(null)
    }
  }

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Document Upload"
        description="Upload, organize, and manage your documents with advanced metadata and security controls"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Documents', href: '/dashboard/documents' },
          { label: 'Upload', href: '/dashboard/documents/upload' }
        ]}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/documents')}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Browse Documents
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload Area */}
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <CardContent className="p-8">
            <div
              className={cn(
                "text-center transition-all duration-200",
                isDragOver && "scale-105"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Support for PDF, Word, Excel, images, and more. Max file size: 100MB
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="client">Client Documents</SelectItem>
                <SelectItem value="project">Project Files</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
        </div>

        {/* Bulk Actions */}
        {selectedFiles.size > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedFiles.size} file(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('share')}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('download')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files Grid/List */}
        {filteredFiles.length > 0 ? (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className={cn(
                  "group cursor-pointer transition-all duration-200 hover:shadow-lg",
                  selectedFiles.has(file.id) && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                )}
                onClick={() => handleFileSelect(file.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {file.metadata.title || file.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {file.metadata.confidentiality === 'confidential' && (
                            <Lock className="h-3 w-3 text-red-500" />
                          )}
                          {file.metadata.confidentiality === 'restricted' && (
                            <UserCheck className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {file.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.metadata.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {file.metadata.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{file.metadata.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {file.progress.toFixed(0)}% uploaded
                          </p>
                        </div>
                      )}

                      {file.status === 'completed' && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Upload complete
                          </span>
                        </div>
                      )}

                      {file.status === 'error' && (
                        <div className="flex items-center space-x-1 mt-2">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">
                            Upload failed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          openMetadataEditor(file)
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No files uploaded yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start by uploading your first document or drag and drop files above
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Metadata Editor Modal */}
      {showMetadataEditor && editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Edit File Metadata
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMetadataEditor(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <Input
                  value={editingFile.metadata.title}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    metadata: { ...editingFile.metadata, title: e.target.value }
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={editingFile.metadata.description}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    metadata: { ...editingFile.metadata, description: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    value={editingFile.metadata.category}
                    onValueChange={(value) => setEditingFile({
                      ...editingFile,
                      metadata: { ...editingFile.metadata, category: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="client">Client Documents</SelectItem>
                      <SelectItem value="project">Project Files</SelectItem>
                      <SelectItem value="template">Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidentiality
                  </label>
                  <Select
                    value={editingFile.metadata.confidentiality}
                    onValueChange={(value: any) => setEditingFile({
                      ...editingFile,
                      metadata: { ...editingFile.metadata, confidentiality: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={editingFile.metadata.tags.join(', ')}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    metadata: { 
                      ...editingFile.metadata, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }
                  })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMetadataEditor(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveMetadata}>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
