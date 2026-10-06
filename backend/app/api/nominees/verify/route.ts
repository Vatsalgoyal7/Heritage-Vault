import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Nominee } from '@/models/Nominee';
import bcrypt from 'bcryptjs';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectToDatabase();

    const nominee = await Nominee.findOne({ email: email.toLowerCase() });
    if (!nominee) {
      return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
    }

    if (nominee.isVerified) {
      return NextResponse.json({ error: 'Nominee already verified' }, { status: 400 });
    }

    if (!nominee.otpHash) {
      return NextResponse.json({ error: 'No OTP hash found' }, { status: 400 });
    }

    const isOtpValid = await bcrypt.compare(otp, nominee.otpHash);
    if (!isOtpValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    nominee.isVerified = true;
    nominee.otpHash = undefined;
    await nominee.save();

    await AuditLog.create({
      ownerId: nominee.ownerId,
      action: 'NOMINEE_VERIFIED',
      performedBy: 'nominee',
      performedById: nominee._id.toString(),
      details: { nomineeName: nominee.name, nomineeEmail: nominee.email },
    });

    return NextResponse.json({
      message: 'Nominee verified successfully',
      nominee: {
        id: nominee._id,
        name: nominee.name,
        email: nominee.email,
        relation: nominee.relation,
        isVerified: true,
      },
    });
  } catch (error: any) {
    console.error('Nominee Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}