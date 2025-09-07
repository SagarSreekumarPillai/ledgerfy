'use client'

import { useState } from 'react'
import { 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  MessageSquare, 
  Calendar,
  BarChart3,
  DollarSign,
  Shield,
  Bell,
  Search,
  Filter,
  Eye,
  Send,
  Upload,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ClientDocument {
  id: string
  name: string
  type: 'invoice' | 'report' | 'compliance' | 'contract' | 'tax'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  uploadedAt: Date
  dueDate?: Date
  size: number
  uploadedBy: string
}

interface ComplianceItem {
  id: string
  title: string
  category: 'tax' | 'audit' | 'regulatory' | 'financial'
  status: 'compliant' | 'pending' | 'overdue' | 'at-risk'
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

interface FinancialSummary {
  currentMonth: {
    revenue: number
    expenses: number
    profit: number
    growth: number
  }
  outstandingInvoices: number
  overdueAmount: number
  taxLiability: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
}

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)

  // Handler functions
  const handleUploadDocuments = () => {
    setShowUploadModal(true)
  }

  const handleScheduleMeeting = () => {
    setShowMeetingModal(true)
  }

  const handleRequestReport = () => {
    setShowReportModal(true)
  }

  const handleSetReminders = () => {
    setShowReminderModal(true)
  }

  // Mock data
  const clientInfo = {
    name: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    phone: '+91 98765 43210',
    address: '123 Business Park, Mumbai, Maharashtra 400001',
    industry: 'Technology',
    clientSince: '2020',
    status: 'active'
  }

  const documents: ClientDocument[] = [
    {
      id: '1',
      name: 'Q4 Financial Report 2024',
      type: 'report',
      status: 'approved',
      uploadedAt: new Date('2024-01-15'),
      size: 2048,
      uploadedBy: 'CA Team'
    },
    {
      id: '2',
      name: 'GST Return - March 2024',
      type: 'tax',
      status: 'pending',
      uploadedAt: new Date('2024-03-20'),
      dueDate: new Date('2024-04-20'),
      size: 512,
      uploadedBy: 'Tax Team'
    },
    {
      id: '3',
      name: 'Audit Compliance Certificate',
      type: 'compliance',
      status: 'approved',
      uploadedAt: new Date('2024-02-10'),
      size: 1024,
      uploadedBy: 'Audit Team'
    }
  ]

  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      title: 'GST Return Filing',
      category: 'tax',
      status: 'pending',
      dueDate: new Date('2024-04-20'),
      priority: 'high',
      description: 'Monthly GST return for March 2024'
    },
    {
      id: '2',
      title: 'Annual Tax Return',
      category: 'tax',
      status: 'overdue',
      dueDate: new Date('2024-07-31'),
      priority: 'critical',
      description: 'Income tax return for FY 2023-24'
    },
    {
      id: '3',
      title: 'Statutory Audit',
      category: 'audit',
      status: 'compliant',
      dueDate: new Date('2024-09-30'),
      priority: 'medium',
      description: 'Annual statutory audit compliance'
    }
  ]

  const financialSummary: FinancialSummary = {
    currentMonth: {
      revenue: 2500000,
      expenses: 1800000,
      profit: 700000,
      growth: 12.5
    },
    outstandingInvoices: 450000,
    overdueAmount: 125000,
    taxLiability: 320000
  }

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Document Approved',
      message: 'Your Q4 Financial Report has been approved and is ready for download.',
      type: 'success',
      timestamp: new Date('2024-01-15T10:30:00'),
      read: false
    },
    {
      id: '2',
      title: 'Compliance Due Soon',
      message: 'GST return for March 2024 is due in 5 days.',
      type: 'warning',
      timestamp: new Date('2024-01-14T15:45:00'),
      read: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'overdue':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Client Portal"
        description="Access your documents, compliance status, financial reports, and communicate with your CA team"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact CA Team
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Client Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-blue-600" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{clientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{clientInfo.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Since</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{clientInfo.clientSince}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {clientInfo.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(financialSummary.outstandingInvoices)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Items</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {complianceItems.filter(item => item.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'success' ? 'bg-green-100 text-green-600' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        notification.type === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {notification.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Access and manage your business documents</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.type} • {formatFileSize(doc.size)} • Uploaded by {doc.uploadedBy}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Compliance Status</CardTitle>
                    <CardDescription>Track your compliance requirements and deadlines</CardDescription>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Due Date</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Current month overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-medium text-green-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(financialSummary.currentMonth.revenue)}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">
                          +{financialSummary.currentMonth.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm font-medium text-red-600">Expenses</p>
                      <p className="text-2xl font-bold text-red-700">
                        {formatCurrency(financialSummary.currentMonth.expenses)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Net Profit</p>
                    <p className="text-3xl font-bold text-blue-700">
                      {formatCurrency(financialSummary.currentMonth.profit)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Outstanding Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Outstanding Items</CardTitle>
                  <CardDescription>Pending payments and obligations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Outstanding Invoices</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pending payments</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-yellow-700">
                        {formatCurrency(financialSummary.outstandingInvoices)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Overdue Amount</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Past due payments</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-red-700">
                        {formatCurrency(financialSummary.overdueAmount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Tax Liability</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Estimated tax due</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency(financialSummary.taxLiability)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Communications</CardTitle>
                <CardDescription>Stay connected with your CA team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar>
                      <AvatarImage src="/avatars/ca-team.jpg" />
                      <AvatarFallback>CA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">CA Team</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your dedicated team of Chartered Accountants
                      </p>
                    </div>
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleUploadDocuments}>
                      <Upload className="h-6 w-6" />
                      <span>Upload Documents</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleScheduleMeeting}>
                      <Calendar className="h-6 w-6" />
                      <span>Schedule Meeting</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleRequestReport}>
                      <BarChart3 className="h-6 w-6" />
                      <span>Request Report</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleSetReminders}>
                      <Bell className="h-6 w-6" />
                      <span>Set Reminders</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Documents Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload documents for {clientInfo.name}. Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
            </p>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop files</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implement upload logic here
                  setShowUploadModal(false)
                }}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule Meeting</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule a meeting with {clientInfo.name}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="review">Review Meeting</SelectItem>
                    <SelectItem value="planning">Planning Session</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Additional notes..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMeetingModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implement meeting scheduling logic here
                  setShowMeetingModal(false)
                }}>
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Request Report</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Request a custom report for {clientInfo.name}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="tax">Tax Report</SelectItem>
                    <SelectItem value="audit">Audit Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="date" placeholder="From" />
                  <Input type="date" placeholder="To" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Requirements</label>
                <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Specific requirements..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReportModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implement report request logic here
                  setShowReportModal(false)
                }}>
                  Request Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Reminders Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Reminders</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Set up reminders for {clientInfo.name}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reminder Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reminder type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline Reminder</SelectItem>
                    <SelectItem value="meeting">Meeting Reminder</SelectItem>
                    <SelectItem value="payment">Payment Reminder</SelectItem>
                    <SelectItem value="compliance">Compliance Reminder</SelectItem>
                    <SelectItem value="custom">Custom Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reminder Date</label>
                <Input type="datetime-local" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Reminder message..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReminderModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implement reminder setting logic here
                  setShowReminderModal(false)
                }}>
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
