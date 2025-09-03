'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Edit3,
  Trash2,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Today,
  CalendarDays,
  FileText,
  Users,
  Building2,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface ComplianceEvent {
  id: string
  title: string
  description: string
  type: 'gst' | 'tds' | 'roc' | 'income-tax' | 'audit' | 'other'
  dueDate: Date
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  clientId?: string
  clientName?: string
  assignedTo?: string
  attachments: number
  notes: string
  createdAt: Date
  updatedAt: Date
}

interface Client {
  id: string
  name: string
  type: 'individual' | 'company' | 'partnership' | 'llp'
  gstin?: string
  pan?: string
}

export default function ComplianceCalendarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<ComplianceEvent[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ComplianceEvent | null>(null)

  // Mock data
  useEffect(() => {
    setClients([
      { id: '1', name: 'ABC Corporation Ltd', type: 'company', gstin: '27AABCA1234Z1Z5', pan: 'AABCA1234Z' },
      { id: '2', name: 'XYZ Traders', type: 'partnership', gstin: '27AAFXB5678Y2Y6', pan: 'AAFXB5678Y' },
      { id: '3', name: 'John Doe & Associates', type: 'llp', gstin: '27AAJDA9012X3X7', pan: 'AAJDA9012X' }
    ])

    setEvents([
      {
        id: '1',
        title: 'GST Return Filing - Q1 2024',
        description: 'File GST return for Q1 2024 for ABC Corporation',
        type: 'gst',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'high',
        clientId: '1',
        clientName: 'ABC Corporation Ltd',
        assignedTo: 'John Doe',
        attachments: 3,
        notes: 'All documents received, ready for filing',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'TDS Return - Q4 2023',
        description: 'File TDS return for Q4 2023',
        type: 'tds',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'in-progress',
        priority: 'critical',
        clientId: '2',
        clientName: 'XYZ Traders',
        assignedTo: 'Jane Smith',
        attachments: 5,
        notes: 'Pending salary certificates',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'ROC Annual Filing',
        description: 'Annual ROC compliance for ABC Corporation',
        type: 'roc',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'overdue',
        priority: 'critical',
        clientId: '1',
        clientName: 'ABC Corporation Ltd',
        assignedTo: 'Mike Johnson',
        attachments: 8,
        notes: 'Board resolution pending',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Income Tax Return - AY 2024-25',
        description: 'File ITR for ABC Corporation',
        type: 'income-tax',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        clientId: '1',
        clientName: 'ABC Corporation Ltd',
        assignedTo: 'John Doe',
        attachments: 2,
        notes: 'Audit report awaited',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ])
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gst': return <FileText className="h-4 w-4 text-blue-500" />
      case 'tds': return <Users className="h-4 w-4 text-green-500" />
      case 'roc': return <Building2 className="h-4 w-4 text-purple-500" />
      case 'income-tax': return <Target className="h-4 w-4 text-orange-500" />
      case 'audit': return <BarChart3 className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gst': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'tds': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'roc': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'income-tax': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'audit': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
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

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (selectedType === 'all' || event.type === selectedType) ||
    (selectedStatus === 'all' || event.status === selectedStatus)
  )

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.dueDate.toDateString() === date.toDateString()
    )
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const openEventModal = (event: ComplianceEvent) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const monthDays = getMonthDays()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Compliance Calendar"
        description="Track and manage all compliance deadlines and events in a calendar view"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Compliance', href: '/dashboard/compliance' },
          { label: 'Calendar', href: '/dashboard/compliance/calendar' }
        ]}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/compliance')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Compliance
          </Button>
          <Button onClick={() => setShowEventModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{events.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {events.filter(e => e.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
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
                    {events.filter(e => getDaysUntilDue(e.dueDate) <= 7 && getDaysUntilDue(e.dueDate) >= 0).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
                    {events.filter(e => e.status === 'overdue').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gst">GST</SelectItem>
                    <SelectItem value="tds">TDS</SelectItem>
                    <SelectItem value="roc">ROC</SelectItem>
                    <SelectItem value="income-tax">Income Tax</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Day
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={goToToday}>
                <Today className="h-4 w-4 mr-2" />
                Today
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {day}
                  </span>
                </div>
              ))}
              
              {/* Calendar Days */}
              {monthDays.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[120px] p-2 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      !isCurrentMonth && "bg-gray-100 dark:bg-gray-800 text-gray-400",
                      isToday && "ring-2 ring-blue-500",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isToday && "text-blue-600 dark:text-blue-400",
                        !isCurrentMonth && "text-gray-400"
                      )}>
                        {date.getDate()}
                      </span>
                      
                      {dayEvents.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Events for this day */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "p-1 rounded text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                            event.status === 'overdue' && "bg-red-100 dark:bg-red-900/20",
                            event.status === 'pending' && "bg-yellow-100 dark:bg-yellow-900/20",
                            event.status === 'in-progress' && "bg-blue-100 dark:bg-blue-900/20",
                            event.status === 'completed' && "bg-green-100 dark:bg-green-900/20"
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            openEventModal(event)
                          }}
                        >
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(event.type)}
                            <span className="truncate font-medium">
                              {event.title}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                            <span className={cn("text-xs", getDueDateColor(event.dueDate))}>
                              {getDaysUntilDue(event.dueDate) < 0 
                                ? `${Math.abs(getDaysUntilDue(event.dueDate))}d overdue`
                                : getDaysUntilDue(event.dueDate) === 0 
                                  ? 'Due today'
                                  : `${getDaysUntilDue(event.dueDate)}d left`
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Events for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                <Button variant="outline" onClick={() => setSelectedDate(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          {getTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className={getTypeColor(event.type)}>
                              {event.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(event.status)}>
                              {event.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(event.priority)}>
                              {event.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No events on this date
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click the button below to add a new compliance event
                  </p>
                  <Button className="mt-4" onClick={() => setShowEventModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
