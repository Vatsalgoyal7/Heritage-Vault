import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { encryptData } from '@/lib/encryption';
import { uploadFile, validateFile } from '@/lib/storage';
import { dbManager } from '@/lib/dbManager';

export async function POST(req: NextRequest) {
  try {
    // Authentication — accept both JWT and firebase_ tokens
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    // For firebase tokens, extract user from localStorage is client-side;
    // here we just verify the token exists and decode if possible
    let userId = 'unknown';
    let userName = 'User';

    if (token) {
      try {
        const payload = verifyToken(token);
        if (payload) {
          userId = payload.userId;
          userName = payload.name || payload.email || 'User';
        }
      } catch {
        // Firebase tokens are not JWT-verifiable server-side here
        // Extract userId from token header x-user-id if provided
        const headerUserId = req.headers.get('x-user-id');
        if (headerUserId) {
          userId = headerUserId;
        }
      }
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const subCategory = formData.get('subCategory') as string;
    const notes = formData.get('notes') as string;
    const tags = formData.get('tags') as string;
    const assignedNominees = formData.get('assignedNominees') as string;
    const userIdFromForm = formData.get('userId') as string;

    // Use userId from form if token was a firebase token
    if (userIdFromForm) {
      userId = userIdFromForm;
    }

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'File, title, and category are required' },
        { status: 400 }
      );
    }

    // Validate file (50MB limit for Telegram)
    const validation = validateFile(file, 50);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to Telegram Bot storage
    const uploadResult = await uploadFile(file, {
      folder: `heritage-vault/${userId}`,
      originalName: file.name,
    });

    // Encrypt file metadata
    const fileMetadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      telegramFileId: uploadResult.telegramFileId || uploadResult.path,
      url: uploadResult.url,
    };

    const encryptedMetadata = encryptData(JSON.stringify(fileMetadata));

    // Save vault item via dbManager (works with or without MongoDB)
    const vaultItem = await dbManager.saveVaultItem({
      userId,
      title,
      category,
      subCategory: subCategory || undefined,
      ciphertext: encryptedMetadata.ciphertext,
      iv: encryptedMetadata.iv,
      authTag: encryptedMetadata.authTag,
      originalFileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      cloudinaryUrl: uploadResult.url,
      telegramFileId: uploadResult.telegramFileId || uploadResult.path,
      notes: notes || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      assignedNominees: assignedNominees ? assignedNominees.split(',') : [],
    });

    // Audit log
    await dbManager.saveAuditLog({
      ownerId: userId,
      action: 'FILE_UPLOAD',
      performedBy: userName,
      performedById: userId,
      details: `File "${file.name}" uploaded to Telegram storage. Category: ${category}.`,
      status: 'Secured',
    });

    const itemId = (vaultItem as any)._id || (vaultItem as any).id;

    return NextResponse.json({
      message: 'File uploaded and encrypted successfully',
      item: {
        id: itemId,
        title,
        category,
        originalFileName: file.name,
        fileSize: file.size,
        url: uploadResult.url,
        telegramFileId: uploadResult.telegramFileId,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}