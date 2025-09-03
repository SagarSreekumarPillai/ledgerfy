'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  Clock,
  User,
  Tag,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  X,
  Edit3,
  Trash2,
  Copy,
  Archive,
  Eye,
  MessageSquare,
  Paperclip,
  BarChart3,
  Grid3X3,
  List,
  Kanban,
  CalendarDays,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  Square,
  Clock3,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
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

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: {
    id: string
    name: string
    avatar: string
  }
  project: {
    id: string
    name: string
    color: string
  }
  dueDate: Date
  estimatedHours: number
  actualHours: number
  tags: string[]
  attachments: number
  comments: number
  createdAt: Date
  updatedAt: Date
  dependencies: string[]
  subtasks: {
    id: string
    title: string
    completed: boolean
  }[]
}

interface Project {
  id: string
  name: string
  color: string
  status: 'active' | 'completed' | 'on-hold'
}

interface User {
  id: string
  name: string
  avatar: string
  role: string
}

export default function TasksPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Mock data
  useEffect(() => {
    setProjects([
      { id: '1', name: 'Tax Planning 2024', color: '#3B82F6', status: 'active' },
      { id: '2', name: 'GST Compliance', color: '#10B981', status: 'active' },
      { id: '3', name: 'Audit Preparation', color: '#F59E0B', status: 'active' },
      { id: '4', name: 'Client Portal', color: '#8B5CF6', status: 'on-hold' }
    ])

    setUsers([
      { id: '1', name: 'John Doe', avatar: 'JD', role: 'Senior CA' },
      { id: '2', name: 'Jane Smith', avatar: 'JS', role: 'CA' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ', role: 'Article Assistant' },
      { id: '4', name: 'Sarah Wilson', avatar: 'SW', role: 'CA' }
    ])

    setTasks([
      {
        id: '1',
        title: 'Review GST Returns for Q1',
        description: 'Analyze and verify GST returns for multiple clients for Q1 2024',
        status: 'in-progress',
        priority: 'high',
        assignee: { id: '1', name: 'John Doe', avatar: 'JD' },
        project: { id: '2', name: 'GST Compliance', color: '#10B981' },
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        actualHours: 4,
        tags: ['GST', 'Compliance', 'Q1'],
        attachments: 3,
        comments: 5,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        dependencies: [],
        subtasks: [
          { id: '1', title: 'Verify input tax credits', completed: true },
          { id: '2', title: 'Check output tax calculations', completed: false },
          { id: '3', title: 'Review supporting documents', completed: false }
        ]
      },
      {
        id: '2',
        title: 'Prepare Tax Planning Report',
        description: 'Create comprehensive tax planning report for ABC Corporation',
        status: 'todo',
        priority: 'critical',
        assignee: { id: '2', name: 'Jane Smith', avatar: 'JS' },
        project: { id: '1', name: 'Tax Planning 2024', color: '#3B82F6' },
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 16,
        actualHours: 0,
        tags: ['Tax Planning', 'Corporate', 'ABC Corp'],
        attachments: 1,
        comments: 2,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        dependencies: ['1'],
        subtasks: [
          { id: '1', title: 'Analyze financial statements', completed: false },
          { id: '2', title: 'Identify tax optimization opportunities', completed: false },
          { id: '3', title: 'Draft recommendations', completed: false }
        ]
      },
      {
        id: '3',
        title: 'Audit Documentation Review',
        description: 'Review and organize audit documentation for year-end audit',
        status: 'review',
        priority: 'medium',
        assignee: { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
        project: { id: '3', name: 'Audit Preparation', color: '#F59E0B' },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        estimatedHours: 6,
        actualHours: 6,
        tags: ['Audit', 'Documentation', 'Year-end'],
        attachments: 8,
        comments: 12,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        dependencies: [],
        subtasks: [
          { id: '1', title: 'Organize working papers', completed: true },
          { id: '2', title: 'Verify calculations', completed: true },
          { id: '3', title: 'Prepare summary report', completed: false }
        ]
      },
      {
        id: '4',
        title: 'Client Portal Testing',
        description: 'Perform comprehensive testing of client portal features',
        status: 'completed',
        priority: 'low',
        assignee: { id: '4', name: 'Sarah Wilson', avatar: 'SW' },
        project: { id: '4', name: 'Client Portal', color: '#8B5CF6' },
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 12,
        actualHours: 10,
        tags: ['Testing', 'Portal', 'UI/UX'],
        attachments: 2,
        comments: 8,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        dependencies: [],
        subtasks: [
          { id: '1', title: 'Functional testing', completed: true },
          { id: '2', title: 'User acceptance testing', completed: true },
          { id: '3', title: 'Performance testing', completed: true }
        ]
      }
    ])
  }, [])

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <ArrowUp className="h-4 w-4 text-orange-500" />
      case 'medium': return <Minus className="h-4 w-4 text-yellow-500" />
      case 'low': return <ArrowDown className="h-4 w-4 text-green-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Circle className="h-4 w-4 text-gray-500" />
      case 'in-progress': return <Clock3 className="h-4 w-4 text-blue-500" />
      case 'review': return <Eye className="h-4 w-4 text-purple-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesProject = selectedProject === 'all' || task.project.id === selectedProject
    const matchesAssignee = selectedAssignee === 'all' || task.assignee.id === selectedAssignee

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee
  })

  const groupedTasks = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus as any, updatedAt: new Date() }
          : task
      ))
    }
    setDraggedTask(null)
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDueDateColor = (dueDate: Date) => {
    const daysUntilDue = getDaysUntilDue(dueDate)
    if (daysUntilDue < 0) return 'text-red-600 dark:text-red-400'
    if (daysUntilDue <= 3) return 'text-orange-600 dark:text-orange-400'
    if (daysUntilDue <= 7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const renderKanbanView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <div key={status} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {status.replace('-', ' ')}
            </h3>
            <Badge variant="secondary" className="ml-2">
              {statusTasks.length}
            </Badge>
          </div>
          
          <div
            className="min-h-[600px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
            onDragOver={(e) => handleDragOver(e, status)}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="space-y-3">
              {statusTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(task.priority)}
                          {getStatusIcon(task.status)}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium"
                            style={{ backgroundColor: task.project.color + '20', color: task.project.color }}
                          >
                            {task.assignee.avatar}
                          </div>
                          <div className="text-xs">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {task.assignee.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {task.project.name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={cn("text-xs font-medium", getDueDateColor(task.dueDate))}>
                            {getDaysUntilDue(task.dueDate) < 0 
                              ? `${Math.abs(getDaysUntilDue(task.dueDate))}d overdue`
                              : getDaysUntilDue(task.dueDate) === 0 
                                ? 'Due today'
                                : `${getDaysUntilDue(task.dueDate)}d left`
                            }
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.estimatedHours}h
                          </p>
                        </div>
                      </div>
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-3 w-3" />
                          <span>{task.comments}</span>
                          <Paperclip className="h-3 w-3" />
                          <span>{task.attachments}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <CheckSquare className="h-3 w-3" />
                          <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {task.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={cn("text-sm font-medium", getDueDateColor(task.dueDate))}>
                    {getDaysUntilDue(task.dueDate) < 0 
                      ? `${Math.abs(getDaysUntilDue(task.dueDate))}d overdue`
                      : getDaysUntilDue(task.dueDate) === 0 
                        ? 'Due today'
                        : `${getDaysUntilDue(task.dueDate)}d left`
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due {task.dueDate.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium"
                      style={{ backgroundColor: task.project.color + '20', color: task.project.color }}
                    >
                      {task.assignee.avatar}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {task.assignee.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {task.project.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Tasks"
        description="Manage and track all your project tasks with advanced filtering and multiple view modes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/dashboard/projects' },
          { label: 'Tasks', href: '/dashboard/projects/tasks' }
        ]}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/projects')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Projects
          </Button>
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
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
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                >
                  <Kanban className="h-4 w-4 mr-2" />
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tasks.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Clock3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {tasks.filter(t => getDaysUntilDue(t.dueDate) <= 7 && getDaysUntilDue(t.dueDate) >= 0).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {tasks.filter(t => getDaysUntilDue(t.dueDate) < 0).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks View */}
        <div className="space-y-6">
          {viewMode === 'kanban' && renderKanbanView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'calendar' && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Calendar View
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Calendar view will be implemented in the next iteration
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
