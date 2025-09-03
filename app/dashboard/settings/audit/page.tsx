// FILE: /app/dashboard/settings/audit/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, FileText, Users, Database, AlertTriangle } from 'lucide-react';
import SystemLogsDashboard from '@/components/audit/SystemLogsDashboard';
import { RequirePermission } from '@/components/auth/RequirePermission';

export default function AuditLogsPage() {
  return (
    <RequirePermission permission="audit:read">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Audit & Logs</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive monitoring and tracking of all system activities, user actions, and compliance events
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Audit Logs</p>
                  <p className="text-3xl font-bold text-gray-900">2,847</p>
                  <p className="text-sm text-gray-500 mt-1">+12% from last week</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Severity Events</p>
                  <p className="text-3xl font-bold text-orange-600">23</p>
                  <p className="text-sm text-orange-500 mt-1">Requires attention</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Actions</p>
                  <p className="text-3xl font-bold text-green-600">156</p>
                  <p className="text-sm text-green-500 mt-1">This month</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-purple-600">18</p>
                  <p className="text-sm text-gray-500 mt-1">Today</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Document version created</p>
                    <p className="text-sm text-gray-500">GST Return Q3 2024 - Version 2.1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">User role updated</p>
                    <p className="text-sm text-gray-500">Priya Sharma promoted to Senior Associate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">15 minutes ago</p>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Compliance filing completed</p>
                    <p className="text-sm text-gray-500">TDS Return Q3 2024 marked as filed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">1 hour ago</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">High</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Database className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">System backup completed</p>
                    <p className="text-sm text-gray-500">Daily backup to secure cloud storage</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">3 hours ago</p>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Low</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Audit Dashboard */}
        <SystemLogsDashboard />
      </div>
    </RequirePermission>
  );
}
