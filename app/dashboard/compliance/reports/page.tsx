'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Grid3X3,
  List,
  CheckCircle,
  AlertTriangle,
  Shield,
  Building2,
  Scale,
  FileCheck,
  ClipboardList,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ComplianceReport {
  id: string
  title: string
  description: string
  category: string
  type: string
  size: string
  regulatoryBody: string
  jurisdiction: string
  reportDate: string
  dueDate: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: {
    name: string
    email: string
    avatar?: string
  }
  lastModified: string
  version: string
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
  attachments: number
  reviewStatus: 'pending' | 'in_review' | 'reviewed' | 'approved'
}

const mockComplianceReports: ComplianceReport[] = [
  {
    id: '1',
    title: 'Q4 2024 SOX Compliance Report',
    description: 'Quarterly Sarbanes-Oxley Act compliance report covering internal controls and financial reporting.',
    category: 'Financial Reporting',
    type: 'PDF',
    size: '3.2 MB',
    regulatoryBody: 'SEC',
    jurisdiction: 'United States',
    reportDate: '2024-01-15T10:00:00Z',
    dueDate: '2024-01-31T23:59:59Z',
    status: 'submitted',
    priority: 'high',
    createdBy: {
      name: 'Sarah Johnson',
      email: 'sarah.j@ledgerfy.com',
      avatar: '/avatars/sarah.jpg'
    },
    lastModified: '2024-01-15T14:30:00Z',
    version: '1.0.0',
    complianceScore: 94,
    riskLevel: 'medium',
    tags: ['SOX', 'financial', 'reporting', 'Q4', '2024'],
    attachments: 5,
    reviewStatus: 'in_review'
  },
  {
    id: '2',
    title: 'Annual GDPR Compliance Assessment',
    description: 'Annual General Data Protection Regulation compliance assessment and data protection impact analysis.',
    category: 'Data Privacy',
    type: 'DOCX',
    size: '2.8 MB',
    regulatoryBody: 'EU Commission',
    jurisdiction: 'European Union',
    reportDate: '2024-01-10T09:00:00Z',
    dueDate: '2024-01-25T23:59:59Z',
    status: 'draft',
    priority: 'medium',
    createdBy: {
      name: 'David Kim',
      email: 'david.kim@ledgerfy.com'
    },
    lastModified: '2024-01-12T16:45:00Z',
    version: '0.9.2',
    complianceScore: 87,
    riskLevel: 'high',
    tags: ['GDPR', 'data privacy', 'annual', 'assessment', 'EU'],
    attachments: 3,
    reviewStatus: 'pending'
  },
  {
    id: '3',
    title: 'Monthly Tax Compliance Summary',
    description: 'Monthly tax compliance summary for multi-state operations including sales tax and payroll tax.',
    category: 'Tax Compliance',
    type: 'XLSX',
    size: '1.5 MB',
    regulatoryBody: 'IRS',
    jurisdiction: 'United States',
    reportDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-15T23:59:59Z',
    status: 'approved',
    priority: 'medium',
    createdBy: {
      name: 'Emily Watson',
      email: 'emily.w@ledgerfy.com'
    },
    lastModified: '2024-01-14T11:20:00Z',
    version: '1.0.0',
    complianceScore: 98,
    riskLevel: 'low',
    tags: ['tax', 'monthly', 'multi-state', 'sales tax', 'payroll'],
    attachments: 2,
    reviewStatus: 'approved'
  },
  {
    id: '4',
    title: 'AML Risk Assessment Report',
    description: 'Anti-Money Laundering risk assessment report with customer due diligence and transaction monitoring.',
    category: 'Financial Crime',
    type: 'PDF',
    size: '4.1 MB',
    regulatoryBody: 'FinCEN',
    jurisdiction: 'United States',
    reportDate: '2024-01-05T08:00:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    status: 'overdue',
    priority: 'critical',
    createdBy: {
      name: 'Mike Chen',
      email: 'mike.chen@ledgerfy.com'
    },
    lastModified: '2024-01-08T15:30:00Z',
    version: '0.8.5',
    complianceScore: 76,
    riskLevel: 'critical',
    tags: ['AML', 'risk assessment', 'customer due diligence', 'monitoring'],
    attachments: 7,
    reviewStatus: 'pending'
  },
  {
    id: '5',
    title: 'Environmental Impact Assessment',
    description: 'Environmental impact assessment report for manufacturing operations and sustainability compliance.',
    category: 'Environmental',
    type: 'PDF',
    size: '5.2 MB',
    regulatoryBody: 'EPA',
    jurisdiction: 'United States',
    reportDate: '2024-01-03T10:00:00Z',
    dueDate: '2024-01-18T23:59:59Z',
    status: 'draft',
    priority: 'low',
    createdBy: {
      name: 'Lisa Rodriguez',
      email: 'lisa.r@ledgerfy.com'
    },
    lastModified: '2024-01-10T13:15:00Z',
    version: '0.7.1',
    complianceScore: 82,
    riskLevel: 'medium',
    tags: ['environmental', 'impact assessment', 'manufacturing', 'sustainability'],
    attachments: 4,
    reviewStatus: 'pending'
  }
]

const categories = ['All', 'Financial Reporting', 'Data Privacy', 'Tax Compliance', 'Financial Crime', 'Environmental', 'Labor', 'Health & Safety']
const statuses = ['All', 'draft', 'submitted', 'approved', 'rejected', 'overdue']
const priorities = ['All', 'low', 'medium', 'high', 'critical']
const riskLevels = ['All', 'low', 'medium', 'high', 'critical']

export default function ComplianceReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('all')

  const filteredReports = mockComplianceReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || report.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter
    const matchesRisk = riskFilter === 'All' || report.riskLevel === riskFilter
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesRisk
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Financial Reporting': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Data Privacy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Tax Compliance': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Financial Crime': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Environmental': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Labor': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Health & Safety': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'overdue': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'in_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const renderReportCard = (report: ComplianceReport) => (
    <Card key={report.id} className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {report.title}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {report.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Regulatory Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{report.regulatoryBody}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{report.jurisdiction}</span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>{report.type}</span>
            <span>{report.size}</span>
            <span>v{report.version}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Due: {new Date(report.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Compliance Score and Risk */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className={cn("text-lg font-semibold", getComplianceScoreColor(report.complianceScore))}>
              {report.complianceScore}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Compliance Score</div>
          </div>
          <div className="text-center">
            <Badge className={getRiskLevelColor(report.riskLevel)}>
              {report.riskLevel}
            </Badge>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Risk Level</div>
          </div>
        </div>

        {/* Priority and Review Status */}
        <div className="flex items-center justify-between">
          <Badge className={getPriorityColor(report.priority)}>
            Priority: {report.priority}
          </Badge>
          <Badge className={getReviewStatusColor(report.reviewStatus)}>
            {report.reviewStatus.replace('_', ' ')}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {report.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {report.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{report.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Creator and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={report.createdBy.avatar} />
              <AvatarFallback>{report.createdBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {report.createdBy.name}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {report.attachments} attachments
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderReportList = (report: ComplianceReport) => (
    <Card key={report.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                  {report.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {report.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{report.type}</span>
                <span>{report.size}</span>
                <span>v{report.version}</span>
                <span>{report.attachments} attachments</span>
                <span>Due: {new Date(report.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getCategoryColor(report.category)}>
              {report.category}
            </Badge>
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
            <Badge className={getPriorityColor(report.priority)}>
              {report.priority}
            </Badge>
            <div className="text-center">
              <div className={cn("text-lg font-semibold", getComplianceScoreColor(report.complianceScore))}>
                {report.complianceScore}%
              </div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
            <div className="flex items-center gap-2">
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
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage regulatory reports, track compliance status, and monitor deadlines
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        {/* All Reports Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search compliance reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Reports Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map(renderReportCard)}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map(renderReportList)}
            </div>
          )}

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No compliance reports found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        {/* Other Tabs */}
        <TabsContent value="overdue" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No overdue reports</h3>
            <p className="text-sm">All compliance reports are up to date</p>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No pending review reports</h3>
            <p className="text-sm">All reports have been reviewed or are not yet submitted</p>
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No approved reports</h3>
            <p className="text-sm">Approved compliance reports will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
