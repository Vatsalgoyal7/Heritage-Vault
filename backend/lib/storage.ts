export interface UploadResult {
  filename: string;
  path: string;       // telegram file_id (use this to re-download)
  url: string;
  size: number;
  mimeType: string;
  telegramFileId?: string;
}

/**
 * Upload file to Telegram Bot storage (free, up to 50MB per file)
 */
export async function uploadFile(
  file: File | Buffer,
  options: {
    filename?: string;
    folder?: string;
    mimeType?: string;
    originalName?: string;
  } = {}
): Promise<UploadResult> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_STORAGE_CHAT_ID || '';

  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured in environment variables.');
  }
  if (!TELEGRAM_CHAT_ID) {
    throw new Error('TELEGRAM_STORAGE_CHAT_ID is not configured in environment variables.');
  }

  // Convert to ArrayBuffer for Blob (avoids SharedArrayBuffer type issue)
  let arrayBuf: ArrayBuffer;
  let mimeType: string;
  let originalName: string;

  if (file instanceof File) {
    arrayBuf = await file.arrayBuffer();
    mimeType = file.type || options.mimeType || 'application/octet-stream';
    originalName = options.originalName || file.name || `file_${Date.now()}`;
  } else {
    // Buffer.slice returns a Buffer with a concrete ArrayBuffer
    arrayBuf = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    mimeType = options.mimeType || 'application/octet-stream';
    originalName = options.originalName || options.filename || `file_${Date.now()}`;
  }

  const byteLength = arrayBuf.byteLength;

  // Use native FormData + Blob (available in Next.js 14 / Node 18+)
  const blob = new Blob([arrayBuf], { type: mimeType });

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('document', blob, originalName);
  if (options.folder) {
    formData.append('caption', `📁 ${options.folder} | ${originalName}`);
  }

  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;

  const response = await fetch(telegramApiUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Telegram upload failed (${response.status}): ${err}`);
  }

  const data = (await response.json()) as any;

  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }

  const fileId: string = data.result?.document?.file_id || '';
  const fileSize: number = data.result?.document?.file_size || byteLength;

  // Get a fresh download URL (valid ~1 hour; re-fetch via file_id later)
  let fileUrl = '';
  try {
    const pathRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const pathData = (await pathRes.json()) as any;
    if (pathData.ok && pathData.result?.file_path) {
      fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${pathData.result.file_path}`;
    }
  } catch {
    // file_id is enough to re-download later
  }

  return {
    filename: originalName,
    path: fileId,
    url: fileUrl || `https://t.me/heritagevault_bot`,
    size: fileSize,
    mimeType,
    telegramFileId: fileId,
  };
}

/**
 * Get a fresh download URL for a Telegram file using its file_id
 */
export async function getTelegramFileUrl(fileId: string): Promise<string | null> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!TELEGRAM_BOT_TOKEN || !fileId) return null;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const data = (await res.json()) as any;
    if (data.ok && data.result?.file_path) {
      return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Validate file type and size (50MB Telegram limit)
 */
export function validateFile(
  file: File,
  maxSizeMB = 50
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'video/mp4',
    'audio/mpeg',
    'audio/mp4',
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}

/** Telegram doesn't support deletion — no-op stub */
export async function deleteFile(_filePath: string): Promise<void> {
  console.log('Note: Telegram file deletion not supported via Bot API');
}

/** Cleanup stub (no-op for Telegram) */
export async function cleanupOldFiles(_daysOld = 30): Promise<number> {
  return 0;
}