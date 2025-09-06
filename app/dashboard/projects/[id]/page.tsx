'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Edit,
  MoreVertical,
  Calendar,
  Users,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Target,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Upload,
  Download,
  Share,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Project {
  _id: string
  name: string
  description?: string
  clientId: {
    _id: string
    name: string
    email: string
    phone: string
  }
  projectType: string
  status: string
  priority: string
  startDate: string
  endDate: string
  progress: number
  projectManager: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  teamMembers: {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }[]
  budget?: number
  actualCost?: number
  estimatedHours?: number
  actualHours?: number
  createdAt: string
  updatedAt: string
  milestones: Milestone[]
  tasks: Task[]
  documents: Document[]
  comments: Comment[]
}

interface Milestone {
  _id: string
  title: string
  description?: string
  dueDate: string
  status: string
  completedAt?: string
}

interface Task {
  _id: string
  title: string
  description?: string
  status: string
  priority: string
  assignedTo?: {
    _id: string
    firstName: string
    lastName: string
  }
  dueDate?: string
  progress: number
  estimatedHours?: number
  actualHours?: number
  createdAt: string
}

interface Document {
  _id: string
  name: string
  type: string
  size: number
  uploadedBy: {
    _id: string
    firstName: string
    lastName: string
  }
  uploadedAt: string
  version: number
}

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProject({
        _id: id as string,
        name: 'GST Compliance 2024-25',
        description: 'Complete GST compliance for ABC Corporation including monthly returns, annual returns, and reconciliation with books of accounts.',
        clientId: {
          _id: '1',
          name: 'ABC Corporation',
          email: 'contact@abccorp.com',
          phone: '+91 98765 43210'
        },
        projectType: 'compliance',
        status: 'active',
        priority: 'high',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        progress: 65,
        projectManager: {
          _id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@ledgerfy.com'
        },
        teamMembers: [
          {
            _id: '1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@ledgerfy.com',
            role: 'Project Manager'
          },
          {
            _id: '2',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@ledgerfy.com',
            role: 'Senior Accountant'
          },
          {
            _id: '3',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@ledgerfy.com',
            role: 'Junior Accountant'
          }
        ],
        budget: 50000,
        actualCost: 32500,
        estimatedHours: 200,
        actualHours: 130,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        milestones: [
          {
            _id: '1',
            title: 'Project Kickoff',
            description: 'Initial client meeting and project setup',
            dueDate: '2024-01-05',
            status: 'completed',
            completedAt: '2024-01-05T14:30:00Z'
          },
          {
            _id: '2',
            title: 'Data Collection',
            description: 'Gather all necessary documents and data from client',
            dueDate: '2024-01-15',
            status: 'completed',
            completedAt: '2024-01-14T16:45:00Z'
          },
          {
            _id: '3',
            title: 'GST Returns Preparation',
            description: 'Prepare and file monthly GST returns',
            dueDate: '2024-02-15',
            status: 'in_progress'
          },
          {
            _id: '4',
            title: 'Annual Return Filing',
            description: 'Prepare and file annual GST return',
            dueDate: '2024-03-31',
            status: 'pending'
          }
        ],
        tasks: [
          {
            _id: '1',
            title: 'Review GST Returns',
            description: 'Review quarterly GST returns for accuracy',
            status: 'in_progress',
            priority: 'high',
            assignedTo: { _id: '2', firstName: 'John', lastName: 'Doe' },
            dueDate: '2024-01-25',
            progress: 70,
            estimatedHours: 8,
            actualHours: 5.5,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '2',
            title: 'Reconcile Books',
            description: 'Reconcile GST returns with books of accounts',
            status: 'todo',
            priority: 'medium',
            assignedTo: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
            dueDate: '2024-01-30',
            progress: 0,
            estimatedHours: 12,
            actualHours: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '3',
            title: 'Client Communication',
            description: 'Update client on progress and gather additional information',
            status: 'completed',
            priority: 'low',
            assignedTo: { _id: '1', firstName: 'Admin', lastName: 'User' },
            dueDate: '2024-01-20',
            progress: 100,
            estimatedHours: 2,
            actualHours: 2,
            createdAt: '2024-01-01T00:00:00Z'
          }
        ],
        documents: [
          {
            _id: '1',
            name: 'GST Registration Certificate',
            type: 'pdf',
            size: 1024000,
            uploadedBy: { _id: '1', firstName: 'Admin', lastName: 'User' },
            uploadedAt: '2024-01-02T10:00:00Z',
            version: 1
          },
          {
            _id: '2',
            name: 'Books of Accounts - Q3 2024',
            type: 'xlsx',
            size: 2048000,
            uploadedBy: { _id: '2', firstName: 'John', lastName: 'Doe' },
            uploadedAt: '2024-01-10T14:30:00Z',
            version: 1
          },
          {
            _id: '3',
            name: 'GST Returns - Dec 2024',
            type: 'pdf',
            size: 512000,
            uploadedBy: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
            uploadedAt: '2024-01-15T09:15:00Z',
            version: 2
          }
        ],
        comments: [
          {
            _id: '1',
            content: 'Client has provided all necessary documents. We can proceed with GST return preparation.',
            author: { _id: '1', firstName: 'Admin', lastName: 'User' },
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            content: 'Found some discrepancies in the books. Need to clarify with client before proceeding.',
            author: { _id: '2', firstName: 'John', lastName: 'Doe' },
            createdAt: '2024-01-18T15:30:00Z'
          }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [id])

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
      case 'pending':
      case 'todo':
        return <Clock className="h-4 w-4" />
      case 'active':
      case 'in_progress':
        return <Play className="h-4 w-4" />
      case 'on_hold':
        return <Pause className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <Square className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getDaysRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          description="Fetching project details"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading project details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Project Not Found"
          description="The requested project could not be found"
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Project Not Found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push('/dashboard/projects')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
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
        title={project.name}
        description={project.description}
      >
        <PageHeaderActions>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <RequirePermission permission="projects:write">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </RequirePermission>
          <Button variant="outline">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Project Status Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {getStatusIcon(project.status)}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <Badge className={cn("text-xs", getStatusColor(project.status))}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{project.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Left</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {getDaysRemaining(project.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {project.budget ? formatCurrency(project.budget) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Client</label>
                  <p className="text-gray-900 dark:text-white">{project.clientId.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.clientId.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Project Type</label>
                  <Badge className={cn("text-xs", getPriorityColor(project.priority))}>
                    {project.projectType}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timeline</label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Project Manager</label>
                  <p className="text-gray-900 dark:text-white">
                    {project.projectManager.firstName} {project.projectManager.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.projectManager.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Budget</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.budget ? formatCurrency(project.budget) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Actual Cost</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.actualCost ? formatCurrency(project.actualCost) : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Variance</span>
                  <span className={cn(
                    "font-medium",
                    project.actualCost && project.budget && project.actualCost > project.budget 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-green-600 dark:text-green-400"
                  )}>
                    {project.budget && project.actualCost 
                      ? formatCurrency(project.budget - project.actualCost)
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.estimatedHours || '-'}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Actual Hours</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.actualHours || '-'}h
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {project.teamMembers.length} team members assigned to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.teamMembers.map((member) => (
                  <div key={member._id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    {project.tasks.length} tasks assigned to this project
                  </CardDescription>
                </div>
                <RequirePermission permission="projects:write">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </RequirePermission>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Badge className={cn("text-xs", getStatusColor(task.status))}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          {task.assignedTo && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{task.progress}%</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {task.actualHours || 0}h / {task.estimatedHours || 0}h
                        </div>
                      </div>
                      <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Milestones</CardTitle>
                  <CardDescription>
                    {project.milestones.length} milestones for this project
                  </CardDescription>
                </div>
                <RequirePermission permission="projects:write">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </RequirePermission>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.milestones.map((milestone) => (
                  <div key={milestone._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(milestone.status)}
                        <Badge className={cn("text-xs", getStatusColor(milestone.status))}>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due: {formatDate(milestone.dueDate)}
                          </span>
                          {milestone.completedAt && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Completed: {formatDateTime(milestone.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    {project.documents.length} documents uploaded for this project
                  </CardDescription>
                </div>
                <RequirePermission permission="documents:upload">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </RequirePermission>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.documents.map((document) => (
                  <div key={document._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{document.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(document.size)} • Version {document.version}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Uploaded by {document.uploadedBy.firstName} {document.uploadedBy.lastName} on {formatDateTime(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <RequirePermission permission="documents:delete">
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </RequirePermission>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    {project.comments.length} comments on this project
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.comments.map((comment) => (
                  <div key={comment._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
