import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INominee extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  relation: string;
  phone?: string;
  isVerified: boolean;
  otpHash?: string;
  assignedFiles: mongoose.Types.ObjectId[];
  assignedCategories: string[];
  accessLevel: 'view' | 'download';
  hasEmergencyAccess: boolean;
  accessExpiresAt?: Date;
  createdAt: Date;
}

const NomineeSchema: Schema<INominee> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    relation: { type: String, required: true },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String },
    assignedFiles: [{ type: Schema.Types.ObjectId, ref: 'VaultItem' }],
    assignedCategories: [{ type: String }],
    accessLevel: { type: String, enum: ['view', 'download'], default: 'view' },
    hasEmergencyAccess: { type: Boolean, default: false },
    accessExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Nominee: Model<INominee> =
  mongoose.models.Nominee || mongoose.model<INominee>('Nominee', NomineeSchema);
