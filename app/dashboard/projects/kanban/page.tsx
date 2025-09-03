'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  Calendar,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  MessageSquare,
  Paperclip,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  description: string
  status: 'planning' | 'active' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progress: number
  dueDate: string
  assignedTo: Array<{
    name: string
    email: string
    avatar?: string
  }>
  tags: string[]
  attachments: number
  comments: number
  createdAt: string
  updatedAt: string
  budget: number
  actualCost: number
  category: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Q4 Financial System Upgrade',
    description: 'Upgrade financial reporting system to support new regulatory requirements and improve performance.',
    status: 'active',
    priority: 'high',
    progress: 65,
    dueDate: '2024-03-31T23:59:59Z',
    assignedTo: [
      { name: 'Sarah Johnson', email: 'sarah.j@ledgerfy.com', avatar: '/avatars/sarah.jpg' },
      { name: 'Mike Chen', email: 'mike.chen@ledgerfy.com' }
    ],
    tags: ['financial', 'upgrade', 'regulatory', 'Q4'],
    attachments: 8,
    comments: 23,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    budget: 50000,
    actualCost: 32500,
    category: 'IT Infrastructure'
  },
  {
    id: '2',
    title: 'Client Portal Development',
    description: 'Develop new client portal for document sharing and real-time collaboration.',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    dueDate: '2024-05-15T23:59:59Z',
    assignedTo: [
      { name: 'David Kim', email: 'david.kim@ledgerfy.com' },
      { name: 'Lisa Rodriguez', email: 'lisa.r@ledgerfy.com' }
    ],
    tags: ['portal', 'client', 'development', 'collaboration'],
    attachments: 3,
    comments: 12,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    budget: 75000,
    actualCost: 11250,
    category: 'Software Development'
  },
  {
    id: '3',
    title: 'Compliance Audit Preparation',
    description: 'Prepare comprehensive compliance audit for SOX, GDPR, and industry regulations.',
    status: 'review',
    priority: 'critical',
    progress: 90,
    dueDate: '2024-02-15T23:59:59Z',
    assignedTo: [
      { name: 'Emily Watson', email: 'emily.w@ledgerfy.com' },
      { name: 'Sarah Johnson', email: 'sarah.j@ledgerfy.com', avatar: '/avatars/sarah.jpg' }
    ],
    tags: ['compliance', 'audit', 'SOX', 'GDPR', 'regulatory'],
    attachments: 15,
    comments: 45,
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-16T11:20:00Z',
    budget: 25000,
    actualCost: 22500,
    category: 'Compliance'
  },
  {
    id: '4',
    title: 'Data Migration Project',
    description: 'Migrate legacy data to new cloud-based system with data validation and integrity checks.',
    status: 'active',
    priority: 'high',
    progress: 45,
    dueDate: '2024-04-30T23:59:59Z',
    assignedTo: [
      { name: 'Mike Chen', email: 'mike.chen@ledgerfy.com' },
      { name: 'David Kim', email: 'david.kim@ledgerfy.com' }
    ],
    tags: ['migration', 'data', 'cloud', 'validation'],
    attachments: 6,
    comments: 18,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    budget: 40000,
    actualCost: 18000,
    category: 'Data Management'
  },
  {
    id: '5',
    title: 'Team Training Program',
    description: 'Develop and implement comprehensive training program for new compliance requirements.',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    dueDate: '2024-06-30T23:59:59Z',
    assignedTo: [
      { name: 'Lisa Rodriguez', email: 'lisa.r@ledgerfy.com' }
    ],
    tags: ['training', 'compliance', 'team', 'development'],
    attachments: 4,
    comments: 8,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
    budget: 15000,
    actualCost: 3750,
    category: 'Human Resources'
  }
]

const columns = [
  { id: 'planning', title: 'Planning', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'active', title: 'In Progress', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'review', title: 'Review', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900' }
]

export default function ProjectsKanbanPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [assignedToFilter, setAssignedToFilter] = useState('All')

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter
    const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter
    const matchesAssignedTo = assignedToFilter === 'All' || 
                             project.assignedTo.some(user => user.name === assignedToFilter)
    
    return matchesSearch && matchesPriority && matchesCategory && matchesAssignedTo
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Circle className="h-4 w-4 text-blue-500" />
      case 'active': return <ArrowRight className="h-4 w-4 text-yellow-500" />
      case 'review': return <AlertCircle className="h-4 w-4 text-purple-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDueDateColor = (dueDate: string) => {
    const daysRemaining = getDaysRemaining(dueDate)
    if (daysRemaining < 0) return 'text-red-600'
    if (daysRemaining <= 7) return 'text-orange-600'
    if (daysRemaining <= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  const renderProjectCard = (project: Project) => (
    <Card key={project.id} className="mb-4 hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-2 mb-2">
              {project.title}
            </CardTitle>
            <CardDescription className="text-xs line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-300", getProgressColor(project.progress))}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Priority and Status */}
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(project.priority)}>
            {project.priority}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            {getStatusIcon(project.status)}
            <span className="capitalize">{project.status}</span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span className={cn("font-medium", getDueDateColor(project.dueDate))}>
            {getDaysRemaining(project.dueDate) < 0 
              ? `${Math.abs(getDaysRemaining(project.dueDate))} days overdue`
              : `Due in ${getDaysRemaining(project.dueDate)} days`
            }
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Assigned Team */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.assignedTo.slice(0, 3).map((user, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.assignedTo.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                +{project.assignedTo.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Paperclip className="h-3 w-3" />
            <span>{project.attachments}</span>
            <MessageSquare className="h-3 w-3" />
            <span>{project.comments}</span>
          </div>
        </div>

        {/* Budget Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Budget</span>
          <div className="text-right">
            <div className="font-medium">${project.actualCost.toLocaleString()}</div>
            <div className="text-gray-500">of ${project.budget.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const getColumnProjects = (status: string) => {
    return filteredProjects.filter(project => project.status === status)
  }

  const priorities = ['All', 'low', 'medium', 'high', 'critical']
  const categories = ['All', 'IT Infrastructure', 'Software Development', 'Compliance', 'Data Management', 'Human Resources']
  const teamMembers = ['All', 'Sarah Johnson', 'Mike Chen', 'David Kim', 'Lisa Rodriguez', 'Emily Watson']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Kanban</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visual project management with drag-and-drop functionality
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
        <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map(member => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map(column => {
          const columnProjects = getColumnProjects(column.id)
          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className={cn("p-4 rounded-lg", column.color)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <Badge variant="secondary" className="bg-white/20 text-gray-900 dark:text-white">
                    {columnProjects.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div className="min-h-[600px] space-y-4">
                {columnProjects.map(renderProjectCard)}
                
                {columnProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">No projects</div>
                  </div>
                )}
              </div>

              {/* Add Project Button */}
              <Button variant="outline" className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{filteredProjects.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => getDaysRemaining(p.dueDate) < 0).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
