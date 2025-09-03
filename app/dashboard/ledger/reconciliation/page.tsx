'use client'

import { useState } from 'react'
import { 
  Calculator, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Upload, 
  Search,
  Filter,
  Eye,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Banknote,
  Receipt,
  CreditCard,
  Database,
  Settings,
  History,
  Calendar,
  ArrowUpDown,
  X,
  Plus
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface ReconciliationItem {
  id: string
  accountName: string
  accountType: 'bank' | 'receivable' | 'payable' | 'inventory' | 'fixed-asset'
  bookBalance: number
  bankBalance: number
  difference: number
  status: 'reconciled' | 'pending' | 'unreconciled' | 'error'
  lastReconciled?: Date
  assignedTo: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface BankTransaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'credit' | 'debit'
  reference: string
  status: 'matched' | 'unmatched' | 'reconciled'
  category: string
}

interface VarianceAnalysis {
  account: string
  expectedAmount: number
  actualAmount: number
  variance: number
  variancePercentage: number
  reason: string
  impact: 'low' | 'medium' | 'high'
}

interface ReconciliationReport {
  id: string
  name: string
  period: string
  totalAccounts: number
  reconciledAccounts: number
  unreconciledAccounts: number
  totalVariance: number
  status: 'in-progress' | 'completed' | 'reviewed'
  createdBy: string
  createdAt: Date
}

export default function LedgerReconciliationPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedAccountType, setSelectedAccountType] = useState('all')
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null)

  // Mock data
  const reconciliationItems: ReconciliationItem[] = [
    {
      id: '1',
      accountName: 'HDFC Bank Current Account',
      accountType: 'bank',
      bookBalance: 1250000,
      bankBalance: 1248750,
      difference: 1250,
      status: 'pending',
      assignedTo: 'CA Team',
      priority: 'high'
    },
    {
      id: '2',
      accountName: 'Accounts Receivable',
      accountType: 'receivable',
      bookBalance: 450000,
      bankBalance: 450000,
      difference: 0,
      status: 'reconciled',
      lastReconciled: new Date('2024-01-15'),
      assignedTo: 'CA Team',
      priority: 'low'
    },
    {
      id: '3',
      accountName: 'Accounts Payable',
      accountType: 'payable',
      bookBalance: 320000,
      bankBalance: 318500,
      difference: 1500,
      status: 'unreconciled',
      assignedTo: 'CA Team',
      priority: 'medium'
    }
  ]

  const bankTransactions: BankTransaction[] = [
    {
      id: '1',
      date: new Date('2024-01-20'),
      description: 'Client Payment - ABC Corp',
      amount: 50000,
      type: 'credit',
      reference: 'INV-001',
      status: 'matched',
      category: 'Revenue'
    },
    {
      id: '2',
      date: new Date('2024-01-19'),
      description: 'Office Supplies',
      amount: 2500,
      type: 'debit',
      reference: 'PO-002',
      status: 'unmatched',
      category: 'Expenses'
    },
    {
      id: '3',
      date: new Date('2024-01-18'),
      description: 'Bank Charges',
      amount: 150,
      type: 'debit',
      reference: 'BC-001',
      status: 'reconciled',
      category: 'Bank Charges'
    }
  ]

  const varianceAnalysis: VarianceAnalysis[] = [
    {
      account: 'Cash & Bank',
      expectedAmount: 1250000,
      actualAmount: 1248750,
      variance: -1250,
      variancePercentage: -0.1,
      reason: 'Unreconciled bank charges',
      impact: 'low'
    },
    {
      account: 'Accounts Receivable',
      expectedAmount: 450000,
      actualAmount: 450000,
      variance: 0,
      variancePercentage: 0,
      reason: 'Fully reconciled',
      impact: 'low'
    },
    {
      account: 'Accounts Payable',
      expectedAmount: 320000,
      actualAmount: 318500,
      variance: -1500,
      variancePercentage: -0.47,
      reason: 'Pending vendor invoices',
      impact: 'medium'
    }
  ]

  const reconciliationReports: ReconciliationReport[] = [
    {
      id: '1',
      name: 'January 2024 Reconciliation',
      period: 'Jan 2024',
      totalAccounts: 15,
      reconciledAccounts: 12,
      unreconciledAccounts: 3,
      totalVariance: 2750,
      status: 'in-progress',
      createdBy: 'CA Team',
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'December 2023 Reconciliation',
      period: 'Dec 2023',
      totalAccounts: 15,
      reconciledAccounts: 15,
      unreconciledAccounts: 0,
      totalVariance: 0,
      status: 'reviewed',
      createdBy: 'CA Team',
      createdAt: new Date('2023-12-01')
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reconciled':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'unreconciled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'matched':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'unmatched':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'reconciled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getReconciliationProgress = () => {
    const total = reconciliationItems.length
    const reconciled = reconciliationItems.filter(item => item.status === 'reconciled').length
    return (reconciled / total) * 100
  }

  const getTotalVariance = () => {
    return reconciliationItems.reduce((sum, item) => sum + Math.abs(item.difference), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Account Reconciliation"
        description="Reconcile bank statements, credit cards, and other accounts"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Bank Statement
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Start Reconciliation
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{reconciliationItems.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reconciled</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reconciliationItems.filter(item => item.status === 'reconciled').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Variance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(getTotalVariance())}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(getReconciliationProgress())}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reconciliation Progress
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {reconciliationItems.filter(item => item.status === 'reconciled').length} of {reconciliationItems.length} accounts
                </span>
              </div>
              <Progress value={getReconciliationProgress()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reconciliation Activity</CardTitle>
                  <CardDescription>Latest updates and actions taken</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reconciliationItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            item.status === 'reconciled' ? 'bg-green-100 text-green-600' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {item.status === 'reconciled' ? <CheckCircle className="h-4 w-4" /> :
                             item.status === 'pending' ? <Clock className="h-4 w-4" /> :
                             <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.accountName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Variance: {formatCurrency(item.difference)}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common reconciliation tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Upload className="h-6 w-6" />
                      <span>Import Statement</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Calculator className="h-6 w-6" />
                      <span>Auto Match</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>Generate Report</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <History className="h-6 w-6" />
                      <span>View History</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Account Reconciliation</CardTitle>
                    <CardDescription>Manage and reconcile all ledger accounts</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search accounts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="reconciled">Reconciled</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="unreconciled">Unreconciled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="receivable">Receivable</SelectItem>
                        <SelectItem value="payable">Payable</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reconciliationItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Database className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.accountName}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.accountType} • Assigned to {item.assignedTo}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{item.accountType}</Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Book Balance</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.bookBalance)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Bank Balance</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.bankBalance)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Difference</p>
                          <p className={`text-lg font-bold ${
                            item.difference === 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(item.difference)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Reconcile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Transactions</CardTitle>
                <CardDescription>Review and match bank transactions with ledger entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.date.toLocaleDateString()} • Ref: {transaction.reference}
                          </p>
                          <Badge variant="outline" className="mt-1">{transaction.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Match
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variance Analysis Tab */}
          <TabsContent value="variance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Variance Analysis</CardTitle>
                <CardDescription>Analyze differences between expected and actual amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {varianceAnalysis.map((variance) => (
                    <div key={variance.account} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          variance.variance === 0 ? 'bg-green-100 text-green-600' :
                          Math.abs(variance.variancePercentage) < 1 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{variance.account}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{variance.reason}</p>
                          <Badge className={`${getPriorityColor(variance.impact)} mt-1`}>
                            {variance.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(variance.expectedAmount)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(variance.actualAmount)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Variance</p>
                          <p className={`text-lg font-bold ${
                            variance.variance === 0 ? 'text-green-600' :
                            variance.variance > 0 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {formatCurrency(variance.variance)} ({variance.variancePercentage.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Reports</CardTitle>
                <CardDescription>View and generate reconciliation reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reconciliationReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Period: {report.period} • Created by {report.createdBy}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{report.status}</Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {report.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Accounts</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {report.reconciledAccounts}/{report.totalAccounts}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Variance</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(report.totalVariance)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
