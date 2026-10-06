import { writeFile, mkdir, readFile, unlink, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure storage directory exists
export async function ensureStorageDir() {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

export interface UploadResult {
  filename: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Upload file to local storage
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    filename?: string;
    folder?: string;
  } = {}
): Promise<UploadResult> {
  await ensureStorageDir();

  const { filename, folder } = options;
  
  // Generate unique filename if not provided
  const uniqueFilename = filename || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create folder path if specified
  const folderPath = folder ? path.join(STORAGE_DIR, folder) : STORAGE_DIR;
  if (folder && !existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, uniqueFilename);
  
  // Convert File to Buffer if needed
  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  // Write file to disk
  await writeFile(filePath, buffer);

  // Generate URL path
  const relativePath = folder ? `uploads/${folder}/${uniqueFilename}` : `uploads/${uniqueFilename}`;
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${relativePath}`;

  return {
    filename: uniqueFilename,
    path: filePath,
    url,
    size: buffer.length,
    mimeType: file instanceof File ? file.type : 'application/octet-stream',
  };
}

/**
 * Delete file from local storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
}

/**
 * Get file info
 */
export async function getFileInfo(filePath: string) {
  try {
    const stats = await stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    console.error('Failed to get file info:', error);
    return null;
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // Check file size
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  // Check file type (basic validation)
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}

/**
 * Clean up old files (maintenance function)
 */
export async function cleanupOldFiles(daysOld: number = 30): Promise<number> {
  // This would be implemented for scheduled cleanup
  // For now, return 0 as placeholder
  return 0;
}