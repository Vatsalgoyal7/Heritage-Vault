import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { VaultItem } from '@/models/VaultItem';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { encryptData } from '@/lib/encryption';
import { uploadFile, validateFile } from '@/lib/storage';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'File, title, and category are required' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file, 10); // 10MB limit
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await connectToDatabase();

    // Upload to local storage
    const uploadResult = await uploadFile(file, {
      folder: `heritage-vault/${payload.userId}`,
    });

    // Encrypt file metadata
    const fileMetadata = {
      originalName: file.name,
      size: file.size,
      type: file.type,
      localPath: uploadResult.path,
      url: uploadResult.url,
    };

    const encryptedMetadata = encryptData(JSON.stringify(fileMetadata));

    // Create vault item
    const vaultItem = await VaultItem.create({
      userId: payload.userId,
      title,
      category,
      subCategory: subCategory || undefined,
      ciphertext: encryptedMetadata.ciphertext,
      iv: encryptedMetadata.iv,
      authTag: encryptedMetadata.authTag,
      originalFileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      cloudinaryUrl: uploadResult.url, // Reusing field for local URL
      notes: notes || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      assignedNominees: assignedNominees ? assignedNominees.split(',') : [],
    });

    // Log action
    await AuditLog.create({
      ownerId: payload.userId,
      action: 'FILE_UPLOAD',
      performedBy: 'user',
      performedById: payload.userId,
      details: {
        title,
        category,
        fileName: file.name,
        fileSize: file.size,
        localPath: uploadResult.path,
      },
    });

    return NextResponse.json({
      message: 'File uploaded and encrypted successfully',
      item: {
        id: vaultItem._id,
        title: vaultItem.title,
        category: vaultItem.category,
        originalFileName: vaultItem.originalFileName,
        fileSize: vaultItem.fileSize,
        url: uploadResult.url,
        createdAt: vaultItem.createdAt,
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