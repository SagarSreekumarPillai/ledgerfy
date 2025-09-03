'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye,
  Settings,
  RefreshCw,
  BarChart3,
  Search,
  Grid3X3,
  List,
  FileSpreadsheet,
  Link,
  Save,
  Play
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface TallyImport {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: Date
  status: 'uploading' | 'processing' | 'mapping' | 'validating' | 'importing' | 'completed' | 'error'
  progress: number
  data: {
    totalEntries: number
    totalAmount: number
    dateRange: { from: Date; to: Date }
    accounts: string[]
    voucherTypes: string[]
  }
  mapping: {
    accountMapping: Record<string, string>
    voucherTypeMapping: Record<string, string>
    dateFormat: string
    currency: string
  }
  validation: {
    totalErrors: number
    totalWarnings: number
  }
}

export default function TallyImportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imports, setImports] = useState<TallyImport[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [editingImport, setEditingImport] = useState<TallyImport | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const newImports: TallyImport[] = Array.from(files).map((file, index) => ({
      id: `import-${Date.now()}-${index}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
      status: 'uploading',
      progress: 0,
      data: {
        totalEntries: 0,
        totalAmount: 0,
        dateRange: { from: new Date(), to: new Date() },
        accounts: [],
        voucherTypes: []
      },
      mapping: {
        accountMapping: {},
        voucherTypeMapping: {},
        dateFormat: 'DD/MM/YYYY',
        currency: 'INR'
      },
      validation: {
        totalErrors: 0,
        totalWarnings: 0
      }
    }))

    setImports(prev => [...prev, ...newImports])

    // Simulate upload progress
    newImports.forEach((importItem) => {
      const interval = setInterval(() => {
        setImports(prev => 
          prev.map(imp => 
            imp.id === importItem.id 
              ? { ...imp, progress: Math.min(imp.progress + Math.random() * 30, 100) }
              : imp
          )
        )

        if (importItem.progress >= 100) {
          clearInterval(interval)
          setImports(prev => 
            prev.map(imp => 
              imp.id === importItem.id 
                ? { ...imp, status: 'processing', progress: 0 }
                : imp
            )
          )
          
          setTimeout(() => {
            setImports(prev => 
              prev.map(imp => 
                imp.id === importItem.id 
                  ? { ...imp, status: 'mapping', data: {
                      totalEntries: Math.floor(Math.random() * 1000) + 100,
                      totalAmount: Math.floor(Math.random() * 1000000) + 100000,
                      dateRange: { 
                        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                        to: new Date() 
                      },
                      accounts: ['Cash', 'Bank', 'Sales', 'Purchase', 'Expenses'],
                      voucherTypes: ['Receipt', 'Payment', 'Journal', 'Sales', 'Purchase']
                    }}
                  : imp
              )
            )
          }, 2000)
        }
      }, 300)
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <Upload className="h-4 w-4 text-blue-500" />
      case 'processing': return <RefreshCw className="h-4 w-4 text-orange-500 animate-spin" />
      case 'mapping': return <Settings className="h-4 w-4 text-purple-500" />
      case 'validating': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'importing': return <Database className="h-4 w-4 text-green-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'processing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'mapping': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'validating': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'importing': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const openMappingModal = (importItem: TallyImport) => {
    setEditingImport(importItem)
    setShowMappingModal(true)
  }

  const filteredImports = imports.filter(importItem =>
    importItem.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    importItem.status === selectedStatus ||
    selectedStatus === 'all'
  )

  const stats = {
    completed: imports.filter(imp => imp.status === 'completed').length,
    totalEntries: imports.reduce((sum, imp) => sum + (imp.data.totalEntries || 0), 0),
    totalAmount: imports.reduce((sum, imp) => sum + (imp.data.totalAmount || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Tally Import"
        description="Import and synchronize data from Tally Prime with advanced mapping and validation"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Ledger', href: '/dashboard/ledger' },
          { label: 'Tally Import', href: '/dashboard/ledger/import' }
        ]}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/ledger')}>
            <Database className="h-4 w-4 mr-2" />
            View Ledger
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Tally Data
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Import Area */}
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
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop Tally export files here or click to import
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Support for Tally XML, Excel, and CSV exports. Max file size: 50MB
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
                accept=".xml,.xlsx,.xls,.csv,.txt"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Imports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{imports.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.totalEntries.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search imports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="uploading">Uploading</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="mapping">Mapping</SelectItem>
                <SelectItem value="validating">Validating</SelectItem>
                <SelectItem value="importing">Importing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Imports Grid */}
        {filteredImports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImports.map((importItem) => (
              <Card key={importItem.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
                            {importItem.fileName}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(importItem.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(importItem.status)}
                        <Badge variant="outline" className={getStatusColor(importItem.status)}>
                          {importItem.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {importItem.status === 'uploading' && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${importItem.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {importItem.progress.toFixed(0)}% uploaded
                        </p>
                      </div>
                    )}
                    
                    {importItem.data.totalEntries > 0 && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Entries</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {importItem.data.totalEntries.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ₹{(importItem.data.totalAmount / 100000).toFixed(2)}L
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Uploaded {importItem.uploadedAt.toLocaleDateString()}</span>
                      
                      <div className="flex items-center space-x-2">
                        {importItem.status === 'mapping' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              openMappingModal(importItem)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Map
                          </Button>
                        )}
                        
                        {importItem.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No imports yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start by importing your first Tally export file above
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import Tally Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mapping Modal */}
      {showMappingModal && editingImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Data Mapping - {editingImport.fileName}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMappingModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Map Tally data fields to your ledger accounts and voucher types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">File Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">File Name:</span>
                          <span className="font-medium">{editingImport.fileName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Total Entries:</span>
                          <span className="font-medium">{editingImport.data.totalEntries}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                          <span className="font-medium">₹{(editingImport.data.totalAmount / 100000).toFixed(2)}L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accounts" className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Account Mapping</h4>
                    <div className="space-y-3">
                      {editingImport.data.accounts.map((tallyAccount) => (
                        <div key={tallyAccount} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {tallyAccount}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Tally Account
                            </p>
                          </div>
                          <Link className="h-4 w-4 text-gray-400" />
                          <Select>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select Ledger Account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash in Hand</SelectItem>
                              <SelectItem value="bank">Bank Account</SelectItem>
                              <SelectItem value="sales">Sales Revenue</SelectItem>
                              <SelectItem value="expenses">Operating Expenses</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vouchers" className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Voucher Type Mapping</h4>
                    <div className="space-y-3">
                      {editingImport.data.voucherTypes.map((tallyVoucher) => (
                        <div key={tallyVoucher} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {tallyVoucher}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Tally Voucher Type
                            </p>
                          </div>
                          <Link className="h-4 w-4 text-gray-400" />
                          <Select>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select Voucher Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="receipt">Receipt</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                              <SelectItem value="journal">Journal</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="purchase">Purchase</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowMappingModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowMappingModal(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Mapping
                </Button>
                <Button variant="default">
                  <Play className="h-4 w-4 mr-2" />
                  Start Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
