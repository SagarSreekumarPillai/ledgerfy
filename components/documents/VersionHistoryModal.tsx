// FILE: /components/documents/VersionHistoryModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  FileText, 
  RotateCcw, 
  Download, 
  Eye, 
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { RequirePermission } from '@/components/auth/RequirePermission';

interface FileVersion {
  _id: string;
  version: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  changedBy: {
    _id: string;
    name: string;
    email: string;
  };
  changeNotes?: string;
  createdAt: string;
  isLatestVersion: boolean;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentVersion: FileVersion;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  documentId,
  currentVersion
}) => {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen && documentId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockVersions: FileVersion[] = [
          {
            _id: 'v3',
            version: 3,
            fileName: 'gst_return_q3_2024_v3.pdf',
            originalName: 'GST Return Q3 2024.pdf',
            filePath: '/uploads/gst_return_q3_2024_v3.pdf',
            fileSize: 2457600,
            mimeType: 'application/pdf',
            fileExtension: 'pdf',
            changedBy: {
              _id: 'user_1',
              name: 'Ramesh Kumar',
              email: 'ramesh@firm.com'
            },
            changeNotes: 'Updated with revised turnover figures and corrected GST calculations',
            createdAt: '2024-01-15T10:30:00Z',
            isLatestVersion: true
          },
          {
            _id: 'v2',
            version: 2,
            fileName: 'gst_return_q3_2024_v2.pdf',
            originalName: 'GST Return Q3 2024.pdf',
            filePath: '/uploads/gst_return_q3_2024_v2.pdf',
            fileSize: 2188800,
            mimeType: 'application/pdf',
            fileExtension: 'pdf',
            changedBy: {
              _id: 'user_2',
              name: 'Priya Sharma',
              email: 'priya@firm.com'
            },
            changeNotes: 'Added missing invoice details and updated tax calculations',
            createdAt: '2024-01-12T14:15:00Z',
            isLatestVersion: false
          },
          {
            _id: 'v1',
            version: 1,
            fileName: 'gst_return_q3_2024_v1.pdf',
            originalName: 'GST Return Q3 2024.pdf',
            filePath: '/uploads/gst_return_q3_2024_v1.pdf',
            fileSize: 1958400,
            mimeType: 'application/pdf',
            fileExtension: 'pdf',
            changedBy: {
              _id: 'user_1',
              name: 'Ramesh Kumar',
              email: 'ramesh@firm.com'
            },
            changeNotes: 'Initial version - basic GST return structure',
            createdAt: '2024-01-10T09:00:00Z',
            isLatestVersion: false
          }
        ];
        setVersions(mockVersions);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, documentId]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  const getVersionIcon = (version: FileVersion) => {
    if (version.isLatestVersion) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <GitBranch className="w-4 h-4 text-blue-600" />;
  };

  const getVersionColor = (version: FileVersion) => {
    if (version.isLatestVersion) {
      return 'border-green-200 bg-green-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const handleRestore = async (version: FileVersion) => {
    if (!confirm(`Are you sure you want to restore to version ${version.version}? This will create a new version.`)) {
      return;
    }

    setRestoring(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Successfully restored to version ${version.version}`);
      onClose();
    } catch (error) {
      alert('Failed to restore version. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const handleDownload = (version: FileVersion) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = version.filePath;
    link.download = version.originalName;
    link.click();
  };

  const handleViewDiff = (version: FileVersion) => {
    setSelectedVersion(version);
    setShowDiff(true);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Version History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Version Info */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Current Version (v{currentVersion.version})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">File:</span> {currentVersion.originalName}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span> {formatFileSize(currentVersion.fileSize)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span> {currentVersion.mimeType}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Modified:</span> {formatTimestamp(currentVersion.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Version Timeline</h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {versions.map((version, index) => (
                  <div key={version._id} className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                      {getVersionIcon(version)}
                    </div>
                    
                    {/* Version content */}
                    <div className={`flex-1 p-4 rounded-lg border ${getVersionColor(version)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Version {version.version}
                            </Badge>
                            {version.isLatestVersion && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                Latest
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatTimestamp(version.createdAt)}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="font-medium text-gray-900">{version.originalName}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(version.fileSize)} • {version.mimeType}
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <User className="w-4 h-4" />
                              Changed by {version.changedBy.name}
                            </div>
                            {version.changeNotes && (
                              <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                                {version.changeNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <RequirePermission permission="documents:read">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDiff(version)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                          </RequirePermission>
                          
                          <RequirePermission permission="documents:download">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(version)}
                              className="flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
                          </RequirePermission>
                          
                          {!version.isLatestVersion && (
                            <RequirePermission permission="documents:restore">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestore(version)}
                                disabled={restoring}
                                className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                              >
                                <RotateCcw className="w-3 h-3" />
                                {restoring ? 'Restoring...' : 'Restore'}
                              </Button>
                            </RequirePermission>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Version Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{versions.length}</p>
                    <p className="text-sm text-gray-600">Total Versions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {versions.filter(v => v.isLatestVersion).length}
                    </p>
                    <p className="text-sm text-gray-600">Current Version</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {new Set(versions.map(v => v.changedBy._id)).size}
                    </p>
                    <p className="text-sm text-gray-600">Contributors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diff View Modal */}
      {showDiff && selectedVersion && (
        <Dialog open={showDiff} onOpenChange={setShowDiff}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Version Comparison</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Current Version (v{currentVersion.version})</h4>
                  <div className="p-4 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">File: {currentVersion.originalName}</p>
                    <p className="text-sm text-gray-600">Size: {formatFileSize(currentVersion.fileSize)}</p>
                    <p className="text-sm text-gray-600">Modified: {formatTimestamp(currentVersion.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Selected Version (v{selectedVersion.version})</h4>
                  <div className="p-4 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600">File: {selectedVersion.originalName}</p>
                    <p className="text-sm text-gray-600">Size: {formatFileSize(selectedVersion.fileSize)}</p>
                    <p className="text-sm text-gray-600">Modified: {formatTimestamp(selectedVersion.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded border">
                <h4 className="font-medium text-blue-900 mb-2">Changes Detected</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    File size changed from {formatFileSize(selectedVersion.fileSize)} to {formatFileSize(currentVersion.fileSize)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last modified: {formatTimestamp(selectedVersion.createdAt)} → {formatTimestamp(currentVersion.createdAt)}
                  </div>
                  {selectedVersion.changeNotes && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Change notes: {selectedVersion.changeNotes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDiff(false)}>
                  Close
                </Button>
                <RequirePermission permission="documents:restore">
                  <Button
                    onClick={() => {
                      setShowDiff(false);
                      handleRestore(selectedVersion);
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore This Version
                  </Button>
                </RequirePermission>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default VersionHistoryModal;
