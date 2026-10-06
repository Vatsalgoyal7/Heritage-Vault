import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { dbManager } from '@/lib/dbManager';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await dbManager.getUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Create new user
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'user_' + Date.now(),
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      displayName: name || cleanEmail.split('@')[0],
      passwordHash,
      isEmailVerified: true,
      trustScore: 80,
      createdAt: new Date().toISOString(),
    };

    const savedUser = await dbManager.saveUser(newUser);

    // Write Audit Log
    await dbManager.saveAuditLog({
      ownerId: savedUser.id || savedUser._id,
      action: 'USER_REGISTERED',
      performedBy: savedUser.name,
      performedById: savedUser.id || savedUser._id,
      details: `New account created for ${savedUser.email} with AES-256 legacy vault.`,
      status: 'Secured',
    });

    // Generate token
    const token = generateToken({
      userId: savedUser.id || savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      role: 'user',
    });

    return NextResponse.json({
      message: 'Registration successful',
      token,
      user: {
        id: savedUser.id || savedUser._id,
        name: savedUser.name,
        displayName: savedUser.displayName || savedUser.name,
        email: savedUser.email,
        trustScore: savedUser.trustScore || 80,
      },
    });
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}