import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { encryptData } from '@/lib/encryption';
import { dbManager } from '@/lib/dbManager';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    const rawItems = await dbManager.getVaultItems(payload.userId, category || undefined);

    // Sanitize output so ciphertext/keys remain secure, returning masked indicator
    const items = rawItems.map((item: any) => ({
      id: item.id || item._id,
      title: item.title,
      category: item.category,
      subCategory: item.subCategory,
      notes: item.notes,
      tags: item.tags || [],
      assignedNominees: item.assignedNominees || [],
      originalFileName: item.originalFileName,
      fileSize: item.fileSize,
      isEncrypted: true,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Vault GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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

    const { title, category, subCategory, content, notes, tags, assignedNominees } = await req.json();

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Title, category, and content are required' }, { status: 400 });
    }

    // Encrypt content using AES-256-GCM
    const encrypted = encryptData(content);

    const newItem = {
      id: 'vault_' + Date.now(),
      userId: payload.userId,
      title,
      category,
      subCategory: subCategory || undefined,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      originalFileName: 'text_secret.txt',
      fileSize: content.length,
      notes: notes || undefined,
      tags: tags || [],
      assignedNominees: assignedNominees || [],
      createdAt: new Date().toISOString(),
    };

    const savedItem = await dbManager.saveVaultItem(newItem);

    // Log Action to Audit Trail
    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'VAULT_ITEM_ENCRYPTED',
      performedBy: payload.name || 'Vault Owner',
      performedById: payload.userId,
      details: `Asset "${title}" encrypted using AES-256-GCM under category [${category}].`,
      status: 'Secured',
    });

    return NextResponse.json({
      message: 'Item securely encrypted and saved to Vault',
      item: {
        id: savedItem.id || savedItem._id,
        title: savedItem.title,
        category: savedItem.category,
        createdAt: savedItem.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Vault POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    await dbManager.deleteVaultItem(id, payload.userId);

    await dbManager.saveAuditLog({
      ownerId: payload.userId,
      action: 'VAULT_ITEM_DELETED',
      performedBy: payload.name || 'Vault Owner',
      performedById: payload.userId,
      details: `Vault item ID ${id} deleted from vault.`,
      status: 'Removed',
    });

    return NextResponse.json({ message: 'Vault item deleted' });
  } catch (error: any) {
    console.error('Vault DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}