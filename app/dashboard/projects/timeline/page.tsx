'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ProjectMilestone {
  id: string
  title: string
  description: string
  projectId: string
  projectTitle: string
  dueDate: string
  completedDate?: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: Array<{
    name: string
    email: string
    avatar?: string
  }>
  dependencies: string[]
  progress: number
  category: string
}

const mockMilestones: ProjectMilestone[] = [
  {
    id: '1',
    title: 'System Requirements Analysis',
    description: 'Complete analysis of system requirements for financial system upgrade',
    projectId: '1',
    projectTitle: 'Q4 Financial System Upgrade',
    dueDate: '2024-01-31T23:59:59Z',
    completedDate: '2024-01-28T16:30:00Z',
    status: 'completed',
    priority: 'high',
    assignedTo: [
      { name: 'Sarah Johnson', email: 'sarah.j@ledgerfy.com', avatar: '/avatars/sarah.jpg' }
    ],
    dependencies: [],
    progress: 100,
    category: 'Analysis'
  },
  {
    id: '2',
    title: 'Database Schema Design',
    description: 'Design new database schema for improved performance',
    projectId: '1',
    projectTitle: 'Q4 Financial System Upgrade',
    dueDate: '2024-02-15T23:59:59Z',
    status: 'in_progress',
    priority: 'high',
    assignedTo: [
      { name: 'Mike Chen', email: 'mike.chen@ledgerfy.com' }
    ],
    dependencies: ['1'],
    progress: 75,
    category: 'Design'
  },
  {
    id: '3',
    title: 'Frontend Development',
    description: 'Develop new user interface components',
    projectId: '2',
    projectTitle: 'Client Portal Development',
    dueDate: '2024-03-15T23:59:59Z',
    status: 'pending',
    priority: 'medium',
    assignedTo: [
      { name: 'David Kim', email: 'david.kim@ledgerfy.com' }
    ],
    dependencies: ['4'],
    progress: 0,
    category: 'Development'
  },
  {
    id: '4',
    title: 'Backend API Development',
    description: 'Develop RESTful APIs for client portal',
    projectId: '2',
    projectTitle: 'Client Portal Development',
    dueDate: '2024-02-28T23:59:59Z',
    status: 'pending',
    priority: 'medium',
    assignedTo: [
      { name: 'Lisa Rodriguez', email: 'lisa.r@ledgerfy.com' }
    ],
    dependencies: [],
    progress: 0,
    category: 'Development'
  },
  {
    id: '5',
    title: 'Compliance Documentation Review',
    description: 'Review and finalize compliance documentation',
    projectId: '3',
    projectTitle: 'Compliance Audit Preparation',
    dueDate: '2024-02-10T23:59:59Z',
    status: 'overdue',
    priority: 'critical',
    assignedTo: [
      { name: 'Emily Watson', email: 'emily.w@ledgerfy.com' }
    ],
    dependencies: [],
    progress: 60,
    category: 'Review'
  },
  {
    id: '6',
    title: 'Data Validation Testing',
    description: 'Test data validation and integrity checks',
    projectId: '4',
    projectTitle: 'Data Migration Project',
    dueDate: '2024-02-20T23:59:59Z',
    status: 'in_progress',
    priority: 'high',
    assignedTo: [
      { name: 'Mike Chen', email: 'mike.chen@ledgerfy.com' }
    ],
    dependencies: ['7'],
    progress: 40,
    category: 'Testing'
  },
  {
    id: '7',
    title: 'Data Migration Scripts',
    description: 'Develop data migration scripts and procedures',
    projectId: '4',
    projectTitle: 'Data Migration Project',
    dueDate: '2024-02-05T23:59:59Z',
    completedDate: '2024-02-03T14:15:00Z',
    status: 'completed',
    priority: 'high',
    assignedTo: [
      { name: 'David Kim', email: 'david.kim@ledgerfy.com' }
    ],
    dependencies: [],
    progress: 100,
    category: 'Development'
  }
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function ProjectsTimelinePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')

  const filteredMilestones = mockMilestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || milestone.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || milestone.priority === priorityFilter
    const matchesCategory = categoryFilter === 'All' || milestone.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    if (progress >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Circle className="h-4 w-4 text-gray-500" />
      case 'in_progress': return <ArrowRight className="h-4 w-4 text-blue-500" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />
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

  const groupMilestonesByMonth = () => {
    const grouped: { [key: string]: ProjectMilestone[] } = {}
    
    filteredMilestones.forEach(milestone => {
      const date = new Date(milestone.dueDate)
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(milestone)
    })
    
    return Object.entries(grouped).sort(([a], [b]) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const renderTimelineView = () => {
    const groupedMilestones = groupMilestonesByMonth()
    
    return (
      <div className="space-y-8">
        {groupedMilestones.map(([month, milestones]) => (
          <div key={month} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-lg font-semibold text-gray-900 dark:text-white">
                {month}
              </div>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            
            <div className="ml-32 space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {/* Timeline Connector */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />
                  )}
                  
                  {/* Milestone Card */}
                  <Card className="ml-8 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(milestone.status)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {milestone.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {milestone.description}
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {milestone.projectTitle}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(milestone.priority)}>
                                {milestone.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Progress and Due Date */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                                <span className="font-medium">{milestone.progress}%</span>
                              </div>
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={cn("h-2 rounded-full transition-all duration-300", getProgressColor(milestone.progress))}
                                  style={{ width: `${milestone.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className={cn("font-medium", getDueDateColor(milestone.dueDate))}>
                                {getDaysRemaining(milestone.dueDate) < 0 
                                  ? `${Math.abs(getDaysRemaining(milestone.dueDate))} days overdue`
                                  : `Due in ${getDaysRemaining(milestone.dueDate)} days`
                                }
                              </span>
                            </div>
                          </div>
                          
                          {/* Assigned Team */}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {milestone.assignedTo.map((user, userIndex) => (
                                <Avatar key={userIndex} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderListView = () => (
    <div className="space-y-4">
      {filteredMilestones.map(milestone => (
        <Card key={milestone.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {milestone.projectTitle}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Category: {milestone.category}</span>
                    <span>Progress: {milestone.progress}%</span>
                    <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(milestone.priority)}>
                  {milestone.priority}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const statuses = ['All', 'pending', 'in_progress', 'completed', 'overdue']
  const priorities = ['All', 'low', 'medium', 'high', 'critical']
  const categories = ['All', 'Analysis', 'Design', 'Development', 'Testing', 'Review', 'Deployment']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Timeline</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visual timeline view of project milestones and deadlines
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Milestone
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search milestones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'All' ? status : status.replace('_', ' ')}
                </SelectItem>
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
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Timeline/List View */}
      {viewMode === 'timeline' ? renderTimelineView() : renderListView()}

      {filteredMilestones.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium">No milestones found</h3>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              <div>
                <div className="text-2xl font-bold">{filteredMilestones.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Milestones</div>
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
                  {filteredMilestones.filter(m => m.status === 'in_progress').length}
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
                  {filteredMilestones.filter(m => m.status === 'completed').length}
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
                  {filteredMilestones.filter(m => m.status === 'overdue').length}
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
