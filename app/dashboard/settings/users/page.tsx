'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RequirePermission } from '@/components/auth/RequirePermission'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  roleId: {
    _id: string
    name: string
    description: string
  }
  isActive: boolean
  isEmailVerified: boolean
  mfaEnabled: boolean
  lastLogin?: string
  createdAt: string
}

interface Role {
  _id: string
  name: string
  description: string
}

export default function UsersPage() {
  const { hasPermission } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          _id: '1',
          email: 'admin@testfirm.com',
          firstName: 'Admin',
          lastName: 'User',
          roleId: { _id: '1', name: 'admin', description: 'Full access to all features' },
          isActive: true,
          isEmailVerified: true,
          mfaEnabled: true,
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          email: 'john.doe@defaultfirm.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+91-9876543210',
          roleId: { _id: '2', name: 'partner', description: 'Senior partner with broad access' },
          isActive: true,
          isEmailVerified: true,
          mfaEnabled: false,
          lastLogin: '2024-01-14T15:45:00Z',
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          _id: '3',
          email: 'jane.smith@defaultfirm.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+91-9876543211',
          roleId: { _id: '3', name: 'manager', description: 'Team manager with project oversight' },
          isActive: true,
          isEmailVerified: true,
          mfaEnabled: true,
          lastLogin: '2024-01-15T09:15:00Z',
          createdAt: '2024-01-03T00:00:00Z'
        },
        {
          _id: '4',
          email: 'mike.wilson@defaultfirm.com',
          firstName: 'Mike',
          lastName: 'Wilson',
          phone: '+91-9876543212',
          roleId: { _id: '4', name: 'senior', description: 'Senior staff member' },
          isActive: true,
          isEmailVerified: false,
          mfaEnabled: false,
          lastLogin: '2024-01-13T14:20:00Z',
          createdAt: '2024-01-04T00:00:00Z'
        },
        {
          _id: '5',
          email: 'sarah.jones@defaultfirm.com',
          firstName: 'Sarah',
          lastName: 'Jones',
          phone: '+91-9876543213',
          roleId: { _id: '5', name: 'associate', description: 'Junior staff member' },
          isActive: false,
          isEmailVerified: true,
          mfaEnabled: false,
          lastLogin: '2024-01-10T11:30:00Z',
          createdAt: '2024-01-05T00:00:00Z'
        }
      ])

      setRoles([
        { _id: '1', name: 'admin', description: 'Full access to all features' },
        { _id: '2', name: 'partner', description: 'Senior partner with broad access' },
        { _id: '3', name: 'manager', description: 'Team manager with project oversight' },
        { _id: '4', name: 'senior', description: 'Senior staff member' },
        { _id: '5', name: 'associate', description: 'Junior staff member' },
        { _id: '6', name: 'client', description: 'Client with limited access' }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !selectedRole || user.roleId._id === selectedRole
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'active' && user.isActive) ||
                         (selectedStatus === 'inactive' && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleColor = (roleName: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      partner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      senior: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      associate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      client: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[roleName as keyof typeof colors] || colors.associate
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Users & Roles"
          description="Manage team members, roles, and permissions"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
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
        title="Users & Roles"
        description="Manage team members, roles, and permissions"
      >
        <PageHeaderActions>
          <RequirePermission permission="users:invite">
            <Button onClick={() => router.push('/dashboard/settings/users/new')}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </RequirePermission>
        </PageHeaderActions>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </option>
                ))}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedRole('')
                  setSelectedStatus('')
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

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({filteredUsers.length})</span>
            <RequirePermission permission="users:create">
              <Button size="sm" onClick={() => router.push('/dashboard/settings/users/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </RequirePermission>
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={user.firstName} />
                          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={cn("text-xs", getRoleColor(user.roleId.name))}>
                        {user.roleId.name}
                      </Badge>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.roleId.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {user.isEmailVerified && (
                            <Badge variant="outline" className="text-xs">
                              Email Verified
                            </Badge>
                          )}
                          {user.mfaEnabled && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              MFA
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <RequirePermission permission="users:update">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <RequirePermission permission="users:delete">
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </RequirePermission>
                        </div>
                      </RequirePermission>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
