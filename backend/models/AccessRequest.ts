import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccessRequest extends Document {
  nomineeId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  reason: string;
  ipAddress?: string;
  createdAt: Date;
}

const AccessRequestSchema: Schema<IAccessRequest> = new Schema(
  {
    nomineeId: { type: Schema.Types.ObjectId, ref: 'Nominee', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending',
    },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: { type: Date },
    expiresAt: { type: Date },
    reason: { type: String, required: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AccessRequest: Model<IAccessRequest> =
  mongoose.models.AccessRequest ||
  mongoose.model<IAccessRequest>('AccessRequest', AccessRequestSchema);
