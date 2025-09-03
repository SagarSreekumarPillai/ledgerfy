// FILE: /lib/tally.ts
import { LedgerEntry } from '../models';
import { withCurrentFirmScope } from './scope';
import { logAction } from './audit';

export interface TallyImportResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  errorRows: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value: string;
  }>;
  anomalies: string[];
  duplicates: string[];
  missingCounterparts: string[];
}

export interface TallyRow {
  date: string;
  account: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface AccountMapping {
  [tallyAccount: string]: string; // Map Tally account names to standard account names
}

/**
 * Parse Tally CSV export
 */
export function parseTallyCsv(csvContent: string): TallyRow[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Find column indices
  const dateIndex = headers.findIndex(h => h.includes('date'));
  const accountIndex = headers.findIndex(h => h.includes('account') || h.includes('ledger'));
  const particularsIndex = headers.findIndex(h => h.includes('particulars') || h.includes('narration'));
  const debitIndex = headers.findIndex(h => h.includes('debit'));
  const creditIndex = headers.findIndex(h => h.includes('credit'));
  const balanceIndex = headers.findIndex(h => h.includes('balance'));
  
  if (dateIndex === -1 || accountIndex === -1) {
    throw new Error('Required columns (date, account) not found in CSV');
  }
  
  const rows: TallyRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    try {
      const row: TallyRow = {
        date: parseDate(values[dateIndex]),
        account: values[accountIndex] || '',
        particulars: values[particularsIndex] || '',
        debit: parseNumber(values[debitIndex]),
        credit: parseNumber(values[creditIndex]),
        balance: parseNumber(values[balanceIndex])
      };
      
      if (row.account && (row.debit !== 0 || row.credit !== 0)) {
        rows.push(row);
      }
    } catch (error) {
      console.warn(`Skipping invalid row ${i + 1}:`, error);
    }
  }
  
  return rows;
}

/**
 * Parse Tally XML export
 */
export function parseTallyXml(xmlContent: string): TallyRow[] {
  // TODO: Implement XML parsing for Tally exports
  // This would parse the XML structure and extract ledger entries
  throw new Error('XML parsing not implemented yet');
}

/**
 * Import Tally data into ledger entries
 */
export async function importTallyData(
  rows: TallyRow[],
  clientId: string,
  accountMapping: AccountMapping = {},
  source: 'csv' | 'xml' = 'csv'
): Promise<TallyImportResult> {
  const firmId = (await withCurrentFirmScope()).firmId;
  
  const result: TallyImportResult = {
    success: false,
    totalRows: rows.length,
    processedRows: 0,
    skippedRows: 0,
    errorRows: 0,
    errors: [],
    anomalies: [],
    duplicates: [],
    missingCounterparts: []
  };
  
  const processedEntries: TallyRow[] = [];
  const errors: TallyRow[] = [];
  
  // Validate and process each row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    try {
      // Validate row
      if (!row.date || !row.account) {
        result.errors.push({
          row: i + 1,
          field: 'validation',
          message: 'Missing required fields',
          value: JSON.stringify(row)
        });
        result.errorRows++;
        continue;
      }
      
      // Check for duplicates
      const isDuplicate = processedEntries.some(entry => 
        entry.date === row.date && 
        entry.account === row.account && 
        entry.debit === row.debit && 
        entry.credit === row.credit
      );
      
      if (isDuplicate) {
        result.duplicates.push(`Row ${i + 1}: ${row.account} - ${row.particulars}`);
        result.skippedRows++;
        continue;
      }
      
      // Check for anomalies
      if (Math.abs(row.debit - row.credit) > 1000000) { // Amount > 10L
        result.anomalies.push(`Row ${i + 1}: Large amount difference - Debit: ${row.debit}, Credit: ${row.credit}`);
      }
      
      // Check for missing counterpart
      if (row.debit > 0 && row.credit > 0) {
        result.anomalies.push(`Row ${i + 1}: Both debit and credit have values`);
      }
      
      processedEntries.push(row);
      result.processedRows++;
      
    } catch (error) {
      result.errors.push({
        row: i + 1,
        field: 'processing',
        message: error instanceof Error ? error.message : 'Unknown error',
        value: JSON.stringify(row)
      });
      result.errorRows++;
    }
  }
  
  // Create ledger entries
  if (processedEntries.length > 0) {
    try {
      const ledgerEntries = processedEntries.map(row => ({
        firmId,
        clientId,
        date: new Date(row.date),
        account: accountMapping[row.account] || row.account,
        particulars: row.particulars,
        debit: row.debit,
        credit: row.credit,
        balance: row.balance,
        source: 'tally' as const,
        flags: [],
        linkedDocumentIds: [],
        createdBy: null // Will be set by the calling function
      }));
      
      await LedgerEntry.insertMany(ledgerEntries);
      
      // Log the import action
      await logAction({
        action: 'ledger.import_tally',
        entityType: 'LedgerEntry',
        entityId: 'bulk_import',
        meta: {
          source,
          clientId,
          rowsProcessed: result.processedRows,
          rowsSkipped: result.skippedRows,
          rowsWithErrors: result.errorRows
        }
      });
      
      result.success = true;
      
    } catch (error) {
      result.errors.push({
        row: 0,
        field: 'database',
        message: error instanceof Error ? error.message : 'Failed to save ledger entries',
        value: ''
      });
    }
  }
  
  return result;
}

/**
 * Parse date string (handles various formats)
 */
function parseDate(dateStr: string): string {
  // Handle common Indian date formats
  const formats = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
    /(\d{1,2})-(\d{1,2})-(\d{4})/,   // DD-MM-YYYY
    /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (format.source.includes('YYYY-MM-DD')) {
        return dateStr; // Already in ISO format
      } else {
        const [, day, month, year] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }
  
  throw new Error(`Unrecognized date format: ${dateStr}`);
}

/**
 * Parse number string
 */
function parseNumber(numStr: string): number {
  if (!numStr || numStr.trim() === '') return 0;
  
  // Remove commas and convert to number
  const cleanStr = numStr.replace(/,/g, '');
  const num = parseFloat(cleanStr);
  
  if (isNaN(num)) {
    throw new Error(`Invalid number: ${numStr}`);
  }
  
  return num;
}

/**
 * Generate default account mapping for common Tally accounts
 */
export function getDefaultAccountMapping(): AccountMapping {
  return {
    'Cash': 'Cash',
    'Bank': 'Bank',
    'Sales': 'Sales',
    'Purchase': 'Purchase',
    'GST Input': 'GST Input',
    'GST Output': 'GST Output',
    'TDS': 'TDS',
    'Salary': 'Salary',
    'Rent': 'Rent',
    'Electricity': 'Electricity',
    'Telephone': 'Telephone',
    'Commission': 'Commission',
    'Discount': 'Discount',
    'Interest': 'Interest',
    'Depreciation': 'Depreciation'
  };
}
