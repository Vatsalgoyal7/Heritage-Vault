import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { dbManager } from '@/lib/dbManager';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user from dbManager
    const user = await dbManager.getUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const userId = user.id || user._id.toString();

    // Write Audit Log
    await dbManager.saveAuditLog({
      ownerId: userId,
      action: 'USER_LOGIN',
      performedBy: user.name,
      performedById: userId,
      details: `User logged in from web client. Session token dispatched.`,
      status: 'Secured',
    });

    // Generate token
    const token = generateToken({
      userId,
      email: user.email,
      name: user.name,
      role: 'user',
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        displayName: user.displayName || user.name,
        email: user.email,
        trustScore: user.trustScore || 85,
      },
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}