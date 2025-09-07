'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react'

export default function SimpleDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  // Handler functions for quick actions
  const handleCreateInvoice = () => {
    // Navigate to invoice creation page or open modal
    router.push('/dashboard/documents/upload')
  }

  const handleAddClient = () => {
    router.push('/dashboard/clients/new')
  }

  const handleRecordPayment = () => {
    // Navigate to payment recording page
    router.push('/dashboard/ledger')
  }

  const handleScheduleMeeting = () => {
    // Navigate to calendar or meeting scheduling
    router.push('/dashboard/compliance/calendar')
  }

  const stats = [
    { title: 'Total Revenue', value: '$124,563.00', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Active Clients', value: '47', change: '+3.2%', icon: Users, color: 'text-blue-600' },
    { title: 'Documents', value: '156', change: '+8.1%', icon: FileText, color: 'text-purple-600' },
    { title: 'Growth Rate', value: '23.4%', change: '+2.1%', icon: TrendingUp, color: 'text-orange-600' }
  ]

  const recentActivities = [
    { action: 'Invoice #INV-001 created', time: '2 hours ago', type: 'invoice' },
    { action: 'Client "ABC Corp" added', time: '4 hours ago', type: 'client' },
    { action: 'Payment received from XYZ Ltd', time: '1 day ago', type: 'payment' },
    { action: 'Report generated for Q1', time: '2 days ago', type: 'report' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Ledgerfy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'clients', 'documents', 'reports', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>
                    Latest updates from your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleCreateInvoice}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleAddClient}>
                    <Users className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleRecordPayment}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleScheduleMeeting}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
