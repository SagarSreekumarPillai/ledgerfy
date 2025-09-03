// FILE: /app/api/ledger/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { withCurrentFirmScope, requireFirmAccess } from '@/lib/scope';
import LedgerEntry from '@/models/LedgerEntry';
import { logAction } from '@/lib/audit';
import { requirePermission } from '@/lib/rbac';

/**
 * GET /api/ledger - Get ledger entries with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission using middleware approach
    const hasPermission = await requirePermission(request, 'ledger:read', async (req, user) => {
      const { searchParams } = new URL(req.url);
      const clientId = searchParams.get('clientId');
      const account = searchParams.get('account');
      const dateFrom = searchParams.get('dateFrom');
      const dateTo = searchParams.get('dateTo');
      const limit = parseInt(searchParams.get('limit') || '100');
      const offset = parseInt(searchParams.get('offset') || '0');

      // Build query with firm scope
      const query = await withCurrentFirmScope();
      
      if (clientId) query.clientId = clientId;
      if (account) query.account = { $regex: account, $options: 'i' };
      
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }

      // Get ledger entries
      const entries = await LedgerEntry.find(query)
        .populate('clientId', 'name')
        .populate('linkedDocumentIds', 'name')
        .sort({ date: -1, createdAt: -1 })
        .limit(limit)
        .skip(offset);

      const total = await LedgerEntry.countDocuments(query);

      // Log the action
      await logAction({
        action: 'ledger.read',
        entityType: 'LedgerEntry',
        entityId: 'list',
        meta: { filters: { clientId, account, dateFrom, dateTo }, count: entries.length }
      });

      return NextResponse.json({
        entries,
        total,
        hasMore: total > offset + limit
      });
    });

    return hasPermission;

  } catch (error) {
    console.error('Ledger GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ledger entries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ledger - Create new ledger entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission using middleware approach
    const hasPermission = await requirePermission(request, 'ledger:write', async (req, user) => {
      const body = await req.json();
      const { clientId, date, account, particulars, debit, credit, balance, linkedDocumentIds } = body;

      // Validate required fields
      if (!clientId || !date || !account || particulars === undefined || debit === undefined || credit === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Validate debit/credit logic
      if (debit < 0 || credit < 0) {
        return NextResponse.json(
          { error: 'Debit and credit amounts must be non-negative' },
          { status: 400 }
        );
      }

      // Create ledger entry
      const entry = new LedgerEntry({
        ...body,
        createdBy: user._id,
        source: 'manual'
      });

      await entry.save();

      // Log the action
      await logAction({
        action: 'ledger.create',
        entityType: 'LedgerEntry',
        entityId: entry._id.toString(),
        meta: { clientId, account, amount: debit || credit }
      });

      return NextResponse.json(entry, { status: 201 });
    });

    return hasPermission;

  } catch (error) {
    console.error('Ledger POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create ledger entry' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ledger/:id - Update ledger entry
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission using middleware approach
    const hasPermission = await requirePermission(request, 'ledger:write', async (req, user) => {
      const body = await req.json();
      const { particulars, debit, credit, balance, linkedDocumentIds } = body;

      // Get existing entry
      const entry = await LedgerEntry.findById(params.id);
      if (!entry) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }

      // Validate firm access
      if (!entry.firmId) {
        return NextResponse.json({ error: 'Entry has no firm ID' }, { status: 400 });
      }
      await requireFirmAccess(entry.firmId.toString());

      // Update fields
      if (particulars !== undefined) entry.particulars = particulars;
      if (debit !== undefined) entry.debit = debit;
      if (credit !== undefined) entry.credit = credit;
      if (balance !== undefined) entry.balance = balance;
      if (linkedDocumentIds !== undefined) entry.linkedDocumentIds = linkedDocumentIds;
      
      entry.updatedAt = new Date();
      await entry.save();

      // Log the action
      await logAction({
        action: 'ledger.update',
        entityType: 'LedgerEntry',
        entityId: entry._id.toString(),
        meta: { updatedFields: Object.keys(body) }
      });

      return NextResponse.json(entry);
    });

    return hasPermission;

  } catch (error) {
    console.error('Ledger PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update ledger entry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ledger/:id - Delete ledger entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission using middleware approach
    const hasPermission = await requirePermission(request, 'ledger:write', async (req, user) => {
      // Get existing entry
      const entry = await LedgerEntry.findById(params.id);
      if (!entry) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }

      // Validate firm access
      if (!entry.firmId) {
        return NextResponse.json({ error: 'Entry has no firm ID' }, { status: 400 });
      }
      await requireFirmAccess(entry.firmId.toString());

      // Delete entry
      await LedgerEntry.findByIdAndDelete(params.id);

      // Log the action
      await logAction({
        action: 'ledger.delete',
        entityType: 'LedgerEntry',
        entityId: params.id,
        meta: { clientId: entry.clientId, account: entry.account }
      });

      return NextResponse.json({ success: true });
    });

    return hasPermission;

  } catch (error) {
    console.error('Ledger DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete ledger entry' },
      { status: 500 }
    );
  }
}
