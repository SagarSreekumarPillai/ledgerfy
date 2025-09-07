'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
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
  List,
  CheckCircle,
  AlertTriangle,
  Shield,
  Building2,
  Scale,
  FileCheck,
  ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ComplianceTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  size: string
  regulatoryBody: string
  jurisdiction: string
  lastUpdated: string
  createdBy: {
    name: string
    email: string
    avatar?: string
  }
  downloads: number
  rating: number
  tags: string[]
  isFavorite: boolean
  status: 'active' | 'draft' | 'archived'
  version: string
  complianceLevel: 'basic' | 'intermediate' | 'advanced'
  estimatedTime: string
  requiredFields: number
  optionalFields: number
}

const mockComplianceTemplates: ComplianceTemplate[] = [
  {
    id: '1',
    name: 'SOX Compliance Checklist',
    description: 'Comprehensive Sarbanes-Oxley Act compliance checklist for public companies with internal control requirements.',
    category: 'Financial Reporting',
    type: 'XLSX',
    size: '2.1 MB',
    regulatoryBody: 'SEC',
    jurisdiction: 'United States',
    lastUpdated: '2024-01-15T10:00:00Z',
    createdBy: {
      name: 'Sarah Johnson',
      email: 'sarah.j@ledgerfy.com',
      avatar: '/avatars/sarah.jpg'
    },
    downloads: 234,
    rating: 4.9,
    tags: ['SOX', 'financial', 'reporting', 'internal controls', 'SEC'],
    isFavorite: true,
    status: 'active',
    version: '3.2.1',
    complianceLevel: 'advanced',
    estimatedTime: '4-6 hours',
    requiredFields: 45,
    optionalFields: 12
  },
  {
    id: '2',
    name: 'GDPR Data Protection Assessment',
    description: 'General Data Protection Regulation compliance assessment template for data privacy and protection.',
    category: 'Data Privacy',
    type: 'DOCX',
    size: '1.8 MB',
    regulatoryBody: 'EU Commission',
    jurisdiction: 'European Union',
    lastUpdated: '2024-01-12T14:30:00Z',
    createdBy: {
      name: 'David Kim',
      email: 'david.kim@ledgerfy.com'
    },
    downloads: 189,
    rating: 4.7,
    tags: ['GDPR', 'data privacy', 'protection', 'EU', 'compliance'],
    isFavorite: false,
    status: 'active',
    version: '2.1.0',
    complianceLevel: 'intermediate',
    estimatedTime: '3-4 hours',
    requiredFields: 32,
    optionalFields: 8
  },
  {
    id: '3',
    name: 'Tax Compliance Verification Form',
    description: 'Tax compliance verification template for businesses with multi-state operations and tax obligations.',
    category: 'Tax Compliance',
    type: 'PDF',
    size: '956 KB',
    regulatoryBody: 'IRS',
    jurisdiction: 'United States',
    lastUpdated: '2024-01-10T09:15:00Z',
    createdBy: {
      name: 'Emily Watson',
      email: 'emily.w@ledgerfy.com'
    },
    downloads: 156,
    rating: 4.6,
    tags: ['tax', 'compliance', 'IRS', 'multi-state', 'verification'],
    isFavorite: true,
    status: 'active',
    version: '1.8.3',
    complianceLevel: 'intermediate',
    estimatedTime: '2-3 hours',
    requiredFields: 28,
    optionalFields: 15
  },
  {
    id: '4',
    name: 'Anti-Money Laundering (AML) Framework',
    description: 'Anti-Money Laundering compliance framework template with risk assessment and monitoring procedures.',
    category: 'Financial Crime',
    type: 'DOCX',
    size: '3.2 MB',
    regulatoryBody: 'FinCEN',
    jurisdiction: 'United States',
    lastUpdated: '2024-01-08T16:45:00Z',
    createdBy: {
      name: 'Mike Chen',
      email: 'mike.chen@ledgerfy.com'
    },
    downloads: 98,
    rating: 4.8,
    tags: ['AML', 'financial crime', 'risk assessment', 'monitoring', 'FinCEN'],
    isFavorite: false,
    status: 'active',
    version: '2.5.0',
    complianceLevel: 'advanced',
    estimatedTime: '5-7 hours',
    requiredFields: 52,
    optionalFields: 18
  },
  {
    id: '5',
    name: 'Environmental Compliance Report',
    description: 'Environmental compliance reporting template for businesses with environmental impact assessments.',
    category: 'Environmental',
    type: 'XLSX',
    size: '1.5 MB',
    regulatoryBody: 'EPA',
    jurisdiction: 'United States',
    lastUpdated: '2024-01-05T11:20:00Z',
    createdBy: {
      name: 'Lisa Rodriguez',
      email: 'lisa.r@ledgerfy.com'
    },
    downloads: 67,
    rating: 4.4,
    tags: ['environmental', 'EPA', 'impact assessment', 'sustainability', 'reporting'],
    isFavorite: false,
    status: 'active',
    version: '1.6.2',
    complianceLevel: 'basic',
    estimatedTime: '2-3 hours',
    requiredFields: 24,
    optionalFields: 10
  }
]

const categories = ['All', 'Financial Reporting', 'Data Privacy', 'Tax Compliance', 'Financial Crime', 'Environmental', 'Labor', 'Health & Safety']
const complianceLevels = ['All', 'basic', 'intermediate', 'advanced']
const jurisdictions = ['All', 'United States', 'European Union', 'United Kingdom', 'Canada', 'Australia', 'Global']

export default function ComplianceTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [jurisdictionFilter, setJurisdictionFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('all')

  // Handler functions for compliance template actions
  const handleViewTemplate = (templateId: string) => {
    console.log('Viewing compliance template:', templateId)
  }

  const handleEditTemplate = (templateId: string) => {
    console.log('Editing compliance template:', templateId)
  }

  const handleDuplicateTemplate = (templateId: string) => {
    console.log('Duplicating compliance template:', templateId)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this compliance template?')) {
      console.log('Deleting compliance template:', templateId)
    }
  }

  const handleDownloadTemplate = (templateId: string) => {
    console.log('Downloading compliance template:', templateId)
  }

  const filteredTemplates = mockComplianceTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'All' || template.category === categoryFilter
    const matchesLevel = levelFilter === 'All' || template.complianceLevel === levelFilter
    const matchesJurisdiction = jurisdictionFilter === 'All' || template.jurisdiction === jurisdictionFilter
    
    return matchesSearch && matchesCategory && matchesLevel && matchesJurisdiction
  })

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Financial Reporting': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Data Privacy': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Tax Compliance': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Financial Crime': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Environmental': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Labor': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Health & Safety': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const renderTemplateCard = (template: ComplianceTemplate) => (
    <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewTemplate(template.id)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadTemplate(template.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Regulatory Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{template.regulatoryBody}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{template.jurisdiction}</span>
          </div>
        </div>

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

        {/* Compliance Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{template.requiredFields}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Required Fields</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{template.optionalFields}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Optional Fields</div>
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

  const renderTemplateList = (template: ComplianceTemplate) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
            <Badge className={getComplianceLevelColor(template.complianceLevel)}>
              {template.complianceLevel}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Regulatory compliance templates and frameworks for your business requirements
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
                  placeholder="Search compliance templates..."
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
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {complianceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictions.map(jurisdiction => (
                    <SelectItem key={jurisdiction} value={jurisdiction}>{jurisdiction}</SelectItem>
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
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No compliance templates found</h3>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        {/* Other Tabs */}
        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No favorite templates</h3>
            <p className="text-sm">Star compliance templates to add them to your favorites</p>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No recently used templates</h3>
            <p className="text-sm">Compliance templates you use will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="my-templates" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">No custom compliance templates</h3>
            <p className="text-sm">Create your first compliance template to get started</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
