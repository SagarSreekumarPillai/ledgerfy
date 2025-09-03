// FILE: /lib/queue.ts
import { Queue, Worker } from 'bullmq';

/**
 * Queue configuration and initialization for background jobs
 */

export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  queues: {
    reminders: string;
    ocr: string;
    tallyImport: string;
  };
}

// Queue names
export const QUEUE_NAMES = {
  REMINDERS: 'compliance-reminders',
  OCR: 'document-ocr',
  TALLY_IMPORT: 'tally-import'
} as const;

// Default queue configuration
const defaultConfig: QueueConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0')
  },
  queues: {
    reminders: QUEUE_NAMES.REMINDERS,
    ocr: QUEUE_NAMES.OCR,
    tallyImport: QUEUE_NAMES.TALLY_IMPORT
  }
};

// Queue instances
let queues: Record<string, Queue> = {};
let workers: Record<string, Worker> = {};

/**
 * Initialize all queues
 */
export async function initializeQueues(config: QueueConfig = defaultConfig): Promise<void> {
  try {
    // Create queues
    queues[QUEUE_NAMES.REMINDERS] = new Queue(QUEUE_NAMES.REMINDERS, {
      connection: config.redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });

    queues[QUEUE_NAMES.OCR] = new Queue(QUEUE_NAMES.OCR, {
      connection: config.redis,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    });

    queues[QUEUE_NAMES.TALLY_IMPORT] = new Queue(QUEUE_NAMES.TALLY_IMPORT, {
      connection: config.redis,
      defaultJobOptions: {
        removeOnComplete: 20,
        removeOnFail: 10,
        attempts: 1 // Tally import jobs are expensive, don't retry
      }
    });

    // Note: QueueScheduler removed - using delayed jobs instead

    console.log('✅ Queues initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize queues:', error);
    throw error;
  }
}

/**
 * Get a queue by name
 */
export function getQueue(name: keyof typeof QUEUE_NAMES): Queue {
  const queueName = QUEUE_NAMES[name];
  if (!queues[queueName]) {
    throw new Error(`Queue ${queueName} not initialized`);
  }
  return queues[queueName];
}

/**
 * Add a job to a queue
 */
export async function addJob<T = any>(
  queueName: keyof typeof QUEUE_NAMES,
  jobName: string,
  data: T,
  options?: {
    delay?: number;
    priority?: number;
    repeat?: {
      pattern: string; // cron pattern
    };
  }
): Promise<void> {
  const queue = getQueue(queueName);
  
  const jobOptions: any = {};
  if (options?.delay) jobOptions.delay = options.delay;
  if (options?.priority) jobOptions.priority = options.priority;
  if (options?.repeat) jobOptions.repeat = options.repeat;
  
  await queue.add(jobName, data, jobOptions);
}

/**
 * Add a compliance reminder job
 */
export async function addComplianceReminder(
  complianceId: string,
  dueDate: Date,
  assigneeId: string
): Promise<void> {
  const delay = dueDate.getTime() - Date.now() - (24 * 60 * 60 * 1000); // 1 day before
  
  if (delay > 0) {
    await addJob(
      'REMINDERS',
      'compliance-reminder',
      { complianceId, assigneeId, dueDate },
      { delay }
    );
  }
}

/**
 * Add a Tally import job
 */
export async function addTallyImportJob(
  filePath: string,
  clientId: string,
  accountMapping: Record<string, string>
): Promise<void> {
  await addJob(
    'TALLY_IMPORT',
    'process-tally-import',
    { filePath, clientId, accountMapping }
  );
}

/**
 * Add an OCR job for document processing
 */
export async function addOcrJob(
  documentId: string,
  filePath: string
): Promise<void> {
  await addJob(
    'OCR',
    'extract-text',
    { documentId, filePath }
  );
}

/**
 * Clean up queues and workers
 */
export async function cleanupQueues(): Promise<void> {
  try {
    // Close all workers
    for (const worker of Object.values(workers)) {
      await worker.close();
    }
    
    // Close all queues
    for (const queue of Object.values(queues)) {
      await queue.close();
    }
    
    workers = {};
    queues = {};
    
    console.log('✅ Queues cleaned up successfully');
  } catch (error) {
    console.error('❌ Failed to cleanup queues:', error);
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<Record<string, any>> {
  const stats: Record<string, any> = {};
  
  for (const [name, queue] of Object.entries(queues)) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed()
    ]);
    
    stats[name] = {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length
    };
  }
  
  return stats;
}

// Graceful shutdown
process.on('SIGTERM', cleanupQueues);
process.on('SIGINT', cleanupQueues);
