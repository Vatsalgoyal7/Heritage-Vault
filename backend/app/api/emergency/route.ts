import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { dbManager } from '@/lib/dbManager';

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

    const { reason, nomineeName, email } = await req.json();

    if (!reason) {
      return NextResponse.json({ error: 'Reason for emergency access is required' }, { status: 400 });
    }

    const newRequest = {
      id: 'request_' + Date.now(),
      ownerId: payload.userId,
      nomineeName: nomineeName || payload.name,
      email: email || payload.email,
      relation: 'Designated Nominee',
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      expiresAt: '24 Hours after approval',
    };

    const savedRequest = await dbManager.saveEmergencyRequest(newRequest);

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'EMERGENCY_ACCESS_REQUESTED',
      performedBy: nomineeName || payload.name,
      performedById: payload.userId,
      details: `Emergency access requested: "${reason}". Pending owner verification.`,
      status: 'Pending',
    });

    return NextResponse.json({
      message: 'Emergency access request submitted. Owner notified.',
      request: savedRequest,
    });
  } catch (error: any) {
    console.error('Emergency Access Request Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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

    const requests = await dbManager.getEmergencyRequests(payload.userId);
    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Emergency Access GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}