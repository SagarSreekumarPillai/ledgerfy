// FILE: /app/api/documents/versions/compare/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fileHistoryService from '@/services/fileHistory';
import { requirePermission } from '@/lib/rbac';

// GET /api/documents/versions/compare - Compare two versions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const version1Id = searchParams.get('version1Id');
    const version2Id = searchParams.get('version2Id');

    if (!version1Id || !version2Id) {
      return NextResponse.json(
        { error: 'Missing required parameters: version1Id, version2Id' },
        { status: 400 }
      );
    }

    // Check permission to read document versions
    const hasPermission = await requirePermission(
      session.user.id,
      'documents:read',
      session.user.firmId
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions to compare document versions' },
        { status: 403 }
      );
    }

    const comparison = await fileHistoryService.compareVersions(version1Id, version2Id);

    return NextResponse.json({
      success: true,
      data: comparison,
      message: 'Version comparison completed successfully'
    });

  } catch (error) {
    console.error('Error comparing document versions:', error);
    return NextResponse.json(
      { error: 'Failed to compare document versions' },
      { status: 500 }
    );
  }
}
