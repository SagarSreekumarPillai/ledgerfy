// FILE: /app/api/documents/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';
import { requirePermission } from '@/lib/rbac';
import { withCurrentFirmScope } from '@/lib/scope';
import Document from '@/models/Document';
import { logAction } from '@/lib/audit';

/**
 * GET /api/documents/versions - Get version history for a document
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    await requirePermission(request, 'documents:read', async (req, user) => {
      const { searchParams } = new URL(req.url);
      const documentId = searchParams.get('documentId');

      if (!documentId) {
        return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
      }

      // Get document with firm scope
      const query = await withCurrentFirmScope({ _id: documentId });
      const document = await Document.findById(documentId);

      if (!document) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      // Get version history
      const versions = await Document.find({
        originalDocumentId: documentId
      }).sort({ version: -1 });

      return NextResponse.json({ versions });
    });

  } catch (error) {
    console.error('Document versions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document versions' },
      { status: 500 }
    );
  }
}
