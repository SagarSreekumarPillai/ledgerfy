'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'
import { PageHeader, PageHeaderActions } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ReportData {
  id: string
  name: string
  type: 'balance_sheet' | 'profit_loss' | 'cash_flow' | 'trial_balance'
  period: string
  generatedAt: Date
  status: 'ready' | 'generating' | 'error'
  fileSize?: string
}

interface FinancialSummary {
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  cashFlow: number
}

export default function LedgerReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: '1',
          name: 'Balance Sheet - January 2024',
          type: 'balance_sheet',
          period: '2024-01',
          generatedAt: new Date('2024-01-31'),
          status: 'ready',
          fileSize: '2.3 MB'
        },
        {
          id: '2',
          name: 'Profit & Loss - January 2024',
          type: 'profit_loss',
          period: '2024-01',
          generatedAt: new Date('2024-01-31'),
          status: 'ready',
          fileSize: '1.8 MB'
        },
        {
          id: '3',
          name: 'Trial Balance - January 2024',
          type: 'trial_balance',
          period: '2024-01',
          generatedAt: new Date('2024-01-31'),
          status: 'ready',
          fileSize: '1.2 MB'
        },
        {
          id: '4',
          name: 'Cash Flow Statement - Q4 2023',
          type: 'cash_flow',
          period: '2023-Q4',
          generatedAt: new Date('2023-12-31'),
          status: 'ready',
          fileSize: '1.5 MB'
        },
        {
          id: '5',
          name: 'Balance Sheet - December 2023',
          type: 'balance_sheet',
          period: '2023-12',
          generatedAt: new Date('2023-12-31'),
          status: 'generating'
        }
      ])

      setSummary({
        totalAssets: 2500000,
        totalLiabilities: 800000,
        totalEquity: 1700000,
        totalRevenue: 1200000,
        totalExpenses: 900000,
        netProfit: 300000,
        cashFlow: 150000
      })

      setLoading(false)
    }, 1000)
  }, [])

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'balance_sheet':
        return <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case 'profit_loss':
        return <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
      case 'cash_flow':
        return <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      case 'trial_balance':
        return <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'balance_sheet':
        return 'Balance Sheet'
      case 'profit_loss':
        return 'Profit & Loss'
      case 'cash_flow':
        return 'Cash Flow'
      case 'trial_balance':
        return 'Trial Balance'
      default:
        return 'Report'
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      generating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status as keyof typeof colors] || colors.ready
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const generateReport = (type: string) => {
    // Mock report generation
    console.log(`Generating ${type} report...`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ledger Reports"
          description="Generate and view financial reports"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
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
        title="Ledger Reports"
        description="Generate and view financial reports"
      >
        <PageHeaderActions>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </PageHeaderActions>
      </PageHeader>

      {/* Financial Summary */}
      {summary && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summary.totalAssets)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Liabilities</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summary.totalLiabilities)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summary.netProfit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(summary.cashFlow)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Generate financial reports for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => generateReport('balance_sheet')}
            >
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Balance Sheet</span>
              <span className="text-xs text-gray-500">Assets, Liabilities & Equity</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => generateReport('profit_loss')}
            >
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium">Profit & Loss</span>
              <span className="text-xs text-gray-500">Revenue & Expenses</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => generateReport('cash_flow')}
            >
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium">Cash Flow</span>
              <span className="text-xs text-gray-500">Cash movements</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start space-y-2"
              onClick={() => generateReport('trial_balance')}
            >
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="font-medium">Trial Balance</span>
              <span className="text-xs text-gray-500">Account balances</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            View and download previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getReportTypeIcon(report.type)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Period: {report.period}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Generated: {formatDate(report.generatedAt)}
                      </span>
                      {report.fileSize && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Size: {report.fileSize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getStatusColor(report.status))}>
                    {report.status}
                  </Badge>
                  {report.status === 'ready' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {report.status === 'generating' && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-xs text-gray-500">Generating...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports generated</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Generate your first financial report using the options above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

