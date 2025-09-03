'use client'

import { useState, useEffect } from 'react'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Kanban,
  Calendar,
  Users,
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Play,
  Pause,
  Square
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  }
  teamMembers: {
    _id: string
    firstName: string
    lastName: string
  }[]
  budget?: number
  actualCost?: number
  estimatedHours?: number
  actualHours?: number
  createdAt: string
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
}

export default function ProjectsPage() {
  const { hasPermission } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'list' | 'kanban'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [selectedClient, setSelectedClient] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects([
        {
          _id: '1',
          name: 'GST Compliance 2024-25',
          description: 'Complete GST compliance for ABC Corporation',
          clientId: { _id: '1', name: 'ABC Corporation' },
          projectType: 'compliance',
          status: 'active',
          priority: 'high',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          progress: 65,
          projectManager: { _id: '1', firstName: 'Admin', lastName: 'User' },
          teamMembers: [
            { _id: '1', firstName: 'Admin', lastName: 'User' },
            { _id: '2', firstName: 'John', lastName: 'Doe' }
          ],
          budget: 50000,
          actualCost: 32500,
          estimatedHours: 200,
          actualHours: 130,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          name: 'Annual Audit 2024',
          description: 'Annual statutory audit for XYZ Limited',
          clientId: { _id: '2', name: 'XYZ Limited' },
          projectType: 'audit',
          status: 'planning',
          priority: 'medium',
          startDate: '2024-02-01',
          endDate: '2024-05-31',
          progress: 15,
          projectManager: { _id: '2', firstName: 'John', lastName: 'Doe' },
          teamMembers: [
            { _id: '2', firstName: 'John', lastName: 'Doe' },
            { _id: '3', firstName: 'Jane', lastName: 'Smith' }
          ],
          budget: 75000,
          actualCost: 11250,
          estimatedHours: 300,
          actualHours: 45,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          _id: '3',
          name: 'Tax Planning FY 2024-25',
          description: 'Tax optimization strategy for DEF Industries',
          clientId: { _id: '3', name: 'DEF Industries' },
          projectType: 'consulting',
          status: 'active',
          priority: 'high',
          startDate: '2024-01-15',
          endDate: '2024-02-28',
          progress: 80,
          projectManager: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
          teamMembers: [
            { _id: '3', firstName: 'Jane', lastName: 'Smith' },
            { _id: '1', firstName: 'Admin', lastName: 'User' }
          ],
          budget: 35000,
          actualCost: 28000,
          estimatedHours: 120,
          actualHours: 96,
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          _id: '4',
          name: 'ROC Filing 2024',
          description: 'Annual ROC compliance for GHI Solutions',
          clientId: { _id: '4', name: 'GHI Solutions' },
          projectType: 'compliance',
          status: 'completed',
          priority: 'low',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          progress: 100,
          projectManager: { _id: '1', firstName: 'Admin', lastName: 'User' },
          teamMembers: [
            { _id: '1', firstName: 'Admin', lastName: 'User' }
          ],
          budget: 15000,
          actualCost: 14200,
          estimatedHours: 60,
          actualHours: 58,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ])

      setTasks([
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
          actualHours: 5.5
        },
        {
          _id: '2',
          title: 'Prepare Audit Checklist',
          description: 'Create comprehensive audit checklist',
          status: 'todo',
          priority: 'medium',
          assignedTo: { _id: '3', firstName: 'Jane', lastName: 'Smith' },
          dueDate: '2024-01-30',
          progress: 0,
          estimatedHours: 4,
          actualHours: 0
        },
        {
          _id: '3',
          title: 'Tax Calculation Review',
          description: 'Review tax calculations and optimizations',
          status: 'review',
          priority: 'high',
          assignedTo: { _id: '1', firstName: 'Admin', lastName: 'User' },
          dueDate: '2024-01-28',
          progress: 90,
          estimatedHours: 6,
          actualHours: 5.2
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientId.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || project.projectType === selectedType
    const matchesStatus = !selectedStatus || project.status === selectedStatus
    const matchesPriority = !selectedPriority || project.priority === selectedPriority
    const matchesClient = !selectedClient || project.clientId._id === selectedClient

    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesClient
  })

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.planning
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

  const getProjectTypeColor = (type: string) => {
    const colors = {
      compliance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      audit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      consulting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      tax: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Clock className="h-4 w-4" />
      case 'active':
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

  const getDaysRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Calculate statistics
  const totalProjects = projects.length
  const activeProjects = projects.filter(project => project.status === 'active').length
  const completedProjects = projects.filter(project => project.status === 'completed').length
  const planningProjects = projects.filter(project => project.status === 'planning').length
  const criticalProjects = projects.filter(project => project.priority === 'critical').length

  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0)
  const totalActualCost = projects.reduce((sum, project) => sum + (project.actualCost || 0), 0)
  const totalEstimatedHours = projects.reduce((sum, project) => sum + (project.estimatedHours || 0), 0)
  const totalActualHours = projects.reduce((sum, project) => sum + (project.actualHours || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          description="Manage projects and track progress"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
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
        title="Projects"
        description="Manage projects and track progress"
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
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </div>
          <RequirePermission permission="projects:create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
                <option value="compliance">Compliance</option>
                <option value="audit">Audit</option>
                <option value="consulting">Consulting</option>
                <option value="tax">Tax</option>
                <option value="other">Other</option>
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
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeProjects}</p>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planning</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{planningProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Budget vs. actual costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Actual Cost</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totalActualCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Variance</span>
                    <span className={cn(
                      "font-medium",
                      totalActualCost > totalBudget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    )}>
                      {formatCurrency(totalBudget - totalActualCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>
                  Estimated vs. actual hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours</span>
                    <span className="font-medium text-gray-900 dark:text-white">{totalEstimatedHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Actual Hours</span>
                    <span className="font-medium text-gray-900 dark:text-white">{totalActualHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {totalEstimatedHours > 0 ? Math.round((totalActualHours / totalEstimatedHours) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Latest project updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <Badge className={cn("text-xs", getStatusColor(project.status))}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.clientId.name} • {project.projectType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{project.progress}%</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getDaysRemaining(project.endDate)} days left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Timeline</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Team</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">{project.clientId.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={cn("text-xs", getProjectTypeColor(project.projectType))}>
                            {project.projectType}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Badge className={cn("text-xs", getStatusColor(project.status))}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={cn("text-xs", getPriorityColor(project.priority))}>
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getDaysRemaining(project.endDate)} days left
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {project.projectManager.firstName} {project.projectManager.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {project.teamMembers.length} members
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {project.budget ? formatCurrency(project.budget) : '-'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {project.actualCost ? formatCurrency(project.actualCost) : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'kanban' && (
        <Card>
          <CardHeader>
            <CardTitle>Kanban Board</CardTitle>
            <CardDescription>
              Kanban view coming soon...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Kanban className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kanban Board</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Interactive kanban board will be implemented in the next iteration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
