// FILE: /app/api/documents/versions/restore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fileHistoryService from '@/services/fileHistory';
import { requirePermission } from '@/lib/rbac';

// POST /api/documents/versions/restore - Restore to previous version
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, versionId } = await req.json();

    if (!documentId || !versionId) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, versionId' },
        { status: 400 }
      );
    }

    // Check permission to restore versions (admin/manager only)
    const hasPermission = await requirePermission(
      session.user.id,
      'documents:restore',
      session.user.firmId
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions to restore document versions' },
        { status: 403 }
      );
    }

    const restoredDoc = await fileHistoryService.restoreToVersion(
      documentId,
      versionId,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: restoredDoc,
      message: 'Document restored to previous version successfully'
    });

  } catch (error) {
    console.error('Error restoring document version:', error);
    return NextResponse.json(
      { error: 'Failed to restore document version' },
      { status: 500 }
    );
  }
}
