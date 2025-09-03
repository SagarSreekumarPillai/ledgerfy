'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Copy, 
  Edit, 
  Trash2,
  Star,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  Grid3X3,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  size: string
  createdBy: {
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
  updatedAt: string
  downloads: number
  rating: number
  tags: string[]
  isFavorite: boolean
  status: 'active' | 'draft' | 'archived'
  version: string
}

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Financial Statement Template',
    description: 'Standard template for quarterly and annual financial statements with automated calculations and formatting.',
    category: 'Financial',
    type: 'XLSX',
    size: '1.2 MB',
    createdBy: {
      name: 'Sarah Johnson',
      email: 'sarah.j@ledgerfy.com',
      avatar: '/avatars/sarah.jpg'
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    downloads: 156,
    rating: 4.8,
    tags: ['financial', 'statement', 'quarterly', 'annual'],
    isFavorite: true,
    status: 'active',
    version: '2.1.0'
  },
  {
    id: '2',
    name: 'Tax Return Checklist',
    description: 'Comprehensive checklist for individual and corporate tax returns with regulatory compliance items.',
    category: 'Tax',
    type: 'DOCX',
    size: '856 KB',
    createdBy: {
      name: 'David Kim',
      email: 'david.kim@ledgerfy.com'
    },
    createdAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    downloads: 89,
    rating: 4.6,
    tags: ['tax', 'checklist', 'compliance', 'individual', 'corporate'],
    isFavorite: false,
    status: 'active',
    version: '1.3.2'
  },
  {
    id: '3',
    name: 'Audit Report Template',
    description: 'Professional audit report template following GAAP standards with customizable sections.',
    category: 'Audit',
    type: 'DOCX',
    size: '2.1 MB',
    createdBy: {
      name: 'Emily Watson',
      email: 'emily.w@ledgerfy.com'
    },
    createdAt: '2024-01-05T13:15:00Z',
    updatedAt: '2024-01-10T10:20:00Z',
    downloads: 234,
    rating: 4.9,
    tags: ['audit', 'report', 'GAAP', 'professional'],
    isFavorite: true,
    status: 'active',
    version: '3.0.1'
  },
  {
    id: '4',
    name: 'Invoice Template',
    description: 'Professional invoice template with company branding and automated calculations.',
    category: 'Billing',
    type: 'DOCX',
    size: '567 KB',
    createdBy: {
      name: 'Mike Chen',
      email: 'mike.chen@ledgerfy.com'
    },
    createdAt: '2024-01-03T15:30:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
    downloads: 312,
    rating: 4.7,
    tags: ['invoice', 'billing', 'professional', 'branding'],
    isFavorite: false,
    status: 'active',
    version: '1.5.0'
  },
  {
    id: '5',
    name: 'Budget Planning Worksheet',
    description: 'Comprehensive budget planning worksheet with forecasting tools and variance analysis.',
    category: 'Budgeting',
    type: 'XLSX',
    size: '1.8 MB',
    createdBy: {
      name: 'Lisa Rodriguez',
      email: 'lisa.r@ledgerfy.com'
    },
    createdAt: '2024-01-01T08:45:00Z',
    updatedAt: '2024-01-06T12:00:00Z',
    downloads: 178,
    rating: 4.5,
    tags: ['budget', 'planning', 'forecasting', 'variance'],
    isFavorite: false,
    status: 'active',
    version: '2.0.0'
  }
]

const categories = ['All', 'Financial', 'Tax', 'Audit', 'Billing', 'Budgeting', 'Compliance', 'Legal']
const types = ['All', 'DOCX', 'XLSX', 'PDF', 'PPTX']

export default function DocumentTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('all')

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || template.category === categoryFilter
    const matchesType = typeFilter === 'All' || template.type === typeFilter
    
    return matchesSearch && matchesCategory && matchesType
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Financial': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Tax': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Audit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Billing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Budgeting': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Compliance': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Legal': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const renderTemplateCard = (template: DocumentTemplate) => (
    <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {template.name}
                </CardTitle>
                {template.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <CardDescription className="mt-2 line-clamp-2">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(template.status)}>
              {template.status}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>{template.type}</span>
            <span>{template.size}</span>
            <span>v{template.version}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span>{template.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Creator and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={template.createdBy.avatar} />
              <AvatarFallback>{template.createdBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {template.createdBy.name}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {template.downloads} downloads
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
            <Copy className="h-4 w-4" />
            Use Template
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderTemplateList = (template: DocumentTemplate) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                {template.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {template.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{template.type}</span>
                <span>{template.size}</span>
                <span>v{template.version}</span>
                <span>{template.downloads} downloads</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getCategoryColor(template.category)}>
              {template.category}
            </Badge>
            <Badge className={getStatusColor(template.status)}>
              {template.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and use professional document templates for your business needs
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
        </TabsList>

        {/* All Templates Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Templates Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map(renderTemplateList)}
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No templates found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        {/* Other Tabs */}
        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No favorite templates</h3>
            <p className="text-sm">Star templates to add them to your favorites</p>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No recently used templates</h3>
            <p className="text-sm">Templates you use will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="my-templates" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No custom templates</h3>
            <p className="text-sm">Create your first template to get started</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
