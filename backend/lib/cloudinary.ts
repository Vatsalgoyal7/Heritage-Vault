import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: string;
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'auto' | 'raw';
    transformation?: string;
  } = {}
): Promise<UploadResult> {
  try {
    const {
      folder = 'heritage-vault',
      resourceType = 'auto',
      transformation = undefined,
    } = options;

    // Convert File to Buffer if needed
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation,
          access_mode: 'authenticated', // Require signed URL for access
          type: 'upload',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              publicId: result?.public_id || '',
              url: result?.url || '',
              secureUrl: result?.secure_url || '',
              format: result?.format || '',
              bytes: result?.bytes || 0,
              width: result?.width,
              height: result?.height,
              resourceType: result?.resource_type || 'raw',
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Generate signed URL for authenticated access
 */
export function generateSignedUrl(publicId: string, expiresInSeconds: number = 3600): string {
  try {
    return cloudinary.url(publicId, {
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
      secure: true,
    });
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw new Error('Failed to generate signed URL');
  }
}

/**
 * Get file info from Cloudinary
 */
export async function getFileInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary resource error:', error);
    throw new Error('Failed to get file info');
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