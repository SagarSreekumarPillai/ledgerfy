// FILE: /workers/tally-import.ts
import { Worker } from 'bullmq';
import { TallySync, LedgerEntry } from '../models';
import { parseTallyCsv, parseTallyXml, importTallyData } from '../lib/tally';
import { logAction } from '../lib/audit';
import { getCurrentFirmId } from '../lib/scope';
import fs from 'fs/promises';

/**
 * Tally import worker
 * Processes large CSV/XML imports from Tally in the background
 */

interface TallyImportJob {
  filePath: string;
  clientId: string;
  accountMapping: Record<string, string>;
  userId: string;
}

/**
 * Process Tally import job
 */
async function processTallyImport(job: any): Promise<void> {
  const { filePath, clientId, accountMapping, userId } = job.data as TallyImportJob;
  
  try {
    // Update sync status to processing
    const syncRecord = await TallySync.findOne({
      clientId,
      'report.filePath': filePath
    });
    
    if (syncRecord) {
      syncRecord.status = 'processing';
      syncRecord.startedAt = new Date();
      await syncRecord.save();
    }
    
    // Read and parse file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    let rows;
    if (fileExtension === 'csv') {
      rows = parseTallyCsv(fileContent);
    } else if (fileExtension === 'xml') {
      rows = parseTallyXml(fileContent);
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }
    
    // Import data
    const result = await importTallyData(rows, clientId, accountMapping, fileExtension as 'csv' | 'xml');
    
    // Update sync record with results
    if (syncRecord) {
      syncRecord.status = result.success ? 'completed' : 'failed';
      syncRecord.totalRows = result.totalRows;
      syncRecord.processedRows = result.processedRows;
      syncRecord.skippedRows = result.skippedRows;
      syncRecord.errorRows = result.errorRows;
      syncRecord.errors = result.errors as any;
      syncRecord.report = {
        anomalies: result.anomalies,
        duplicates: result.duplicates,
        missingCounterparts: result.missingCounterparts
      };
      syncRecord.completedAt = new Date();
      await syncRecord.save();
    }
    
    // Log the import action
    await logAction({
      action: 'ledger.import_tally_completed',
      entityType: 'TallySync',
      entityId: syncRecord?._id.toString() || 'unknown',
      meta: {
        clientId,
        filePath,
        result: {
          success: result.success,
          processed: result.processedRows,
          skipped: result.skippedRows,
          errors: result.errorRows
        }
      }
    });
    
    // Clean up temporary file
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError);
    }
    
    console.log(`Tally import completed for client ${clientId}: ${result.processedRows} rows processed`);
    
  } catch (error) {
    console.error('Tally import failed:', error);
    
    // Update sync status to failed
    const syncRecord = await TallySync.findOne({
      clientId,
      'report.filePath': filePath
    });
    
    if (syncRecord) {
      syncRecord.status = 'failed';
      syncRecord.errors.push({
        row: 0,
        field: 'processing',
        message: error instanceof Error ? error.message : 'Unknown error',
        value: ''
      });
      syncRecord.completedAt = new Date();
      await syncRecord.save();
    }
    
    // Log the failure
    await logAction({
      action: 'ledger.import_tally_failed',
      entityType: 'TallySync',
      entityId: syncRecord?._id.toString() || 'unknown',
      meta: {
        clientId,
        filePath,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    throw error;
  }
}

/**
 * Initialize Tally import worker
 */
export function initializeTallyImportWorker(): Worker {
  const worker = new Worker(
    'tally-import',
    async (job) => {
      if (job.name === 'process-tally-import') {
        await processTallyImport(job);
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0')
      },
      concurrency: 2, // Limit concurrent imports to avoid overwhelming the system

    }
  );
  
  // Handle worker events
  worker.on('completed', (job) => {
    console.log(`Tally import job ${job.id} completed successfully`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`Tally import job ${job?.id} failed:`, err);
  });
  
  worker.on('stalled', (jobId) => {
    console.warn(`Tally import job ${jobId} stalled`);
  });
  
  console.log('✅ Tally import worker initialized');
  return worker;
}

/**
 * Get import statistics for a client
 */
export async function getImportStats(clientId: string): Promise<{
  totalImports: number;
  successfulImports: number;
  failedImports: number;
  lastImport: Date | null;
  totalRowsProcessed: number;
}> {
  const stats = await TallySync.aggregate([
    { $match: { clientId } },
    {
      $group: {
        _id: null,
        totalImports: { $sum: 1 },
        successfulImports: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedImports: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        totalRowsProcessed: { $sum: '$processedRows' },
        lastImport: { $max: '$createdAt' }
      }
    }
  ]);
  
  if (stats.length === 0) {
    return {
      totalImports: 0,
      successfulImports: 0,
      failedImports: 0,
      lastImport: null,
      totalRowsProcessed: 0
    };
  }
  
  return {
    totalImports: stats[0].totalImports,
    successfulImports: stats[0].successfulImports,
    failedImports: stats[0].failedImports,
    lastImport: stats[0].lastImport,
    totalRowsProcessed: stats[0].totalRowsProcessed
  };
}

/**
 * Get recent import history for a client
 */
export async function getImportHistory(
  clientId: string,
  limit: number = 10
): Promise<any[]> {
  return TallySync.find({ clientId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name');
}

/**
 * Retry failed import
 */
export async function retryFailedImport(syncId: string): Promise<void> {
  const syncRecord = await TallySync.findById(syncId);
  
  if (!syncRecord) {
    throw new Error('Import record not found');
  }
  
  if (syncRecord.status !== 'failed') {
    throw new Error('Only failed imports can be retried');
  }
  
  // Reset status and schedule retry
  syncRecord.status = 'pending';
  syncRecord.errors = [] as any;
  await syncRecord.save();
  
  // TODO: Re-queue the import job
  // This would require storing the original file or re-uploading
  
  await logAction({
    action: 'ledger.import_tally_retry',
    entityType: 'TallySync',
    entityId: syncId,
    meta: {
      clientId: syncRecord.clientId,
      originalStatus: 'failed'
    }
  });
}
