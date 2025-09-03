'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  CreditCard,
  Shield,
  Globe,
  Users,
  Briefcase,
  Target,
  TrendingUp
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

interface ClientForm {
  // Basic Information
  name: string
  type: 'individual' | 'company' | 'partnership' | 'llp' | 'trust' | 'society'
  email: string
  phone: string
  alternatePhone?: string
  
  // Address Information
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  
  // Business Information
  business: {
    nature: string
    industry: string
    turnover: number
    employeeCount: number
    establishedDate: string
    website?: string
  }
  
  // Compliance Information
  compliance: {
    pan: string
    gstin?: string
    aadhaar?: string
    tan?: string
    cin?: string
    llpin?: string
    registrationNumber?: string
  }
  
  // Banking Information
  banking: {
    bankName: string
    accountNumber: string
    ifscCode: string
    branch: string
  }
  
  // Additional Information
  notes: string
  tags: string[]
  assignedTo?: string
  status: 'active' | 'inactive' | 'prospect'
}

interface ValidationError {
  field: string
  message: string
}

export default function AddNewClientPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<ClientForm>({
    name: '',
    type: 'individual',
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    business: {
      nature: '',
      industry: '',
      turnover: 0,
      employeeCount: 0,
      establishedDate: '',
      website: ''
    },
    compliance: {
      pan: '',
      gstin: '',
      aadhaar: '',
      tan: '',
      cin: '',
      llpin: '',
      registrationNumber: ''
    },
    banking: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: ''
    },
    notes: '',
    tags: [],
    status: 'active'
  })
  
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [newTag, setNewTag] = useState('')

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  const industries = [
    'Manufacturing', 'Services', 'Trading', 'Real Estate', 'Technology',
    'Healthcare', 'Education', 'Finance', 'Agriculture', 'Construction',
    'Retail', 'Hospitality', 'Transportation', 'Energy', 'Media',
    'Consulting', 'Legal', 'Accounting', 'Other'
  ]

  const businessNatures = [
    'Proprietorship', 'Partnership', 'Private Limited', 'Public Limited',
    'LLP', 'Trust', 'Society', 'HUF', 'Individual', 'Other'
  ]

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = []

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'Client name is required' })
    }

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Invalid email format' })
    }

    if (!formData.phone.trim()) {
      newErrors.push({ field: 'phone', message: 'Phone number is required' })
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.push({ field: 'phone', message: 'Phone number must be 10 digits' })
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors.push({ field: 'street', message: 'Street address is required' })
    }

    if (!formData.address.city.trim()) {
      newErrors.push({ field: 'city', message: 'City is required' })
    }

    if (!formData.address.state.trim()) {
      newErrors.push({ field: 'state', message: 'State is required' })
    }

    if (!formData.address.pincode.trim()) {
      newErrors.push({ field: 'pincode', message: 'Pincode is required' })
    } else if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
      newErrors.push({ field: 'pincode', message: 'Pincode must be 6 digits' })
    }

    // Compliance validation
    if (!formData.compliance.pan.trim()) {
      newErrors.push({ field: 'pan', message: 'PAN is required' })
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.compliance.pan)) {
      newErrors.push({ field: 'pan', message: 'Invalid PAN format' })
    }

    if (formData.compliance.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.compliance.gstin)) {
      newErrors.push({ field: 'gstin', message: 'Invalid GSTIN format' })
    }

    if (formData.compliance.aadhaar && !/^[0-9]{12}$/.test(formData.compliance.aadhaar.replace(/\D/g, ''))) {
      newErrors.push({ field: 'aadhaar', message: 'Aadhaar must be 12 digits' })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - redirect to clients list
      router.push('/dashboard/clients')
    } catch (error) {
      console.error('Error creating client:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof ClientForm],
          [key]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message
  }

  const hasFieldError = (field: string) => {
    return !!getFieldError(field)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Add New Client"
        description="Create a new client profile with comprehensive business and compliance information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clients', href: '/dashboard/clients' },
          { label: 'Add New Client', href: '/dashboard/clients/new' }
        ]}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/clients')}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="client-form"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Client
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form id="client-form" onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="banking">Banking</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the client's basic contact and identification details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Enter client name"
                        className={cn(hasFieldError('name') && "border-red-500")}
                      />
                      {hasFieldError('name') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('name')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Type *
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => updateFormData('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="llp">LLP</SelectItem>
                          <SelectItem value="trust">Trust</SelectItem>
                          <SelectItem value="society">Society</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="client@example.com"
                        className={cn(hasFieldError('email') && "border-red-500")}
                      />
                      {hasFieldError('email') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('email')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        placeholder="9876543210"
                        className={cn(hasFieldError('phone') && "border-red-500")}
                      />
                      {hasFieldError('phone') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('phone')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Alternate Phone
                      </label>
                      <Input
                        value={formData.alternatePhone}
                        onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                        placeholder="9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) => updateFormData('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="prospect">Prospect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                      placeholder="Additional notes about the client..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Address Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the client's complete address details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => updateFormData('address.street', e.target.value)}
                      placeholder="123 Main Street, Building Name"
                      className={cn(hasFieldError('street') && "border-red-500")}
                    />
                    {hasFieldError('street') && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {getFieldError('street')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <Input
                        value={formData.address.city}
                        onChange={(e) => updateFormData('address.city', e.target.value)}
                        placeholder="Mumbai"
                        className={cn(hasFieldError('city') && "border-red-500")}
                      />
                      {hasFieldError('city') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('city')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <Select
                        value={formData.address.state}
                        onValueChange={(value) => updateFormData('address.state', value)}
                      >
                        <SelectTrigger className={cn(hasFieldError('state') && "border-red-500")}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {hasFieldError('state') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('state')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <Input
                        value={formData.address.pincode}
                        onChange={(e) => updateFormData('address.pincode', e.target.value)}
                        placeholder="400001"
                        className={cn(hasFieldError('pincode') && "border-red-500")}
                      />
                      {hasFieldError('pincode') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('pincode')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <Input
                      value={formData.address.country}
                      onChange={(e) => updateFormData('address.country', e.target.value)}
                      placeholder="India"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Tab */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Business Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the client's business details and financial information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nature of Business
                      </label>
                      <Select
                        value={formData.business.nature}
                        onValueChange={(value) => updateFormData('business.nature', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business nature" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessNatures.map(nature => (
                            <SelectItem key={nature} value={nature}>
                              {nature}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry
                      </label>
                      <Select
                        value={formData.business.industry}
                        onValueChange={(value) => updateFormData('business.industry', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Annual Turnover (₹)
                      </label>
                      <Input
                        type="number"
                        value={formData.business.turnover}
                        onChange={(e) => updateFormData('business.turnover', parseFloat(e.target.value) || 0)}
                        placeholder="1000000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Employees
                      </label>
                      <Input
                        type="number"
                        value={formData.business.employeeCount}
                        onChange={(e) => updateFormData('business.employeeCount', parseInt(e.target.value) || 0)}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Established Date
                      </label>
                      <Input
                        type="date"
                        value={formData.business.establishedDate}
                        onChange={(e) => updateFormData('business.establishedDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <Input
                        type="url"
                        value={formData.business.website}
                        onChange={(e) => updateFormData('business.website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Compliance Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the client's compliance and registration details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PAN Number *
                      </label>
                      <Input
                        value={formData.compliance.pan}
                        onChange={(e) => updateFormData('compliance.pan', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        className={cn(hasFieldError('pan') && "border-red-500")}
                      />
                      {hasFieldError('pan') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('pan')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GSTIN
                      </label>
                      <Input
                        value={formData.compliance.gstin}
                        onChange={(e) => updateFormData('compliance.gstin', e.target.value.toUpperCase())}
                        placeholder="27AABCA1234Z1Z5"
                        className={cn(hasFieldError('gstin') && "border-red-500")}
                      />
                      {hasFieldError('gstin') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('gstin')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aadhaar Number
                      </label>
                      <Input
                        value={formData.compliance.aadhaar}
                        onChange={(e) => updateFormData('compliance.aadhaar', e.target.value)}
                        placeholder="123456789012"
                        className={cn(hasFieldError('aadhaar') && "border-red-500")}
                      />
                      {hasFieldError('aadhaar') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {getFieldError('aadhaar')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        TAN Number
                      </label>
                      <Input
                        value={formData.compliance.tan}
                        onChange={(e) => updateFormData('compliance.tan', e.target.value.toUpperCase())}
                        placeholder="MUMB12345B"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CIN Number
                      </label>
                      <Input
                        value={formData.compliance.cin}
                        onChange={(e) => updateFormData('compliance.cin', e.target.value.toUpperCase())}
                        placeholder="U12345MH2020PTC123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LLPIN
                      </label>
                      <Input
                        value={formData.compliance.llpin}
                        onChange={(e) => updateFormData('compliance.llpin', e.target.value.toUpperCase())}
                        placeholder="AAB-1234"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Banking Tab */}
            <TabsContent value="banking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Banking Information</span>
                  </CardTitle>
                  <CardDescription>
                    Enter the client's primary bank account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Name
                      </label>
                      <Input
                        value={formData.banking.bankName}
                        onChange={(e) => updateFormData('banking.bankName', e.target.value)}
                        placeholder="State Bank of India"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Number
                      </label>
                      <Input
                        value={formData.banking.accountNumber}
                        onChange={(e) => updateFormData('banking.accountNumber', e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IFSC Code
                      </label>
                      <Input
                        value={formData.banking.ifscCode}
                        onChange={(e) => updateFormData('banking.ifscCode', e.target.value.toUpperCase())}
                        placeholder="SBIN0001234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Branch
                      </label>
                      <Input
                        value={formData.banking.branch}
                        onChange={(e) => updateFormData('banking.branch', e.target.value)}
                        placeholder="Main Branch"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
