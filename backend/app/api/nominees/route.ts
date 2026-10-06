import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { dbManager } from '@/lib/dbManager';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const nominees = await dbManager.getNominees(payload.userId);
    return NextResponse.json({ nominees });
  } catch (error: any) {
    console.error('Nominees GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, email, relation, phone, assignedCategories, accessLevel } = await req.json();

    if (!name || !email || !relation) {
      return NextResponse.json({ error: 'Name, email, and relation are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if nominee already exists
    const existingNominee = await dbManager.getNomineeByEmail(cleanEmail);
    if (existingNominee && existingNominee.ownerId === payload.userId) {
      return NextResponse.json({ error: 'Nominee with this email already exists' }, { status: 400 });
    }

    const newNominee = {
      id: 'nominee_' + Date.now(),
      ownerId: payload.userId,
      name,
      email: cleanEmail,
      relation,
      phone: phone || undefined,
      isVerified: true,
      assignedCategories: assignedCategories || ['documents'],
      accessLevel: accessLevel || 'view',
      hasEmergencyAccess: false,
      createdAt: new Date().toISOString(),
    };

    const savedNominee = await dbManager.saveNominee(newNominee);

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'NOMINEE_ADDED',
      performedBy: payload.name || 'Vault Owner',
      performedById: payload.userId,
      details: `Designated ${name} (${relation}) as nominee for categories: [${(assignedCategories || ['documents']).join(', ')}].`,
      status: 'Verified',
    });

    return NextResponse.json({
      message: 'Nominee added successfully',
      nominee: savedNominee,
    });
  } catch (error: any) {
    console.error('Nominees POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const nomineeId = searchParams.get('id');

    if (!nomineeId) {
      return NextResponse.json({ error: 'Nominee ID is required' }, { status: 400 });
    }

    await dbManager.deleteNominee(nomineeId, payload.userId);

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'NOMINEE_REMOVED',
      performedBy: payload.name || 'Vault Owner',
      performedById: payload.userId,
      details: `Nominee ID ${nomineeId} removed from vault inheritance settings.`,
      status: 'Removed',
    });

    return NextResponse.json({ message: 'Nominee removed successfully' });
  } catch (error: any) {
    console.error('Nominees DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}