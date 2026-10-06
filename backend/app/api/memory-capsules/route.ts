import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { encryptData } from '@/lib/encryption';
import { dbManager } from '@/lib/dbManager';

export const dynamic = 'force-dynamic';

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

    const capsules = await dbManager.getMemoryCapsules(payload.userId);
    return NextResponse.json({ capsules });
  } catch (error: any) {
    console.error('Memory Capsules GET Error:', error);
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

    const { title, type, message, recipient, deliverOn } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const encrypted = encryptData(message);

    const newCapsule = {
      id: 'capsule_' + Date.now(),
      userId: payload.userId,
      title,
      type: type || 'letter',
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      deliverOn: deliverOn || 'on_inactivity_protocol',
      recipient: recipient || 'Family Member',
      isDelivered: false,
      status: 'Sealed & Encrypted',
      createdAt: new Date().toISOString(),
    };

    const savedCapsule = await dbManager.saveMemoryCapsule(newCapsule);

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'MEMORY_CAPSULE_CREATED',
      performedBy: payload.name || 'Vault Owner',
      performedById: payload.userId,
      details: `Created sealed memory capsule "${title}" for ${recipient}.`,
      status: 'Secured',
    });

    return NextResponse.json({
      message: 'Memory Capsule created and sealed successfully',
      capsule: savedCapsule,
    });
  } catch (error: any) {
    console.error('Memory Capsules POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
