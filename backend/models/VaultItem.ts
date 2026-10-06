import mongoose, { Schema, Document, Model } from 'mongoose';

export type VaultCategory =
  | 'documents'
  | 'credentials'
  | 'links_accounts'
  | 'business'
  | 'intellectual_property'
  | 'cloud_storage'
  | 'evidence'
  | 'other';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: VaultCategory;
  subCategory?: string;
  ciphertext: string; // Base64 encrypted content or file ciphertext
  iv: string; // Hex IV
  authTag: string; // Hex authTag
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  cloudinaryUrl?: string;
  notes?: string;
  tags: string[];
  assignedNominees: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const VaultItemSchema: Schema<IVaultItem> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'documents',
        'credentials',
        'links_accounts',
        'business',
        'intellectual_property',
        'cloud_storage',
        'evidence',
        'other',
      ],
      required: true,
    },
    subCategory: { type: String },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    originalFileName: { type: String },
    mimeType: { type: String },
    fileSize: { type: Number },
    cloudinaryUrl: { type: String },
    notes: { type: String },
    tags: [{ type: String }],
    assignedNominees: [{ type: Schema.Types.ObjectId, ref: 'Nominee' }],
  },
  { timestamps: true }
);

export const VaultItem: Model<IVaultItem> =
  mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
