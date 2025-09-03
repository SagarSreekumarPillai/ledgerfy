'use client'

import { useState } from 'react'
import { 
  Share2, 
  Users, 
  Eye, 
  Download, 
  MoreHorizontal, 
  Search,
  Filter,
  Calendar,
  FileText,
  User,
  Lock,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface SharedDocument {
  id: string
  title: string
  type: string
  size: string
  sharedBy: {
    name: string
    email: string
    avatar?: string
  }
  sharedWith: Array<{
    name: string
    email: string
    avatar?: string
    permission: 'view' | 'edit' | 'admin'
    status: 'pending' | 'accepted' | 'declined'
  }>
  sharedAt: string
  expiresAt?: string
  status: 'active' | 'expired' | 'revoked'
  accessLevel: 'public' | 'restricted' | 'private'
}

const mockSharedDocuments: SharedDocument[] = [
  {
    id: '1',
    title: 'Q4 Financial Report 2024',
    type: 'PDF',
    size: '2.4 MB',
    sharedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.j@ledgerfy.com',
      avatar: '/avatars/sarah.jpg'
    },
    sharedWith: [
      {
        name: 'Mike Chen',
        email: 'mike.chen@client.com',
        permission: 'view',
        status: 'accepted'
      },
      {
        name: 'Lisa Rodriguez',
        email: 'lisa.r@partner.com',
        permission: 'edit',
        status: 'accepted'
      }
    ],
    sharedAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    status: 'active',
    accessLevel: 'restricted'
  },
  {
    id: '2',
    title: 'Tax Compliance Checklist',
    type: 'DOCX',
    size: '856 KB',
    sharedBy: {
      name: 'David Kim',
      email: 'david.kim@ledgerfy.com'
    },
    sharedWith: [
      {
        name: 'Client Portal',
        email: 'portal@client.com',
        permission: 'view',
        status: 'accepted'
      }
    ],
    sharedAt: '2024-01-14T14:20:00Z',
    status: 'active',
    accessLevel: 'public'
  },
  {
    id: '3',
    title: 'Audit Trail Documentation',
    type: 'XLSX',
    size: '1.2 MB',
    sharedBy: {
      name: 'Emily Watson',
      email: 'emily.w@ledgerfy.com'
    },
    sharedWith: [
      {
        name: 'Regulatory Team',
        email: 'regulatory@authority.gov',
        permission: 'view',
        status: 'pending'
      }
    ],
    sharedAt: '2024-01-13T09:15:00Z',
    status: 'active',
    accessLevel: 'restricted'
  }
]

export default function SharedDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('shared-with-me')

  const filteredDocuments = mockSharedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.sharedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'edit': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'view': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'revoked': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public': return <Globe className="h-4 w-4 text-blue-600" />
      case 'restricted': return <Users className="h-4 w-4 text-yellow-600" />
      case 'private': return <Lock className="h-4 w-4 text-red-600" />
      default: return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and access documents shared with you and by you
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Document
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          <TabsTrigger value="shared-by-me">Shared by Me</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
        </TabsList>

        {/* Shared with Me Tab */}
        <TabsContent value="shared-with-me" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Grid */}
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <div className="flex items-center gap-1">
                            {getAccessLevelIcon(doc.accessLevel)}
                            <span className="capitalize">{doc.accessLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Shared By */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={doc.sharedBy.avatar} />
                        <AvatarFallback>{doc.sharedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Shared by {doc.sharedBy.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(doc.sharedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Shared With */}
                    <div>
                      <p className="text-sm font-medium mb-2">Shared with:</p>
                      <div className="space-y-2">
                        {doc.sharedWith.map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPermissionColor(user.permission)}>
                                {user.permission}
                              </Badge>
                              <Badge variant={user.status === 'accepted' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {doc.expiresAt && (
                        <div className="ml-auto text-xs text-gray-600 dark:text-gray-400">
                          Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shared by Me Tab */}
        <TabsContent value="shared-by-me" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No documents shared yet</h3>
            <p className="text-sm">Documents you share will appear here</p>
          </div>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="pending" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No pending requests</h3>
            <p className="text-sm">Document sharing requests will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
