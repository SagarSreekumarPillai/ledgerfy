'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  BarChart3,
  CalendarDays
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface ComplianceItem {
  _id: string
  title: string
  description?: string
  complianceType: string
  clientId: {
    _id: string
    name: string
  }
  financialYear: string
  filingPeriod: string
  dueDate: string
  status: string
  priority: string
  progress: number
  assignedTo?: {
    _id: string
    firstName: string
    lastName: string
  }
  amount?: number
  taxAmount?: number
  penaltyAmount?: number
  interestAmount?: number
  createdAt: string
}

export default function CompliancePage() {
  const { hasPermission } = useAuth()
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'calendar' | 'list'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComplianceItems([
        {
          _id: '1',
          title: 'GST Return Q3 2024-25',
          description: 'Quarterly GST return for ABC Corporation',
          complianceType: 'GST',
          clientId: { _id: '1', name: 'ABC Corporation' },
          financialYear: '2024-2025',
          filingPeriod: 'Q3',
          dueDate: '2024-10-20',
          status: 'pending',
          priority: 'high',
          progress: 0,
          assignedTo: { _id: '1', firstName: 'Admin', lastName: 'User' },
          amount: 500000,
          taxAmount: 90000,
          createdAt: '2024-01-10T09:00:00Z'
        },
        {
          _id: '2',
          title: 'TDS Filing Q4 2024-25',
          description: 'Quarterly TDS filing for XYZ Limited',
          complianceType: 'TDS',
          clientId: { _id: '2', name: 'XYZ Limited' },
          financialYear: '2024-2025',
          filingPeriod: 'Q4',
          dueDate: '2024-01-31',
          status: 'in_progress',
          priority: 'critical',
          progress: 60,
          assignedTo: { _id: '2', firstName: 'John', lastName: 'Doe' },
          amount: 300000,
          taxAmount: 30000,
          createdAt: '2024-01-12T11:00:00Z'
        },
        {
          _id: '3',
          title: 'ITR Filing FY 2023-24',
          description: 'Income Tax Return for DEF Industries',
          complianceType: 'ITR',
          clientId: { _id: '3', name: 'DEF Industries' },
          financialYear: '2023-2024',
          filingPeriod: 'Annual',
          dueDate: '2024-07-31',
          status: 'pending',
          priority: 'medium',
          progress: 0,
          assignedTo: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
          amount: 1000000,
          taxAmount: 150000,
          createdAt: '2024-01-08T13:00:00Z'
        },
        {
          _id: '4',
          title: 'ROC Annual Filing 2024',
          description: 'Annual ROC compliance for GHI Solutions',
          complianceType: 'ROC',
          clientId: { _id: '4', name: 'GHI Solutions' },
          financialYear: '2023-2024',
          filingPeriod: 'Annual',
          dueDate: '2024-09-30',
          status: 'pending',
          priority: 'low',
          progress: 0,
          assignedTo: { _id: '1', firstName: 'Admin', lastName: 'User' },
          createdAt: '2024-01-05T10:00:00Z'
        },
        {
          _id: '5',
          title: 'GST Return Q2 2024-25',
          description: 'Quarterly GST return for JKL Enterprises',
          complianceType: 'GST',
          clientId: { _id: '5', name: 'JKL Enterprises' },
          financialYear: '2024-2025',
          filingPeriod: 'Q2',
          dueDate: '2024-07-20',
          status: 'filed',
          priority: 'medium',
          progress: 100,
          assignedTo: { _id: '2', firstName: 'John', lastName: 'Doe' },
          amount: 750000,
          taxAmount: 135000,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clientId.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || item.complianceType === selectedType
    const matchesStatus = !selectedStatus || item.status === selectedStatus
    const matchesPriority = !selectedPriority || item.priority === selectedPriority
    const matchesClient = !selectedClient || item.clientId._id === selectedClient

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesClient
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      filed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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

  const getComplianceTypeColor = (type: string) => {
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

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />
      case 'filed':
        return <CheckCircle className="h-4 w-4" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Calculate statistics
  const totalItems = complianceItems.length
  const pendingItems = complianceItems.filter(item => item.status === 'pending').length
  const inProgressItems = complianceItems.filter(item => item.status === 'in_progress').length
  const filedItems = complianceItems.filter(item => item.status === 'filed').length
  const overdueItems = complianceItems.filter(item => item.status === 'overdue').length
  const criticalItems = complianceItems.filter(item => item.priority === 'critical').length

  const upcomingDeadlines = complianceItems
    .filter(item => item.status !== 'filed' && item.status !== 'approved')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Compliance"
          description="Track and manage compliance requirements"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading compliance data...</p>
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
        title="Compliance"
        description="Track and manage compliance requirements"
      >
        <PageHeaderActions>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FileText className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <RequirePermission permission="compliance:create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance Item
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
                  placeholder="Search compliance items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="filed">Filed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('')
                  setSelectedStatus('')
                  setSelectedPriority('')
                  setSelectedClient('')
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'overview' && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inProgressItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filed</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{filedItems}</p>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{overdueItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Target className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{criticalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Critical compliance items requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((item) => {
                  const daysUntilDue = getDaysUntilDue(item.dueDate)
                  const isOverdue = daysUntilDue < 0
                  
                  return (
                    <div key={item._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <Badge className={cn("text-xs", getStatusColor(item.status))}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.clientId.name} • {item.complianceType} • {item.filingPeriod}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-sm font-medium",
                          isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                        )}>
                          {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {formatDate(item.dueDate)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                
                {upcomingDeadlines.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Items</CardTitle>
            <CardDescription>
              Manage all compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Item</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">{item.clientId.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={cn("text-xs", getComplianceTypeColor(item.complianceType))}>
                            {item.complianceType}
                          </Badge>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.filingPeriod} • {item.financialYear}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(item.dueDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getDaysUntilDue(item.dueDate)} days left
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={cn("text-xs", getStatusColor(item.status))}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={cn("text-xs", getPriorityColor(item.priority))}>
                            {item.priority}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {item.assignedTo ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}` : 'Unassigned'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No compliance items found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              Calendar view coming soon...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Calendar View</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Interactive calendar view will be implemented in the next iteration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
