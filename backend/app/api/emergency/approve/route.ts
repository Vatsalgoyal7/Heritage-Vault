import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { AccessRequest } from '@/models/AccessRequest';
import { Nominee } from '@/models/Nominee';
import { User } from '@/models/User';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email';
import { AuditLog } from '@/models/AuditLog';

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

    const { requestId, action } = await req.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Request ID and action (approve/reject) are required' }, { status: 400 });
    }

    await connectToDatabase();

    const accessRequest = await AccessRequest.findById(requestId);
    if (!accessRequest) {
      return NextResponse.json({ error: 'Access request not found' }, { status: 404 });
    }

    if (accessRequest.ownerId.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Unauthorized to approve this request' }, { status: 403 });
    }

    if (accessRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    const nominee = await Nominee.findById(accessRequest.nomineeId);
    if (!nominee) {
      return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Grant temporary access (24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      nominee.hasEmergencyAccess = true;
      nominee.accessExpiresAt = expiresAt;
      await nominee.save();

      accessRequest.status = 'approved';
      accessRequest.expiresAt = expiresAt;
      await accessRequest.save();

      // Notify nominee
      await sendOTPEmail(
        nominee.email,
        '000000',
        'Emergency Access Approved - You now have 24-hour access to assigned vault items'
      );

      await AuditLog.create({
        ownerId: payload.userId,
        action: 'EMERGENCY_ACCESS_APPROVED',
        performedBy: 'user',
        performedById: payload.userId,
        details: {
          nomineeName: nominee.name,
          nomineeEmail: nominee.email,
          expiresAt,
        },
      });

      return NextResponse.json({
        message: 'Emergency access approved. Nominee notified.',
        access: {
          nomineeId: nominee._id,
          expiresAt,
        },
      });
    } else {
      // Reject request
      accessRequest.status = 'rejected';
      await accessRequest.save();

      // Notify nominee
      await sendOTPEmail(
        nominee.email,
        '000000',
        'Emergency Access Request Rejected by Owner'
      );

      await AuditLog.create({
        ownerId: payload.userId,
        action: 'EMERGENCY_ACCESS_REJECTED',
        performedBy: 'user',
        performedById: payload.userId,
        details: {
          nomineeName: nominee.name,
          nomineeEmail: nominee.email,
        },
      });

      return NextResponse.json({
        message: 'Emergency access request rejected. Nominee notified.',
      });
    }
  } catch (error: any) {
    console.error('Emergency Access Approval Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}