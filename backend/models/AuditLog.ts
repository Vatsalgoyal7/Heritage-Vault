import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  ownerId: mongoose.Types.ObjectId;
  action: string;
  performedBy: 'user' | 'nominee' | 'executor' | 'system';
  performedById?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    performedBy: {
      type: String,
      enum: ['user', 'nominee', 'executor', 'system'],
      required: true,
    },
    performedById: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
