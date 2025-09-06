'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface Role {
  _id: string
  name: string
  description: string
  permissions: string[]
}

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  roleId: string
  isActive: boolean
  sendInvite: boolean
  temporaryPassword: string
  confirmPassword: string
  notes: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  roleId?: string
  temporaryPassword?: string
  confirmPassword?: string
}

export default function NewUserPage() {
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: '',
    isActive: true,
    sendInvite: true,
    temporaryPassword: '',
    confirmPassword: '',
    notes: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoles([
        {
          _id: 'role_admin',
          name: 'Administrator',
          description: 'Full access to all features and settings',
          permissions: ['*']
        },
        {
          _id: 'role_manager',
          name: 'Manager',
          description: 'Manage projects, clients, and team members',
          permissions: [
            'dashboard:read',
            'analytics:read',
            'ledger:read',
            'users:read',
            'clients:read', 'clients:write', 'clients:create',
            'projects:read', 'projects:write',
            'documents:read', 'documents:write', 'documents:upload', 'documents:share',
            'compliance:read', 'compliance:write',
            'reports:read', 'reports:write'
          ]
        },
        {
          _id: 'role_accountant',
          name: 'Accountant',
          description: 'Handle accounting tasks and client work',
          permissions: [
            'dashboard:read',
            'analytics:read',
            'ledger:read', 'ledger:write',
            'clients:read',
            'projects:read', 'projects:write',
            'documents:read', 'documents:write',
            'compliance:read',
            'reports:read'
          ]
        },
        {
          _id: 'role_senior',
          name: 'Senior Staff',
          description: 'Senior level staff with expanded permissions',
          permissions: [
            'dashboard:read',
            'analytics:read',
            'ledger:read',
            'clients:read', 'clients:write',
            'projects:read', 'projects:write',
            'documents:read', 'documents:write',
            'compliance:read',
            'reports:read'
          ]
        },
        {
          _id: 'role_junior',
          name: 'Junior Staff',
          description: 'Entry level staff with basic permissions',
          permissions: [
            'dashboard:read',
            'clients:read',
            'projects:read',
            'documents:read',
            'compliance:read'
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Please select a role'
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Password validation (if not sending invite)
    if (!formData.sendInvite) {
      if (!formData.temporaryPassword) {
        newErrors.temporaryPassword = 'Temporary password is required when not sending invite'
      } else if (formData.temporaryPassword.length < 8) {
        newErrors.temporaryPassword = 'Password must be at least 8 characters long'
      }

      if (formData.temporaryPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
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
      
      // Success - redirect to users list
      router.push('/dashboard/settings/users')
    } catch (error) {
      console.error('Error creating user:', error)
      // Handle error (show toast, etc.)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const selectedRole = roles.find(role => role._id === formData.roleId)

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create New User"
          description="Add a new team member to your organization"
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
        title="Create New User"
        description="Add a new team member to your organization"
      >
        <PageHeaderActions>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/settings/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </PageHeaderActions>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the user's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={cn(errors.firstName && "border-red-500")}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={cn(errors.lastName && "border-red-500")}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn("pl-10", errors.email && "border-red-500")}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={cn("pl-10", errors.phone && "border-red-500")}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.roleId} onValueChange={(value) => handleInputChange('roleId', value)}>
                  <SelectTrigger className={cn(errors.roleId && "border-red-500")}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.roleId}</p>
                )}
                {selectedRole && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Role Permissions:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedRole.permissions.slice(0, 5).map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {permission}
                        </span>
                      ))}
                      {selectedRole.permissions.length > 5 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          +{selectedRole.permissions.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Configure account access and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Active Account</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User can log in and access the system
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sendInvite">Send Email Invitation</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Send invitation email with login instructions
                  </p>
                </div>
                <Switch
                  id="sendInvite"
                  checked={formData.sendInvite}
                  onCheckedChange={(checked) => handleInputChange('sendInvite', checked)}
                />
              </div>

              {!formData.sendInvite && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <Label htmlFor="temporaryPassword">Temporary Password *</Label>
                    <div className="relative">
                      <Input
                        id="temporaryPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.temporaryPassword}
                        onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                        className={cn("pr-10", errors.temporaryPassword && "border-red-500")}
                        placeholder="Enter temporary password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.temporaryPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.temporaryPassword}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum 8 characters. User will be required to change this on first login.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={cn("pr-10", errors.confirmPassword && "border-red-500")}
                        placeholder="Confirm temporary password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this user..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Internal notes - not visible to the user
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formData.sendInvite ? (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    An invitation email will be sent to {formData.email}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    User account will be created with temporary password
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings/users')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <RequirePermission permission="users:create">
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
                        Create User
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
