// FILE: /app/api/ledger/import/tally/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { hasPermission } from '@/lib/rbac';
import { withCurrentFirmScope } from '@/lib/scope';
import TallySync from '@/models/TallySync';
import { logAction } from '@/lib/audit';
import { addTallyImportJob } from '@/lib/queue';
import { getDefaultAccountMapping } from '@/lib/tally';

/**
 * POST /api/ledger/import/tally - Import Tally data
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(user, 'tally:import')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const customMapping = formData.get('accountMapping') as string;

    if (!file || !clientId) {
      return NextResponse.json(
        { error: 'File and clientId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/csv', 'application/xml', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xml|xlsx?)$/i)) {
      return NextResponse.json(
        { error: 'Only CSV, XML, and Excel files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Get firm scope
    const firmScope = await withCurrentFirmScope();
    
    // Parse account mapping
    let accountMapping = getDefaultAccountMapping();
    if (customMapping) {
      try {
        const custom = JSON.parse(customMapping);
        accountMapping = { ...accountMapping, ...custom };
      } catch (error) {
        console.warn('Invalid account mapping JSON:', error);
      }
    }

    // Create TallySync record
    const tallySync = new TallySync({
      firmId: firmScope.firmId,
      clientId,
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toLowerCase() as 'csv' | 'xml' | 'excel',
      status: 'pending',
      accountMapping,
      createdBy: user._id
    });

    await tallySync.save();

    // Convert file to buffer and save temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = `/tmp/tally_import_${tallySync._id}_${Date.now()}`;
    
    // TODO: Save file to temporary storage
    // For now, we'll simulate this
    console.log(`Saving file to ${tempPath} (${buffer.length} bytes)`);

    // Queue the import job
    await addTallyImportJob(
      tempPath,
      clientId,
      accountMapping
    );

    // Log the action
    await logAction({
      action: 'ledger.import_tally_initiated',
      entityType: 'TallySync',
      entityId: tallySync._id.toString(),
      meta: {
        clientId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    });

    return NextResponse.json({
      success: true,
      syncId: tallySync._id,
      message: 'Import job queued successfully'
    });

  } catch (error) {
    console.error('Tally import error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Tally import' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ledger/import/tally - Get import status and history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(user, 'ledger:read')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with firm scope
    const query = await withCurrentFirmScope();
    if (clientId) query.clientId = clientId;

    // Get import history
    const imports = await TallySync.find(query)
      .populate('clientId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await TallySync.countDocuments(query);

    return NextResponse.json({
      imports,
      total,
      hasMore: total > offset + limit
    });

  } catch (error) {
    console.error('Tally import history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch import history' },
      { status: 500 }
    );
  }
}
