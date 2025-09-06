'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Download,
  Share2,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  CreditCard,
  Receipt,
  Banknote,
  Eye
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Client {
  _id: string
  name: string
  type: string
  gstin: string
  pan: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  status: 'active' | 'inactive' | 'suspended'
  complianceCount: number
  overdueCount: number
  lastActivity: string
  assignedTo: string
  totalRevenue: number
  monthlyRevenue: number
  projectsCount: number
  documentsCount: number
  createdAt: string
  updatedAt: string
}

interface Project {
  _id: string
  name: string
  status: string
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
}

interface Document {
  _id: string
  title: string
  type: string
  uploadedAt: string
  uploadedBy: string
  size: number
}

interface ComplianceItem {
  _id: string
  title: string
  type: string
  dueDate: string
  status: string
  priority: string
}

interface Transaction {
  _id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
  status: string
}

export default function ClientDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setClient({
        _id: clientId,
        name: 'ABC Company Ltd',
        type: 'Private Limited',
        gstin: '27AABCA1234Z1Z5',
        pan: 'AABCA1234Z',
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@abc.com',
        phone: '+91 98765 43210',
        address: '123 Business Park, Sector 5',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        status: 'active',
        complianceCount: 12,
        overdueCount: 1,
        lastActivity: '2025-01-15',
        assignedTo: 'John Doe',
        totalRevenue: 2500000,
        monthlyRevenue: 150000,
        projectsCount: 5,
        documentsCount: 24,
        createdAt: '2024-01-01',
        updatedAt: '2025-01-15'
      })

      setProjects([
        {
          _id: '1',
          name: 'Annual Audit 2024-25',
          status: 'in_progress',
          progress: 75,
          startDate: '2024-04-01',
          endDate: '2025-03-31',
          budget: 500000,
          spent: 375000
        },
        {
          _id: '2',
          name: 'GST Compliance',
          status: 'completed',
          progress: 100,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          budget: 200000,
          spent: 180000
        },
        {
          _id: '3',
          name: 'Tax Planning',
          status: 'planning',
          progress: 25,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          budget: 300000,
          spent: 75000
        }
      ])

      setDocuments([
        {
          _id: '1',
          title: 'Annual Financial Statements 2023-24',
          type: 'Financial Report',
          uploadedAt: '2025-01-10',
          uploadedBy: 'John Doe',
          size: 2048000
        },
        {
          _id: '2',
          title: 'GST Returns Q3 2024-25',
          type: 'Tax Return',
          uploadedAt: '2025-01-05',
          uploadedBy: 'Jane Smith',
          size: 512000
        },
        {
          _id: '3',
          title: 'Board Resolution - Dividend Declaration',
          type: 'Corporate Document',
          uploadedAt: '2024-12-20',
          uploadedBy: 'Rajesh Kumar',
          size: 256000
        }
      ])

      setComplianceItems([
        {
          _id: '1',
          title: 'GST Return Filing - January 2025',
          type: 'GST',
          dueDate: '2025-02-20',
          status: 'pending',
          priority: 'high'
        },
        {
          _id: '2',
          title: 'TDS Return Q3 FY 2024-25',
          type: 'TDS',
          dueDate: '2025-01-31',
          status: 'overdue',
          priority: 'critical'
        },
        {
          _id: '3',
          title: 'Annual Return Filing',
          type: 'Corporate',
          dueDate: '2025-10-31',
          status: 'pending',
          priority: 'medium'
        }
      ])

      setTransactions([
        {
          _id: '1',
          description: 'Audit Services - Q4 2024',
          amount: 150000,
          type: 'income',
          date: '2025-01-15',
          category: 'Professional Services',
          status: 'paid'
        },
        {
          _id: '2',
          description: 'GST Compliance Services',
          amount: 50000,
          type: 'income',
          date: '2025-01-10',
          category: 'Tax Services',
          status: 'paid'
        },
        {
          _id: '3',
          description: 'Tax Planning Consultation',
          amount: 25000,
          type: 'income',
          date: '2025-01-05',
          category: 'Consultation',
          status: 'pending'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [clientId])

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      planning: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority as keyof typeof colors] || colors.medium
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

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Client Details..."
          description="Please wait while we fetch the client information."
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading client details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Client Not Found"
          description="The requested client could not be found."
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Client Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The client you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push('/dashboard/clients')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
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
        title={client.name}
        description={`${client.type} • ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}`}
      >
        <PageHeaderActions>
          <Button variant="outline" onClick={() => router.push('/dashboard/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Client Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(client.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{client.projectsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{client.documentsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Items</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{client.overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Basic client details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{client.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{client.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{client.phone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {client.address}, {client.city}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {client.state} - {client.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{client.contactPerson}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Legal and tax identification details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">GSTIN</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.gstin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">PAN</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.pan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                  <Badge className={cn("text-xs", getStatusColor(client.status))}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Assigned To</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Last Activity</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(client.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>All projects associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</h4>
                        <Badge className={cn("text-xs", getStatusColor(project.status))}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Budget: {formatCurrency(project.budget)}</span>
                        <span>Spent: {formatCurrency(project.spent)}</span>
                        <span>Progress: {project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>All documents associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{document.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {document.type} • {formatFileSize(document.size)} • {new Date(document.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Items</CardTitle>
              <CardDescription>All compliance requirements and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                        <Badge className={cn("text-xs", getStatusColor(item.status))}>
                          {item.status}
                        </Badge>
                        <Badge className={cn("text-xs", getPriorityColor(item.priority))}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type: {item.type} • Due: {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Transactions</CardTitle>
              <CardDescription>All financial transactions with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        transaction.type === 'income' 
                          ? "bg-green-100 dark:bg-green-900" 
                          : "bg-red-100 dark:bg-red-900"
                      )}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        transaction.type === 'income' 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <Badge className={cn("text-xs", getStatusColor(transaction.status))}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent activities and interactions with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Client status updated to Active
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Updated by John Doe • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New document uploaded: Annual Financial Statements
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded by Jane Smith • 1 day ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment received: ₹1,50,000 for Audit Services
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Processed by system • 3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
