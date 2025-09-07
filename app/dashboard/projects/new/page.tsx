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
  X,
  Copy,
  Shield,
  BookOpen,
  Settings,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Eye,
  Download
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  // CA Firm specific fields
  billingType: string
  hourlyRate: string
  fixedFee: string
  retainerAmount: string
  complianceRequirements: string[]
  documentRequirements: DocumentRequirement[]
  riskAssessment: RiskAssessment[]
  clientCommunication: ClientCommunication
  projectTemplate: string
  isRecurring: boolean
  recurringFrequency: string
  confidentialityLevel: string
  regulatoryDeadlines: RegulatoryDeadline[]
}

interface MilestoneFormData {
  title: string
  description: string
  dueDate: string
}

interface DocumentRequirement {
  id: string
  name: string
  type: string
  isRequired: boolean
  description: string
}

interface RiskAssessment {
  id: string
  risk: string
  impact: string
  probability: string
  mitigation: string
}

interface ClientCommunication {
  preferredMethod: string
  frequency: string
  reportingSchedule: string
  escalationContact: string
}

interface RegulatoryDeadline {
  id: string
  requirement: string
  deadline: string
  authority: string
  penalty: string
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
    milestones: [],
    // CA Firm specific fields
    billingType: 'hourly',
    hourlyRate: '',
    fixedFee: '',
    retainerAmount: '',
    complianceRequirements: [],
    documentRequirements: [],
    riskAssessment: [],
    clientCommunication: {
      preferredMethod: 'email',
      frequency: 'weekly',
      reportingSchedule: 'monthly',
      escalationContact: ''
    },
    projectTemplate: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
    confidentialityLevel: 'standard',
    regulatoryDeadlines: []
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
    { value: 'annual_audit', label: 'Annual Audit', description: 'Statutory audit of financial statements' },
    { value: 'gst_compliance', label: 'GST Compliance', description: 'GST return filing and compliance' },
    { value: 'tax_filing', label: 'Tax Filing', description: 'Income tax return preparation and filing' },
    { value: 'roc_compliance', label: 'ROC Compliance', description: 'Registrar of Companies compliance' },
    { value: 'bookkeeping', label: 'Bookkeeping', description: 'Maintaining books of accounts' },
    { value: 'tax_planning', label: 'Tax Planning', description: 'Tax optimization and planning' },
    { value: 'internal_audit', label: 'Internal Audit', description: 'Internal control and process audit' },
    { value: 'due_diligence', label: 'Due Diligence', description: 'Financial and legal due diligence' },
    { value: 'valuation', label: 'Valuation', description: 'Business and asset valuation' },
    { value: 'consulting', label: 'Business Consulting', description: 'Strategic business consulting' },
    { value: 'other', label: 'Other', description: 'Other professional services' }
  ]

  const projectTemplates = [
    {
      id: 'annual_audit_template',
      name: 'Annual Audit Template',
      type: 'annual_audit',
      description: 'Complete annual audit workflow with all required steps',
      estimatedHours: 120,
      milestones: [
        { title: 'Planning & Risk Assessment', description: 'Initial planning and risk assessment', dueDate: '' },
        { title: 'Fieldwork & Testing', description: 'Detailed audit procedures and testing', dueDate: '' },
        { title: 'Review & Documentation', description: 'Review findings and prepare documentation', dueDate: '' },
        { title: 'Report Preparation', description: 'Draft and finalize audit report', dueDate: '' }
      ]
    },
    {
      id: 'gst_compliance_template',
      name: 'GST Compliance Template',
      type: 'gst_compliance',
      description: 'Monthly GST return filing and compliance workflow',
      estimatedHours: 16,
      milestones: [
        { title: 'Data Collection', description: 'Collect GST data and documents', dueDate: '' },
        { title: 'Return Preparation', description: 'Prepare GSTR-1, GSTR-3B returns', dueDate: '' },
        { title: 'Review & Filing', description: 'Review and file returns', dueDate: '' },
        { title: 'Reconciliation', description: 'Reconcile with books of accounts', dueDate: '' }
      ]
    },
    {
      id: 'tax_filing_template',
      name: 'Tax Filing Template',
      type: 'tax_filing',
      description: 'Income tax return preparation and filing workflow',
      estimatedHours: 24,
      milestones: [
        { title: 'Document Collection', description: 'Collect all required tax documents', dueDate: '' },
        { title: 'Return Preparation', description: 'Prepare ITR forms', dueDate: '' },
        { title: 'Review & Validation', description: 'Review and validate return', dueDate: '' },
        { title: 'Filing & Acknowledgment', description: 'File return and obtain acknowledgment', dueDate: '' }
      ]
    }
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

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleClientCommunicationChange = (field: keyof ClientCommunication, value: string) => {
    setFormData(prev => ({
      ...prev,
      clientCommunication: { ...prev.clientCommunication, [field]: value }
    }))
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

  const applyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      projectType: template.type,
      estimatedHours: template.estimatedHours.toString(),
      milestones: template.milestones,
      projectTemplate: template.id
    }))
  }

  const addDocumentRequirement = () => {
    const newRequirement: DocumentRequirement = {
      id: Date.now().toString(),
      name: '',
      type: 'financial',
      isRequired: true,
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      documentRequirements: [...prev.documentRequirements, newRequirement]
    }))
  }

  const removeDocumentRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      documentRequirements: prev.documentRequirements.filter(req => req.id !== id)
    }))
  }

  const updateDocumentRequirement = (id: string, field: keyof DocumentRequirement, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map(req => 
        req.id === id ? { ...req, [field]: value } : req
      )
    }))
  }

  const addRiskAssessment = () => {
    const newRisk: RiskAssessment = {
      id: Date.now().toString(),
      risk: '',
      impact: 'medium',
      probability: 'medium',
      mitigation: ''
    }
    setFormData(prev => ({
      ...prev,
      riskAssessment: [...prev.riskAssessment, newRisk]
    }))
  }

  const removeRiskAssessment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      riskAssessment: prev.riskAssessment.filter(risk => risk.id !== id)
    }))
  }

  const updateRiskAssessment = (id: string, field: keyof RiskAssessment, value: string) => {
    setFormData(prev => ({
      ...prev,
      riskAssessment: prev.riskAssessment.map(risk => 
        risk.id === id ? { ...risk, [field]: value } : risk
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
        {/* Project Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Project Templates
            </CardTitle>
            <CardDescription>
              Choose from pre-configured templates for common CA firm projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {projectTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                    <Badge variant="secondary">{template.estimatedHours}h</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{template.milestones.length} milestones</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="billing">Billing & Fees</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Billing & Fee Structure
                </CardTitle>
                <CardDescription>
                  Configure billing method and fee structure for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="billingType">Billing Type</Label>
                  <Select value={formData.billingType} onValueChange={(value) => handleInputChange('billingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="fixed">Fixed Fee</SelectItem>
                      <SelectItem value="retainer">Retainer</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Fixed + Hourly)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.billingType === 'hourly' && (
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="Enter hourly rate"
                      min="0"
                      step="100"
                    />
                  </div>
                )}

                {formData.billingType === 'fixed' && (
                  <div>
                    <Label htmlFor="fixedFee">Fixed Fee (₹)</Label>
                    <Input
                      id="fixedFee"
                      type="number"
                      value={formData.fixedFee}
                      onChange={(e) => handleInputChange('fixedFee', e.target.value)}
                      placeholder="Enter fixed fee amount"
                      min="0"
                      step="1000"
                    />
                  </div>
                )}

                {formData.billingType === 'retainer' && (
                  <div>
                    <Label htmlFor="retainerAmount">Retainer Amount (₹)</Label>
                    <Input
                      id="retainerAmount"
                      type="number"
                      value={formData.retainerAmount}
                      onChange={(e) => handleInputChange('retainerAmount', e.target.value)}
                      placeholder="Enter retainer amount"
                      min="0"
                      step="1000"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
                  />
                  <Label htmlFor="isRecurring">Recurring Project</Label>
                </div>

                {formData.isRecurring && (
                  <div>
                    <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
                    <Select value={formData.recurringFrequency} onValueChange={(value) => handleInputChange('recurringFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance & Risk Assessment
                </CardTitle>
                <CardDescription>
                  Define compliance requirements and assess project risks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Compliance Requirements</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {['GST', 'Income Tax', 'ROC', 'TDS', 'PF/ESI', 'Professional Standards'].map((req) => (
                      <div key={req} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`compliance-${req}`}
                          checked={formData.complianceRequirements.includes(req)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('complianceRequirements', [...formData.complianceRequirements, req])
                            } else {
                              handleInputChange('complianceRequirements', formData.complianceRequirements.filter(r => r !== req))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`compliance-${req}`} className="text-sm">{req}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Risk Assessment</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addRiskAssessment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Risk
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.riskAssessment.map((risk) => (
                      <div key={risk.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Risk Assessment</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRiskAssessment(risk.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <Label>Risk Description</Label>
                            <Input
                              value={risk.risk}
                              onChange={(e) => updateRiskAssessment(risk.id, 'risk', e.target.value)}
                              placeholder="Describe the risk"
                            />
                          </div>
                          <div>
                            <Label>Impact</Label>
                            <Select value={risk.impact} onValueChange={(value) => updateRiskAssessment(risk.id, 'impact', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Probability</Label>
                            <Select value={risk.probability} onValueChange={(value) => updateRiskAssessment(risk.id, 'probability', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Mitigation Strategy</Label>
                            <Input
                              value={risk.mitigation}
                              onChange={(e) => updateRiskAssessment(risk.id, 'mitigation', e.target.value)}
                              placeholder="How to mitigate this risk"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="confidentialityLevel">Confidentiality Level</Label>
                  <Select value={formData.confidentialityLevel} onValueChange={(value) => handleInputChange('confidentialityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select confidentiality level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="highly_confidential">Highly Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Requirements
                </CardTitle>
                <CardDescription>
                  Define required documents and deliverables for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Required Documents</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addDocumentRequirement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.documentRequirements.map((req) => (
                    <div key={req.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Document Requirement</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocumentRequirement(req.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label>Document Name</Label>
                          <Input
                            value={req.name}
                            onChange={(e) => updateDocumentRequirement(req.id, 'name', e.target.value)}
                            placeholder="e.g., Financial Statements"
                          />
                        </div>
                        <div>
                          <Label>Document Type</Label>
                          <Select value={req.type} onValueChange={(value) => updateDocumentRequirement(req.id, 'type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="financial">Financial</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                              <SelectItem value="tax">Tax</SelectItem>
                              <SelectItem value="compliance">Compliance</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={req.description}
                            onChange={(e) => updateDocumentRequirement(req.id, 'description', e.target.value)}
                            placeholder="Describe the document requirement"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${req.id}`}
                            checked={req.isRequired}
                            onChange={(e) => updateDocumentRequirement(req.id, 'isRequired', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`required-${req.id}`} className="text-sm">Required</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Client Communication
                </CardTitle>
                <CardDescription>
                  Configure communication preferences and reporting schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredMethod">Preferred Communication Method</Label>
                  <Select value={formData.clientCommunication.preferredMethod} onValueChange={(value) => handleClientCommunicationChange('preferredMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select communication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                      <SelectItem value="portal">Client Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Communication Frequency</Label>
                  <Select value={formData.clientCommunication.frequency} onValueChange={(value) => handleClientCommunicationChange('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reportingSchedule">Reporting Schedule</Label>
                  <Select value={formData.clientCommunication.reportingSchedule} onValueChange={(value) => handleClientCommunicationChange('reportingSchedule', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reporting schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="milestone">At Milestones</SelectItem>
                      <SelectItem value="project_end">Project End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="escalationContact">Escalation Contact</Label>
                  <Input
                    id="escalationContact"
                    value={formData.clientCommunication.escalationContact}
                    onChange={(e) => handleClientCommunicationChange('escalationContact', e.target.value)}
                    placeholder="Enter escalation contact details"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
