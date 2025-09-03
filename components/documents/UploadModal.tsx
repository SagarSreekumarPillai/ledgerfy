'use client'

import { useState, useRef } from 'react'
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Calendar,
  Tag,
  User,
  Building,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (document?: any) => void
}

interface UploadFormData {
  title: string
  description: string
  category: string
  tags: string[]
  clientId: string
  projectId: string
  complianceId: string
  documentType: string
  financialYear: string
  assessmentYear: string
  filingPeriod: string
  dueDate: string
  isPublic: boolean
  isTemplate: boolean
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    category: 'other',
    tags: [],
    clientId: '',
    projectId: '',
    complianceId: '',
    documentType: 'OTHER',
    financialYear: '',
    assessmentYear: '',
    filingPeriod: '',
    dueDate: '',
    isPublic: false,
    isTemplate: false
  })

  const [tagInput, setTagInput] = useState('')

  // Mock data - replace with actual API calls
  const clients = [
    { _id: '1', name: 'ABC Corporation' },
    { _id: '2', name: 'XYZ Limited' },
    { _id: '3', name: 'DEF Industries' }
  ]

  const projects = [
    { _id: '1', name: 'GST Compliance 2024-25' },
    { _id: '2', name: 'TDS Filing Q4' },
    { _id: '3', name: 'Annual Audit 2024' }
  ]

  const complianceItems = [
    { _id: '1', title: 'GST Return Q3 2024-25' },
    { _id: '2', title: 'TDS Certificate FY 2023-24' },
    { _id: '3', title: 'ITR Filing 2024-25' }
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
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
      setErrors({ file: 'Invalid file type. Please select a supported document.' })
      return
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setErrors({ file: 'File size exceeds 50MB limit.' })
      return
    }
    
    setSelectedFile(file)
    setErrors({})
    
    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
      setFormData(prev => ({ ...prev, title: fileName }))
    }
  }

  const handleInputChange = (field: keyof UploadFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload'
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }
    
    if (formData.financialYear && !/^\d{4}-\d{4}$/.test(formData.financialYear)) {
      newErrors.financialYear = 'Financial year must be in format YYYY-YYYY'
    }
    
    if (formData.assessmentYear && !/^\d{4}-\d{4}$/.test(formData.assessmentYear)) {
      newErrors.assessmentYear = 'Assessment year must be in format YYYY-YYYY'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', selectedFile!)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('tags', formData.tags.join(','))
      formDataToSend.append('clientId', formData.clientId)
      formDataToSend.append('projectId', formData.projectId)
      formDataToSend.append('complianceId', formData.complianceId)
      formDataToSend.append('documentType', formData.documentType)
      formDataToSend.append('financialYear', formData.financialYear)
      formDataToSend.append('assessmentYear', formData.assessmentYear)
      formDataToSend.append('filingPeriod', formData.filingPeriod)
      formDataToSend.append('dueDate', formData.dueDate)
      formDataToSend.append('isPublic', formData.isPublic.toString())
      formDataToSend.append('isTemplate', formData.isTemplate.toString())
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formDataToSend
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (response.ok) {
        setUploadStatus('success')
        setUploadMessage('Document uploaded successfully!')
        
        // Reset form
        setTimeout(() => {
          onUploadSuccess()
          onClose()
          resetForm()
        }, 1500)
      } else {
        const errorData = await response.json()
        setUploadStatus('error')
        setUploadMessage(errorData.error || 'Upload failed')
      }
    } catch (error) {
      setUploadStatus('error')
      setUploadMessage('Network error during upload')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'other',
      tags: [],
      clientId: '',
      projectId: '',
      complianceId: '',
      documentType: 'OTHER',
      financialYear: '',
      assessmentYear: '',
      filingPeriod: '',
      dueDate: '',
      isPublic: false,
      isTemplate: false
    })
    setSelectedFile(null)
    setTagInput('')
    setErrors({})
    setUploadStatus('idle')
    setUploadMessage('')
    setUploadProgress(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Add a new document to your firm's library
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document File *
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
                    selectedFile && "border-green-500 bg-green-50 dark:bg-green-900/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="mx-auto h-12 w-12 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, Word, Excel, Images up to 50MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.file}
                  </p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      errors.title
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="Enter document title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="other">Other</option>
                    <option value="compliance">Compliance</option>
                    <option value="client">Client</option>
                    <option value="project">Project</option>
                    <option value="internal">Internal</option>
                    <option value="template">Template</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter document description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag and press Enter"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Type
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="OTHER">Other</option>
                    <option value="GST">GST</option>
                    <option value="TDS">TDS</option>
                    <option value="ITR">ITR</option>
                    <option value="ROC">ROC</option>
                    <option value="AUDIT">Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filing Period
                  </label>
                  <select
                    value={formData.filingPeriod}
                    onChange={(e) => handleInputChange('filingPeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Period</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Financial Year
                  </label>
                  <input
                    type="text"
                    value={formData.financialYear}
                    onChange={(e) => handleInputChange('financialYear', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      errors.financialYear
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="YYYY-YYYY (e.g., 2024-2025)"
                  />
                  {errors.financialYear && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.financialYear}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assessment Year
                  </label>
                  <input
                    type="text"
                    value={formData.assessmentYear}
                    onChange={(e) => handleInputChange('assessmentYear', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      errors.assessmentYear
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="YYYY-YYYY (e.g., 2024-2025)"
                  />
                  {errors.assessmentYear && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assessmentYear}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Associations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compliance Item
                  </label>
                  <select
                    value={formData.complianceId}
                    onChange={(e) => handleInputChange('complianceId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Compliance Item</option>
                    {complianceItems.map(item => (
                      <option key={item._id} value={item._id}>{item.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Make document public</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isTemplate}
                    onChange={(e) => handleInputChange('isTemplate', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as template</span>
                </label>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="min-w-[100px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
