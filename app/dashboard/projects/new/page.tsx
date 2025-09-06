'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  FolderOpen,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Target,
  FileText,
  AlertCircle,
  Check,
  X
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Client {
  _id: string
  name: string
  email: string
  phone: string
}

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface ProjectFormData {
  name: string
  description: string
  clientId: string
  projectType: string
  priority: string
  startDate: string
  endDate: string
  budget: string
  estimatedHours: string
  projectManager: string
  teamMembers: string[]
  milestones: MilestoneFormData[]
}

interface MilestoneFormData {
  title: string
  description: string
  dueDate: string
}

interface FormErrors {
  name?: string
  description?: string
  clientId?: string
  projectType?: string
  priority?: string
  startDate?: string
  endDate?: string
  budget?: string
  estimatedHours?: string
  projectManager?: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    clientId: '',
    projectType: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: '',
    estimatedHours: '',
    projectManager: '',
    teamMembers: [],
    milestones: []
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients([
        {
          _id: '1',
          name: 'ABC Corporation',
          email: 'contact@abccorp.com',
          phone: '+91 98765 43210'
        },
        {
          _id: '2',
          name: 'XYZ Limited',
          email: 'info@xyzlimited.com',
          phone: '+91 98765 43211'
        },
        {
          _id: '3',
          name: 'DEF Industries',
          email: 'admin@defindustries.com',
          phone: '+91 98765 43212'
        },
        {
          _id: '4',
          name: 'GHI Solutions',
          email: 'support@ghisolutions.com',
          phone: '+91 98765 43213'
        }
      ])

      setUsers([
        {
          _id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@ledgerfy.com',
          role: 'Administrator'
        },
        {
          _id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@ledgerfy.com',
          role: 'Manager'
        },
        {
          _id: '3',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@ledgerfy.com',
          role: 'Senior Accountant'
        },
        {
          _id: '4',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike@ledgerfy.com',
          role: 'Accountant'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const projectTypes = [
    { value: 'compliance', label: 'Compliance', description: 'GST, ROC, and regulatory compliance' },
    { value: 'audit', label: 'Audit', description: 'Statutory and internal audits' },
    { value: 'consulting', label: 'Consulting', description: 'Business and tax consulting' },
    { value: 'tax', label: 'Tax Planning', description: 'Tax optimization and planning' },
    { value: 'bookkeeping', label: 'Bookkeeping', description: 'Maintaining books of accounts' },
    { value: 'other', label: 'Other', description: 'Other services' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client'
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (!formData.projectManager) {
      newErrors.projectManager = 'Please select a project manager'
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    // Budget validation
    if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) < 0)) {
      newErrors.budget = 'Please enter a valid budget amount'
    }

    // Hours validation
    if (formData.estimatedHours && (isNaN(Number(formData.estimatedHours)) || Number(formData.estimatedHours) < 0)) {
      newErrors.estimatedHours = 'Please enter a valid number of hours'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - redirect to projects list
      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      // Handle error (show toast, etc.)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', dueDate: '' }]
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const updateMilestone = (index: number, field: keyof MilestoneFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const selectedClient = clients.find(client => client._id === formData.clientId)
  const selectedProjectManager = users.find(user => user._id === formData.projectManager)

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create New Project"
          description="Set up a new project for your client"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
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
        title="Create New Project"
        description="Set up a new project for your client"
      >
        <PageHeaderActions>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Project Information
              </CardTitle>
              <CardDescription>
                Basic details about the project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(errors.name && "border-red-500")}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={cn(errors.description && "border-red-500")}
                  placeholder="Describe the project scope and objectives"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger className={cn(errors.clientId && "border-red-500")}>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.clientId}</p>
                )}
                {selectedClient && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedClient.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedClient.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="projectType">Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger className={cn(errors.projectType && "border-red-500")}>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.projectType}</p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-3 h-3 rounded-full", priority.color)}></div>
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline & Resources
              </CardTitle>
              <CardDescription>
                Set project timeline and resource allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={cn(errors.startDate && "border-red-500")}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={cn(errors.endDate && "border-red-500")}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Budget (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={cn("pl-10", errors.budget && "border-red-500")}
                    placeholder="Enter budget amount"
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.budget && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                    className={cn("pl-10", errors.estimatedHours && "border-red-500")}
                    placeholder="Enter estimated hours"
                    min="0"
                    step="0.5"
                  />
                </div>
                {errors.estimatedHours && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.estimatedHours}</p>
                )}
              </div>

              <div>
                <Label htmlFor="projectManager">Project Manager *</Label>
                <Select value={formData.projectManager} onValueChange={(value) => handleInputChange('projectManager', value)}>
                  <SelectTrigger className={cn(errors.projectManager && "border-red-500")}>
                    <SelectValue placeholder="Select project manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectManager && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.projectManager}</p>
                )}
                {selectedProjectManager && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedProjectManager.firstName} {selectedProjectManager.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedProjectManager.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedProjectManager.email}</p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="teamMembers">Team Members</Label>
                <Select 
                  value="" 
                  onValueChange={(value) => {
                    if (value && !formData.teamMembers.includes(value)) {
                      handleInputChange('teamMembers', [...formData.teamMembers, value])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add team members" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(user => user._id !== formData.projectManager).map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.teamMembers.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.teamMembers.map((memberId) => {
                      const member = users.find(user => user._id === memberId)
                      return member ? (
                        <div key={memberId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInputChange('teamMembers', formData.teamMembers.filter(id => id !== memberId))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Project Milestones
                </CardTitle>
                <CardDescription>
                  Define key milestones and deliverables
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addMilestone}>
                <Target className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.milestones.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No milestones added</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add milestones to track project progress and key deliverables.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Milestone {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor={`milestone-title-${index}`}>Title</Label>
                        <Input
                          id={`milestone-title-${index}`}
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="Milestone title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`milestone-date-${index}`}>Due Date</Label>
                        <Input
                          id={`milestone-date-${index}`}
                          type="date"
                          value={milestone.dueDate}
                          onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`milestone-desc-${index}`}>Description</Label>
                        <Input
                          id={`milestone-desc-${index}`}
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Review all information before creating the project
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/projects')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <RequirePermission permission="projects:create">
                  <Button
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Project
                      </>
                    )}
                  </Button>
                </RequirePermission>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
