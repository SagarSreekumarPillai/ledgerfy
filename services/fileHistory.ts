// FILE: /services/fileHistory.ts
import mongoose from 'mongoose';
import Document, { IDocument } from '../models/Document';
import AuditLog from '../models/AuditLog';

// Define DocumentModel for use in methods
const DocumentModel = Document;

export interface IFileVersion {
  _id: mongoose.Types.ObjectId;
  version: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileExtension: string;
  changedBy: mongoose.Types.ObjectId;
  changeNotes?: string;
  createdAt: Date;
  isLatestVersion: boolean;
}

export interface IFileHistoryService {
  createVersion(
    documentId: string,
    newFilePath: string,
    newFileName: string,
    changedBy: mongoose.Types.ObjectId,
    changeNotes?: string
  ): Promise<IDocument>;
  
  getVersionHistory(documentId: string): Promise<IFileVersion[]>;
  
  restoreToVersion(
    documentId: string,
    versionId: string,
    restoredBy: mongoose.Types.ObjectId
  ): Promise<IDocument>;
  
  deleteVersion(
    documentId: string,
    versionId: string,
    deletedBy: mongoose.Types.ObjectId
  ): Promise<boolean>;
  
  getLatestVersion(documentId: string): Promise<IDocument | null>;
  
  compareVersions(version1Id: string, version2Id: string): Promise<{
    added: string[];
    removed: string[];
    modified: string[];
  }>;
}

class FileHistoryService implements IFileHistoryService {
  
  /**
   * Create a new version of a document
   */
  async createVersion(
    documentId: string,
    newFilePath: string,
    newFileName: string,
    changedBy: mongoose.Types.ObjectId,
    changeNotes?: string
  ): Promise<IDocument> {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Find the current document
        const currentDoc = await DocumentModel.findById(documentId).session(session);
        if (!currentDoc) {
          throw new Error('Document not found');
        }
        
        // Mark current version as not latest
        currentDoc.isLatestVersion = false;
        await currentDoc.save({ session });
        
        // Add current version to previous versions
        currentDoc.previousVersions.push(currentDoc._id as any);
        await currentDoc.save({ session });
        
        // Create new document with incremented version
        const newDoc = new DocumentModel({
          ...currentDoc.toObject(),
          _id: new mongoose.Types.ObjectId(),
          filePath: newFilePath,
          fileName: newFileName,
          version: currentDoc.version + 1,
          previousVersions: [],
          parentFileId: currentDoc._id,
          changedBy: changedBy,
          changeNotes: changeNotes || `Version ${currentDoc.version + 1} created`,
          isLatestVersion: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newDoc.save({ session });
        
        // Log the action
        await this.logVersionAction(
          'version_created',
          currentDoc.firmId,
          changedBy,
          'Document',
          (newDoc._id as any).toString(),
          {
            originalDocumentId: documentId,
            newVersion: newDoc.version,
            changeNotes
          }
        );
        
        return newDoc;
      });
      
      // Return the new document
      const result = await DocumentModel.findById(documentId).populate('changedBy', 'name email');
      if (!result) {
        throw new Error('Failed to retrieve new document');
      }
      return result;
    } finally {
      await session.endSession();
    }
  }
  
  /**
   * Get version history of a document
   */
  async getVersionHistory(documentId: string): Promise<IFileVersion[]> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Get all versions of this document
    const versions = await DocumentModel.find({
      $or: [
        { _id: document._id },
        { parentFileId: document._id },
        { _id: { $in: document.previousVersions } }
      ]
    })
    .sort({ version: 1 })
    .populate('changedBy', 'name email')
    .select('_id version fileName originalName filePath fileSize mimeType fileExtension changedBy changeNotes createdAt isLatestVersion');
    
    return versions.map(doc => ({
      _id: doc._id as any,
      version: doc.version,
      fileName: doc.fileName,
      originalName: doc.originalName,
      filePath: doc.filePath,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      fileExtension: doc.fileExtension,
      changedBy: doc.changedBy || new mongoose.Types.ObjectId(),
      changeNotes: doc.changeNotes,
      createdAt: doc.createdAt,
      isLatestVersion: doc.isLatestVersion
    }));
  }
  
  /**
   * Restore to a previous version
   */
  async restoreToVersion(
    documentId: string,
    versionId: string,
    restoredBy: mongoose.Types.ObjectId
  ): Promise<IDocument> {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Find the current document
        const currentDoc = await DocumentModel.findById(documentId).session(session);
        if (!currentDoc) {
          throw new Error('Document not found');
        }
        
        // Find the target version
        const targetVersion = await DocumentModel.findById(versionId).session(session);
        if (!targetVersion) {
          throw new Error('Version not found');
        }
        
        // Mark current version as not latest
        currentDoc.isLatestVersion = false;
        await currentDoc.save({ session });
        
        // Create new version from target
        const restoredDoc = new Document({
          ...targetVersion.toObject(),
          _id: new mongoose.Types.ObjectId(),
          version: currentDoc.version + 1,
          previousVersions: [currentDoc._id],
          parentFileId: currentDoc._id,
          changedBy: restoredBy,
          changeNotes: `Restored from version ${targetVersion.version}`,
          isLatestVersion: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await restoredDoc.save({ session });
        
        // Log the action
        await this.logVersionAction(
          'version_restored',
          currentDoc.firmId,
          restoredBy,
          'Document',
          (restoredDoc._id as any).toString(),
          {
            originalDocumentId: documentId,
            restoredVersionId: versionId,
            newVersion: restoredDoc.version
          }
        );
        
        return restoredDoc;
      });
      
      // Return the restored document
      const restoredDoc = await DocumentModel.findById(documentId).populate('changedBy', 'name email');
      if (!restoredDoc) {
        throw new Error('Failed to retrieve restored document');
      }
      return restoredDoc;
    } finally {
      await session.endSession();
    }
  }
  
  /**
   * Delete a specific version (only for admins)
   */
  async deleteVersion(
    documentId: string,
    versionId: string,
    deletedBy: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Find the document
        const document = await DocumentModel.findById(documentId).session(session);
        if (!document) {
          throw new Error('Document not found');
        }
        
        // Find the version to delete
        const versionToDelete = await DocumentModel.findById(versionId).session(session);
        if (!versionToDelete) {
          throw new Error('Version not found');
        }
        
        // Check if it's the latest version
        if (versionToDelete.isLatestVersion) {
          throw new Error('Cannot delete the latest version');
        }
        
        // Remove from previous versions array
        document.previousVersions = document.previousVersions.filter(
          (id: any) => !id.equals(versionToDelete._id as any)
        );
        await document.save({ session });
        
        // Delete the version
        await DocumentModel.findByIdAndDelete(versionId).session(session);
        
        // Log the action
        await this.logVersionAction(
          'version_deleted',
          document.firmId,
          deletedBy,
          'Document',
          versionId,
          {
            documentId,
            deletedVersion: versionToDelete.version
          }
        );
        
        return true;
      });
      
      return true;
    } finally {
      await session.endSession();
    }
  }
  
  /**
   * Get the latest version of a document
   */
  async getLatestVersion(documentId: string): Promise<IDocument | null> {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return null;
    }
    
    // If this is the latest version, return it
    if (document.isLatestVersion) {
      return document;
    }
    
    // Find the latest version
    return await DocumentModel.findOne({
      $or: [
        { parentFileId: document._id },
        { _id: { $in: document.previousVersions } }
      ],
      isLatestVersion: true
    }).populate('changedBy', 'name email');
  }
  
  /**
   * Compare two versions of a document
   */
  async compareVersions(version1Id: string, version2Id: string): Promise<{
    added: string[];
    removed: string[];
    modified: string[];
  }> {
    const version1 = await DocumentModel.findById(version1Id);
    const version2 = await DocumentModel.findById(version2Id);
    
    if (!version1 || !version2) {
      throw new Error('One or both versions not found');
    }
    
    const fields = ['title', 'description', 'tags', 'category', 'documentType', 'financialYear', 'assessmentYear'];
    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];
    
    for (const field of fields) {
      const value1 = version1.get(field);
      const value2 = version2.get(field);
      
      if (value1 === undefined && value2 !== undefined) {
        added.push(field);
      } else if (value1 !== undefined && value2 === undefined) {
        removed.push(field);
      } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
        modified.push(field);
      }
    }
    
    return { added, removed, modified };
  }
  
  /**
   * Log version-related actions
   */
  private async logVersionAction(
    action: string,
    firmId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    entityType: string,
    entityId: string,
    meta: any
  ): Promise<void> {
    try {
      await AuditLog.create({
        firmId,
        actorUserId: userId,
        action,
        entityType,
        entityId,
        ip: '127.0.0.1', // Will be updated by middleware
        userAgent: 'FileHistoryService',
        meta,
        timestamp: new Date(),
        ipAddress: '127.0.0.1',
        userId,
        actionType: action.includes('delete') ? 'delete' : 'version',
        entityName: 'Document Version',
        severity: 'medium',
        isComplianceAction: false
      });
    } catch (error) {
      console.error('Failed to log version action:', error);
    }
  }
}

export default new FileHistoryService();
