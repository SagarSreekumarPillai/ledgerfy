'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  CheckSquare,
  Calendar,
  User,
  Clock,
  Flag,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  projectId: { _id: string; name: string }
  assignedTo: { _id: string; firstName: string; lastName: string; email: string }
  createdBy: { _id: string; firstName: string; lastName: string }
  dueDate: string
  estimatedHours: number
  actualHours: number
  progress: number
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface Comment {
  _id: string
  content: string
  author: { _id: string; firstName: string; lastName: string }
  createdAt: string
  isResolved: boolean
}

interface Attachment {
  _id: string
  name: string
  type: string
  size: number
  uploadedBy: { _id: string; firstName: string; lastName: string }
  uploadedAt: string
  url: string
}

interface TimeEntry {
  _id: string
  user: { _id: string; firstName: string; lastName: string }
  hours: number
  description: string
  date: string
  createdAt: string
}

export default function TaskDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setTask({
        _id: taskId,
        title: 'Review Annual Financial Statements',
        description: 'Thoroughly review the annual financial statements for ABC Company Ltd, including balance sheet, profit & loss account, and cash flow statement. Check for accuracy, compliance with accounting standards, and proper disclosures.',
        status: 'in_progress',
        priority: 'high',
        projectId: { _id: '1', name: 'Annual Audit 2024-25' },
        assignedTo: { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@ledgerfy.com' },
        createdBy: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
        dueDate: '2025-01-25',
        estimatedHours: 16,
        actualHours: 8.5,
        progress: 65,
        tags: ['Review', 'Financial Statements', 'Audit', 'ABC Company'],
        createdAt: '2025-01-10T09:00:00Z',
        updatedAt: '2025-01-15T14:30:00Z'
      })

      setComments([
        {
          _id: '1',
          content: 'I\'ve completed the review of the balance sheet. All figures look accurate and properly classified.',
          author: { _id: '1', firstName: 'John', lastName: 'Doe' },
          createdAt: '2025-01-15T10:30:00Z',
          isResolved: false
        },
        {
          _id: '2',
          content: 'Please double-check the depreciation calculation on page 15. The rate seems incorrect.',
          author: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          createdAt: '2025-01-14T16:45:00Z',
          isResolved: true
        },
        {
          _id: '3',
          content: 'The cash flow statement needs to be updated with the latest bank reconciliation.',
          author: { _id: '3', firstName: 'Mike', lastName: 'Johnson' },
          createdAt: '2025-01-13T11:20:00Z',
          isResolved: false
        }
      ])

      setAttachments([
        {
          _id: '1',
          name: 'Financial Statements Draft.pdf',
          type: 'application/pdf',
          size: 2048000,
          uploadedBy: { _id: '1', firstName: 'John', lastName: 'Doe' },
          uploadedAt: '2025-01-10T09:15:00Z',
          url: '/documents/financial-statements-draft.pdf'
        },
        {
          _id: '2',
          name: 'Review Checklist.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 512000,
          uploadedBy: { _id: '2', firstName: 'Jane', lastName: 'Smith' },
          uploadedAt: '2025-01-12T14:20:00Z',
          url: '/documents/review-checklist.xlsx'
        }
      ])

      setTimeEntries([
        {
          _id: '1',
          user: { _id: '1', firstName: 'John', lastName: 'Doe' },
          hours: 3.5,
          description: 'Initial review of balance sheet and notes',
          date: '2025-01-15',
          createdAt: '2025-01-15T17:00:00Z'
        },
        {
          _id: '2',
          user: { _id: '1', firstName: 'John', lastName: 'Doe' },
          hours: 2.0,
          description: 'Review of profit & loss account',
          date: '2025-01-14',
          createdAt: '2025-01-14T18:30:00Z'
        },
        {
          _id: '3',
          user: { _id: '1', firstName: 'John', lastName: 'Doe' },
          hours: 3.0,
          description: 'Cash flow statement analysis',
          date: '2025-01-13',
          createdAt: '2025-01-13T16:45:00Z'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [taskId])

  const getStatusColor = (status: string) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.todo
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <CheckSquare className="h-4 w-4 text-gray-600" />
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />
      case 'review':
        return <Eye className="h-4 w-4 text-yellow-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Flag className="h-4 w-4 text-gray-600" />
      case 'medium':
        return <Flag className="h-4 w-4 text-blue-600" />
      case 'high':
        return <Flag className="h-4 w-4 text-orange-600" />
      case 'urgent':
        return <Flag className="h-4 w-4 text-red-600" />
      default:
        return <Flag className="h-4 w-4 text-gray-600" />
    }
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

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Task..."
          description="Please wait while we fetch the task information."
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading task details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Task Not Found"
          description="The requested task could not be found."
        />
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Task Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The task you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push('/dashboard/projects/tasks')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysUntilDue = getDaysUntilDue(task.dueDate)

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description={`${task.projectId.name} • ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}`}
      >
        <PageHeaderActions>
          <Button variant="outline" onClick={() => router.push('/dashboard/projects/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Entry
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Task Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Hours</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{task.estimatedHours}h</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actual Hours</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{task.actualHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{task.progress}%</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {daysUntilDue > 0 ? `${daysUntilDue}d` : daysUntilDue === 0 ? 'Today' : 'Overdue'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
                <CardDescription>Basic task details and metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Description</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <Badge className={cn("text-xs", getStatusColor(task.status))}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Priority</p>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(task.priority)}
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Project</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.projectId.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Assigned To</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignedTo.firstName[0]}{task.assignedTo.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Created By</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.createdBy.firstName[0]}{task.createdBy.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {task.createdBy.firstName} {task.createdBy.lastName}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Due Date</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                    {daysUntilDue < 0 && (
                      <span className="ml-2 text-red-600 dark:text-red-400">(Overdue)</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Progress and Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Progress & Time Tracking</CardTitle>
                <CardDescription>Task progress and time allocation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Progress</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Estimated Hours</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{task.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Actual Hours</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{task.actualHours}h</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Time Efficiency</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {task.actualHours > 0 ? 
                      `${((task.actualHours / task.estimatedHours) * 100).toFixed(1)}% of estimated time used` :
                      'No time logged yet'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Task tags for easy categorization and search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments & Discussions</CardTitle>
              <CardDescription>Comments and discussions about this task</CardDescription>
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

        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Files and documents related to this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attachments.map((attachment) => (
                  <div key={attachment._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{attachment.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy.firstName} {attachment.uploadedBy.lastName} • {formatTimeAgo(attachment.uploadedAt)}
                        </p>
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
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>Time tracking entries for this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeEntries.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.hours}h logged
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {entry.user.firstName} {entry.user.lastName} • {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatTimeAgo(entry.createdAt)}
                    </span>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task History</CardTitle>
              <CardDescription>Complete history of changes and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Task status updated to In Progress
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Updated by John Doe • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Task assigned to John Doe
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Assigned by Jane Smith • 1 day ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Plus className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Task created
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created by Jane Smith • 5 days ago
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

