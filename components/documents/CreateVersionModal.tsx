// FILE: /components/documents/CreateVersionModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Info
} from 'lucide-react';
import { RequirePermission } from '@/components/auth/RequirePermission';

interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentDocument: {
    title: string;
    originalName: string;
    version: number;
    fileSize: number;
    mimeType: string;
  };
  onSubmit: (file: File, changeNotes: string) => Promise<void>;
}

const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  isOpen,
  onClose,
  documentId,
  currentDocument,
  onSubmit
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (file.type !== currentDocument.mimeType) {
      alert(`Please select a file of type: ${currentDocument.mimeType}`);
      return;
    }
    
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    if (!changeNotes.trim()) {
      alert('Please provide change notes');
      return;
    }

    setIsUploading(true);
    try {
      await onSubmit(selectedFile, changeNotes);
      onClose();
      // Reset form
      setSelectedFile(null);
      setChangeNotes('');
    } catch (error) {
      alert('Failed to create version. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    return '📁';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Version
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Document Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800">Current Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(currentDocument.mimeType)}</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{currentDocument.title}</p>
                  <p className="text-sm text-blue-700">{currentDocument.originalName}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-blue-600">
                    <span>Version {currentDocument.version}</span>
                    <span>•</span>
                    <span>{formatFileSize(currentDocument.fileSize)}</span>
                    <span>•</span>
                    <span>{currentDocument.mimeType}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  v{currentDocument.version}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="file-upload">New File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600">
                      Supports {currentDocument.mimeType} files up to 50MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept={currentDocument.mimeType}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Change Notes */}
          <div className="space-y-3">
            <Label htmlFor="change-notes">
              Change Notes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="change-notes"
              placeholder="Describe what changed in this version (e.g., 'Updated GST calculations', 'Added missing invoices', 'Corrected filing period')"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-600">
              Change notes help team members understand what was modified and why.
            </p>
          </div>

          {/* Version Preview */}
          {selectedFile && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800">New Version Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{selectedFile.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-green-700">
                      <span>Version {currentDocument.version + 1}</span>
                      <span>•</span>
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span>{selectedFile.type}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    v{currentDocument.version + 1}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Notes */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Creating a new version will preserve the current version in history</li>
                  <li>• The new version will become the latest and active version</li>
                  <li>• Previous versions remain accessible for reference and rollback</li>
                  <li>• Change notes are required and will be logged in the audit trail</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <RequirePermission permission="documents:version">
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || !changeNotes.trim() || isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Version...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Version {currentDocument.version + 1}
                  </>
                )}
              </Button>
            </RequirePermission>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVersionModal;
