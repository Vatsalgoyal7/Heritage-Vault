import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.otpHash || !user.otpExpiry) {
      return NextResponse.json({ error: 'Invalid request or OTP expired' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    user.trustScore = Math.min(100, user.trustScore + 20);
    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: 'user',
    });

    return NextResponse.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        trustScore: user.trustScore,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}