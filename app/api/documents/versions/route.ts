// FILE: /app/api/documents/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fileHistoryService from '@/services/fileHistory';
import { requirePermission } from '@/lib/rbac';

// POST /api/documents/versions - Create new version
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, newFilePath, newFileName, changeNotes } = await req.json();

    if (!documentId || !newFilePath || !newFileName) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId, newFilePath, newFileName' },
        { status: 400 }
      );
    }

    // Check permission to create versions
    const hasPermission = await requirePermission(
      session.user.id,
      'documents:version',
      session.user.firmId
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create document versions' },
        { status: 403 }
      );
    }

    const newVersion = await fileHistoryService.createVersion(
      documentId,
      newFilePath,
      newFileName,
      session.user.id,
      changeNotes
    );

    return NextResponse.json({
      success: true,
      data: newVersion,
      message: 'Document version created successfully'
    });

  } catch (error) {
    console.error('Error creating document version:', error);
    return NextResponse.json(
      { error: 'Failed to create document version' },
      { status: 500 }
    );
  }
}

// GET /api/documents/versions - Get version history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Missing documentId parameter' },
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
        { error: 'Insufficient permissions to read document versions' },
        { status: 403 }
      );
    }

    const versionHistory = await fileHistoryService.getVersionHistory(documentId);

    return NextResponse.json({
      success: true,
      data: versionHistory,
      message: 'Version history retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving version history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve version history' },
      { status: 500 }
    );
  }
}
