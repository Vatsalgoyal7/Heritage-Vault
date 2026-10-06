import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './auth';

/**
 * Authentication middleware for API routes
 * Use this to protect routes that require authentication
 */
export async function withAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide a valid token.' },
        { status: 401 }
      );
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token. Please login again.' },
        { status: 401 }
      );
    }
    
    // Attach user info to request for use in route handlers
    return { user: payload };
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Role-based authorization middleware
 */
export function withRole(allowedRoles: string[]) {
  return async (req: NextRequest) => {
    const authResult = await withAuth(req);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Error response
    }
    
    const user = authResult.user;
    if (!allowedRoles.includes(user.role || 'user')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return { user };
  };
}

/**
 * Rate limiting middleware (in-memory for demo)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(maxRequests: number = 5, windowMs: number = 60000) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return null; // Allow request
    }
    
    if (record.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    record.count++;
    return null; // Allow request
  };
}

/**
 * Error handler middleware
 */
export function withErrorHandler(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : error.message || 'An unexpected error occurred';
      
      return NextResponse.json(
        { error: message },
        { status: error.status || 500 }
      );
    }
  };
}

/**
 * Request validator middleware
 */
export function withValidation(schema: any) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      const validated = schema.parse(body);
      return { validatedBody: validated };
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
  };
}