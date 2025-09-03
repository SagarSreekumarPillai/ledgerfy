'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { 
  Command,
  Search,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Home,
  Briefcase,
  Database,
  TrendingUp,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  name: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  keywords: string[]
  requiredPermission?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  userPermissions?: string[]
}

export function CommandPalette({ isOpen, onClose, userPermissions = [] }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  // Register hotkey
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault()
    if (isOpen) {
      onClose()
    } else {
      // Open command palette
      onClose() // This will be handled by parent component
    }
  })

  // Close on escape
  useHotkeys('escape', () => {
    if (isOpen) {
      onClose()
    }
  }, { enableOnFormTags: true })

  // Navigation with arrow keys
  useHotkeys('up, down', (e) => {
    if (!isOpen) return
    
    e.preventDefault()
    if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(0, prev - 1))
    } else {
      setSelectedIndex(prev => Math.min(filteredCommands.length - 1, prev + 1))
    }
  }, { enableOnFormTags: true })

  // Execute command on enter
  useHotkeys('enter', (e) => {
    if (!isOpen) return
    
    e.preventDefault()
    const selectedCommand = filteredCommands[selectedIndex]
    if (selectedCommand) {
      executeCommand(selectedCommand)
    }
  }, { enableOnFormTags: true })

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    if (userPermissions.includes('*')) return true
    return userPermissions.includes(permission)
  }

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Go to main dashboard',
      href: '/dashboard',
      icon: Home,
      category: 'Navigation',
      keywords: ['home', 'main', 'overview', 'dashboard']
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Manage documents and files',
      href: '/dashboard/documents',
      icon: FileText,
      category: 'Navigation',
      keywords: ['files', 'docs', 'upload', 'storage'],
      requiredPermission: 'documents:read'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'View compliance calendar and deadlines',
      href: '/dashboard/compliance',
      icon: Calendar,
      category: 'Navigation',
      keywords: ['deadlines', 'calendar', 'requirements', 'compliance'],
      requiredPermission: 'compliance:read'
    },
    {
      id: 'projects',
      name: 'Projects',
      description: 'Manage projects and tasks',
      href: '/dashboard/projects',
      icon: Briefcase,
      category: 'Navigation',
      keywords: ['tasks', 'kanban', 'timeline', 'projects'],
      requiredPermission: 'projects:read'
    },
    {
      id: 'clients',
      name: 'Clients',
      description: 'Manage client relationships',
      href: '/dashboard/clients',
      icon: Users,
      category: 'Navigation',
      keywords: ['customers', 'relationships', 'portal', 'clients'],
      requiredPermission: 'clients:read'
    },
    {
      id: 'ledger',
      name: 'Ledger',
      description: 'View financial records and ledger',
      href: '/dashboard/ledger',
      icon: Database,
      category: 'Navigation',
      keywords: ['financial', 'accounts', 'tally', 'ledger'],
      requiredPermission: 'ledger:read'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'View business intelligence and reports',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      category: 'Navigation',
      keywords: ['reports', 'charts', 'bi', 'analytics'],
      requiredPermission: 'analytics:read'
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Configure system settings',
      href: '/dashboard/settings',
      icon: Settings,
      category: 'Navigation',
      keywords: ['configure', 'preferences', 'system', 'settings'],
      requiredPermission: 'firm:read'
    }
  ]

  const filteredCommands = commands.filter(command => {
    if (!hasPermission(command.requiredPermission)) return false
    
    const matchesQuery = query === '' || 
      command.name.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    
    return matchesQuery
  })

  const executeCommand = (command: CommandItem) => {
    router.push(command.href)
    onClose()
    setQuery('')
    setSelectedIndex(0)
  }

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Command palette */}
      <div className="flex min-h-full items-start justify-center p-4 pt-[20vh]">
        <div className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all">
          {/* Header */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <Command className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
            <Input
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                      selectedIndex === index && "bg-gray-50 dark:bg-gray-800"
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <command.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {command.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {command.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {command.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>⌘K to toggle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
