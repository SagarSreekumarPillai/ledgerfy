'use client';

// FILE: /components/audit/SystemLogsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Filter, Search, Eye, Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { RequirePermission } from '@/components/auth/RequirePermission';

interface AuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorUserId: {
    _id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isComplianceAction: boolean;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: any;
}

interface SystemLogsDashboardProps {
  className?: string;
}

const SystemLogsDashboard: React.FC<SystemLogsDashboardProps> = ({ className = '' }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [showComplianceOnly, setShowComplianceOnly] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockLogs: AuditLog[] = [
      {
        _id: '1',
        action: 'POST /api/documents',
        entityType: 'Document',
        entityId: 'doc_123',
        actorUserId: {
          _id: 'user_1',
          name: 'Ramesh Kumar',
          email: 'ramesh@firm.com'
        },
        timestamp: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        severity: 'medium',
        isComplianceAction: false,
        changes: [
          {
            field: 'title',
            oldValue: null,
            newValue: 'GST Return Q3 2024'
          }
        ]
      },
      {
        _id: '2',
        action: 'PUT /api/users/role',
        entityType: 'User',
        entityId: 'user_456',
        actorUserId: {
          _id: 'user_1',
          name: 'Ramesh Kumar',
          email: 'ramesh@firm.com'
        },
        timestamp: '2024-01-15T09:15:00Z',
        ipAddress: '192.168.1.100',
        severity: 'high',
        isComplianceAction: false,
        changes: [
          {
            field: 'role',
            oldValue: 'associate',
            newValue: 'senior'
          }
        ]
      },
      {
        _id: '3',
        action: 'POST /api/compliance/filing',
        entityType: 'ComplianceItem',
        entityId: 'comp_789',
        actorUserId: {
          _id: 'user_2',
          name: 'Priya Sharma',
          email: 'priya@firm.com'
        },
        timestamp: '2024-01-15T08:45:00Z',
        ipAddress: '192.168.1.101',
        severity: 'high',
        isComplianceAction: true,
        changes: [
          {
            field: 'status',
            oldValue: 'pending',
            newValue: 'filed'
          }
        ]
      },
      {
        _id: '4',
        action: 'DELETE /api/documents/version',
        entityType: 'Document',
        entityId: 'doc_123_v2',
        actorUserId: {
          _id: 'user_1',
          name: 'Ramesh Kumar',
          email: 'ramesh@firm.com'
        },
        timestamp: '2024-01-14T16:20:00Z',
        ipAddress: '192.168.1.100',
        severity: 'medium',
        isComplianceAction: false
      },
      {
        _id: '5',
        action: 'GET /api/analytics/reports',
        entityType: 'Analytics',
        entityId: 'report_456',
        actorUserId: {
          _id: 'user_3',
          name: 'Amit Patel',
          email: 'amit@firm.com'
        },
        timestamp: '2024-01-14T14:30:00Z',
        ipAddress: '192.168.1.102',
        severity: 'low',
        isComplianceAction: false
      }
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setLoading(false);
  }, []);

  // Filter logs based on search criteria
  useEffect(() => {
    let filtered = logs;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorUserId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actorUserId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }

    // Entity type filter
    if (selectedEntityType !== 'all') {
      filtered = filtered.filter(log => log.entityType === selectedEntityType);
    }

    // Action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action.includes(selectedAction));
    }

    // Compliance action filter
    if (showComplianceOnly) {
      filtered = filtered.filter(log => log.isComplianceAction);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedSeverity, selectedEntityType, selectedAction, showComplianceOnly]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp',
      'Action',
      'Entity Type',
      'Entity ID',
      'User',
      'IP Address',
      'Severity',
      'Compliance Action',
      'Changes'
    ];

    const csvData = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString('en-IN'),
      log.action,
      log.entityType,
      log.entityId,
      log.actorUserId.name,
      log.ipAddress,
      log.severity,
      log.isComplianceAction ? 'Yes' : 'No',
      log.changes ? JSON.stringify(log.changes) : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <RequirePermission permission="audit:read">
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Audit Logs</h2>
            <p className="text-gray-600 mt-1">
              Monitor and track all system activities, user actions, and compliance events
            </p>
          </div>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Severity Filter */}
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              {/* Entity Type Filter */}
              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="Document">Documents</SelectItem>
                  <SelectItem value="User">Users</SelectItem>
                  <SelectItem value="ComplianceItem">Compliance</SelectItem>
                  <SelectItem value="Project">Projects</SelectItem>
                  <SelectItem value="Client">Clients</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Filters */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showComplianceOnly}
                  onChange={(e) => setShowComplianceOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Show compliance actions only</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Logs</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Severity</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Actions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredLogs.filter(log => log.isComplianceAction).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(filteredLogs.map(log => log.actorUserId._id)).size}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Log Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Entity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">IP Address</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate" title={log.action}>
                          {log.action}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {log.entityType}
                          </Badge>
                          <span className="text-sm text-gray-600 font-mono">
                            {log.entityId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{log.actorUserId.name}</div>
                          <div className="text-sm text-gray-500">{log.actorUserId.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {log.ipAddress}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getSeverityColor(log.severity)} flex items-center gap-1 w-fit`}>
                          {getSeverityIcon(log.severity)}
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {log.isComplianceAction && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Compliance
                            </Badge>
                          )}
                          {log.changes && log.changes.length > 0 && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              View Changes ({log.changes.length})
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No audit logs found matching the current filters.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
};

export default SystemLogsDashboard;
