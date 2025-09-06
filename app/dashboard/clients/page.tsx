'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock data for clients
const clients = [
  {
    id: 1,
    name: 'ABC Company Ltd',
    type: 'Private Limited',
    gstin: '27AABCA1234Z1Z5',
    pan: 'AABCA1234Z',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@abc.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    status: 'active',
    complianceCount: 12,
    overdueCount: 1,
    lastActivity: '2025-01-15',
    assignedTo: 'John Doe'
  },
  {
    id: 2,
    name: 'XYZ Corporation',
    type: 'Public Limited',
    gstin: '29BXYZC5678Y2Y6',
    pan: 'BXYZC5678Y',
    contactPerson: 'Priya Sharma',
    email: 'priya@xyz.com',
    phone: '+91 87654 32109',
    address: 'Delhi, NCR',
    status: 'active',
    complianceCount: 8,
    overdueCount: 0,
    lastActivity: '2025-01-14',
    assignedTo: 'Jane Smith'
  },
  {
    id: 3,
    name: 'DEF Industries',
    type: 'Partnership',
    gstin: '32CDEFG9012X3X7',
    pan: 'CDEFG9012X',
    contactPerson: 'Amit Patel',
    email: 'amit@def.com',
    phone: '+91 76543 21098',
    address: 'Bangalore, Karnataka',
    status: 'active',
    complianceCount: 15,
    overdueCount: 2,
    lastActivity: '2025-01-13',
    assignedTo: 'Mike Johnson'
  },
  {
    id: 4,
    name: 'GHI Solutions',
    type: 'LLP',
    gstin: '24FGHIJ3456W4W8',
    pan: 'FGHIJ3456W',
    contactPerson: 'Neha Singh',
    email: 'neha@ghi.com',
    phone: '+91 65432 10987',
    address: 'Chennai, Tamil Nadu',
    status: 'inactive',
    complianceCount: 6,
    overdueCount: 0,
    lastActivity: '2024-12-20',
    assignedTo: 'Sarah Wilson'
  },
  {
    id: 5,
    name: 'JKL Enterprises',
    type: 'Proprietorship',
    gstin: '07KJKLM7890V5V9',
    pan: 'KJKLM7890V',
    contactPerson: 'Vikram Mehta',
    email: 'vikram@jkl.com',
    phone: '+91 54321 09876',
    address: 'Hyderabad, Telangana',
    status: 'active',
    complianceCount: 10,
    overdueCount: 1,
    lastActivity: '2025-01-12',
    assignedTo: 'David Brown'
  }
]

const clientTypes = [
  'All Types',
  'Private Limited',
  'Public Limited',
  'Partnership',
  'LLP',
  'Proprietorship'
]

const statusOptions = [
  'All Status',
  'Active',
  'Inactive',
  'Suspended'
]

export default function ClientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.pan.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'All Types' || client.type === selectedType
    const matchesStatus = selectedStatus === 'All Status' || 
                         (selectedStatus === 'Active' && client.status === 'active') ||
                         (selectedStatus === 'Inactive' && client.status === 'inactive') ||
                         (selectedStatus === 'Suspended' && client.status === 'suspended')
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'inactive':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
      case 'suspended':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getOverdueColor = (count: number) => {
    if (count === 0) return 'text-green-600 bg-green-50 dark:bg-green-900/20'
    if (count <= 2) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-50 dark:bg-red-900/20'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your client relationships and information</p>
        </div>
        <Button className="flex items-center space-x-2" onClick={() => router.push('/dashboard/clients/new')}>
          <UserPlus className="h-4 w-4" />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Clients</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Compliance</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">51</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients, GSTIN, PAN, or contact person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Users className="h-4 w-4" />
              <span className="ml-2">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FileText className="h-4 w-4" />
              <span className="ml-2">List</span>
            </Button>
          </div>

          {/* Filters toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {clientTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clients grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="relative">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {client.type}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    {client.contactPerson}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {client.address}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">GSTIN:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.gstin}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">PAN:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{client.pan}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(client.status)
                    )}>
                      {client.status}
                    </span>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getOverdueColor(client.overdueCount)
                    )}>
                      {client.overdueCount} overdue
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Compliance Items:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{client.complianceCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Assigned to:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{client.assignedTo}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    GSTIN/PAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {client.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.contactPerson}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.gstin}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {client.pan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(client.status)
                      )}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {client.complianceCount} items
                      </div>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getOverdueColor(client.overdueCount)
                      )}>
                        {client.overdueCount} overdue
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {client.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}
