// FILE: /workers/reminders.ts
import { Worker } from 'bullmq';
import { getQueue } from '../lib/queue';
import { ComplianceItem } from '../models';
import { logAction } from '../lib/audit';
import { addJob } from '../lib/queue';

/**
 * Compliance reminders worker
 * Processes due and overdue compliance items and sends notifications
 */

interface ReminderJob {
  complianceId: string;
  assigneeId: string;
  dueDate: Date;
}

/**
 * Process compliance reminder job
 */
async function processComplianceReminder(job: any): Promise<void> {
  const { complianceId, assigneeId, dueDate } = job.data as ReminderJob;
  
  try {
    // Get compliance item details
    const compliance = await ComplianceItem.findById(complianceId)
      .populate('clientId', 'name')
      .populate('assigneeId', 'name email');
    
    if (!compliance) {
      console.warn(`Compliance item ${complianceId} not found`);
      return;
    }
    
    // Check if still due/overdue
    const now = new Date();
    const isOverdue = now > dueDate;
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create notification
    const notification = {
      userId: assigneeId,
      firmId: compliance.firmId,
      type: isOverdue ? 'error' : 'warning',
      title: isOverdue ? 'Compliance Overdue' : 'Compliance Due Soon',
      message: isOverdue 
        ? `${(compliance.clientId as any)?.name || 'Client'} - ${compliance.complianceType} compliance is overdue by ${Math.abs(daysUntilDue)} days`
        : `${(compliance.clientId as any)?.name || 'Client'} - ${compliance.complianceType} compliance is due in ${daysUntilDue} days`,
      category: 'compliance',
      actionUrl: `/compliance/${complianceId}`,
      metadata: {
        complianceId,
        clientId: (compliance.clientId as any)?._id,
        type: compliance.complianceType,
        dueDate,
        isOverdue,
        daysUntilDue
      }
    };
    
    // TODO: Send actual notification (email, SMS, push)
    console.log('Sending compliance reminder:', notification);
    
    // Log the reminder action
    await logAction({
      action: 'compliance.reminder_sent',
      entityType: 'ComplianceItem',
      entityId: complianceId,
      meta: {
        assigneeId,
        dueDate,
        isOverdue,
        daysUntilDue
      }
    });
    
    // If overdue, schedule another reminder for tomorrow
    if (isOverdue) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      await addJob(
        'REMINDERS',
        'compliance-reminder',
        { complianceId, assigneeId, dueDate },
        { delay: tomorrow.getTime() - Date.now() }
      );
    }
    
  } catch (error) {
    console.error('Failed to process compliance reminder:', error);
    throw error;
  }
}

/**
 * Daily compliance check - find all due/overdue items
 */
async function dailyComplianceCheck(): Promise<void> {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find compliance items due today or overdue
    const dueItems = await ComplianceItem.find({
      status: { $in: ['todo', 'in_progress'] },
      dueDate: { $lte: tomorrow }
    }).populate('assignedTo', 'firmId');
    
    console.log(`Found ${dueItems.length} compliance items due/overdue`);
    
    // Schedule reminders for each item
    for (const item of dueItems) {
      if (item.assignedTo) {
        const delay = Math.max(0, item.dueDate.getTime() - now.getTime());
        
        await addJob(
          'REMINDERS',
          'compliance-reminder',
          {
            complianceId: (item._id as any).toString(),
            assigneeId: (item.assignedTo as any)._id.toString(),
            dueDate: item.dueDate
          },
          { delay }
        );
      }
    }
    
    console.log('Daily compliance check completed');
    
  } catch (error) {
    console.error('Daily compliance check failed:', error);
  }
}

/**
 * Initialize reminders worker
 */
export function initializeRemindersWorker(): Worker {
  const worker = new Worker(
    'compliance-reminders',
    async (job) => {
      if (job.name === 'compliance-reminder') {
        await processComplianceReminder(job);
      } else if (job.name === 'daily-check') {
        await dailyComplianceCheck();
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0')
      },
      concurrency: 5
    }
  );
  
  // Handle worker events
  worker.on('completed', (job) => {
    console.log(`Reminder job ${job.id} completed successfully`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`Reminder job ${job?.id} failed:`, err);
  });
  
  // Schedule daily compliance check at 9 AM
  const dailyCheckQueue = getQueue('REMINDERS');
  dailyCheckQueue.add(
    'daily-check',
    {},
    {
      repeat: {
        pattern: '0 9 * * *' // Every day at 9 AM
      }
    }
  );
  
  console.log('✅ Reminders worker initialized');
  return worker;
}

/**
 * Send immediate reminder for a specific compliance item
 */
export async function sendImmediateReminder(complianceId: string): Promise<void> {
  const compliance = await ComplianceItem.findById(complianceId)
    .populate('assignedTo', 'firmId');
  
  if (!compliance || !compliance.assignedTo) {
    throw new Error('Compliance item not found or no assignee');
  }
  
  await addJob(
    'REMINDERS',
    'compliance-reminder',
    {
      complianceId: (compliance._id as any).toString(),
      assigneeId: (compliance.assignedTo as any)._id.toString(),
      dueDate: compliance.dueDate
    }
  );
}
