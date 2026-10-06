import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { decryptData } from '@/lib/encryption';
import { dbManager } from '@/lib/dbManager';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const item = await dbManager.getVaultItemById(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Vault item not found' }, { status: 404 });
    }

    // Verify ownership or authorized nominee access
    if (item.userId !== payload.userId) {
      // Check if caller is an authorized nominee
      const nominee = await dbManager.getNomineeByEmail(payload.email);
      if (!nominee || (!nominee.hasEmergencyAccess && !nominee.isVerified)) {
        return NextResponse.json({ error: 'Forbidden: Access to this vault item is restricted.' }, { status: 403 });
      }
    }

    // Decrypt data using stored ciphertext, iv, and authTag
    const decryptedBuffer = decryptData({
      ciphertext: item.ciphertext,
      iv: item.iv,
      authTag: item.authTag,
    });

    const decryptedText = decryptedBuffer.toString('utf8');

    // Audit trail log
    await dbManager.saveAuditLog({
      ownerId: item.userId,
      action: 'VAULT_ITEM_DECRYPTED',
      performedBy: payload.name || payload.email,
      performedById: payload.userId,
      details: `Decrypted content for asset "${item.title}". Security verification passed.`,
      status: 'Secured',
    });

    return NextResponse.json({
      message: 'Vault item decrypted successfully',
      decryptedContent: decryptedText,
    });
  } catch (error: any) {
    console.error('Vault Decrypt API Error:', error);
    return NextResponse.json({ error: error.message || 'Decryption failed' }, { status: 500 });
  }
}
