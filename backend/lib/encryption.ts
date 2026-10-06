import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// 32-byte key fallback for development
const DEFAULT_KEY = 'e839415bc293f0194a8581e812d4a1b8c6e7f8d9a0b1c2d3e4f5a6b7c8d9e0f1';

function getMasterKey(): Buffer {
  const hexKey = process.env.MASTER_ENCRYPTION_KEY || DEFAULT_KEY;
  return Buffer.from(hexKey, 'hex');
}

export interface EncryptedData {
  ciphertext: string; // Base64
  iv: string; // Hex
  authTag: string; // Hex
}

/**
 * Encrypts raw text or binary data using AES-256-GCM
 */
export function encryptData(data: string | Buffer): EncryptedData {
  const iv = crypto.randomBytes(16);
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const inputBuffer = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  
  const encrypted = Buffer.concat([cipher.update(inputBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypts AES-256-GCM encrypted data
 */
export function decryptData(encrypted: EncryptedData): Buffer {
  const key = getMasterKey();
  const iv = Buffer.from(encrypted.iv, 'hex');
  const authTag = Buffer.from(encrypted.authTag, 'hex');
  const ciphertextBuffer = Buffer.from(encrypted.ciphertext, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertextBuffer), decipher.final()]);
  return decrypted;
}

/**
 * Generates random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
