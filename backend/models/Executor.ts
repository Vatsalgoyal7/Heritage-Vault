import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExecutor extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  relation: string;
  phone?: string;
  isVerified: boolean;
  responsibilities: string[];
  createdAt: Date;
}

const ExecutorSchema: Schema<IExecutor> = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    relation: { type: String, required: true },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    responsibilities: [{ type: String }],
  },
  { timestamps: true }
);

export const Executor: Model<IExecutor> =
  mongoose.models.Executor || mongoose.model<IExecutor>('Executor', ExecutorSchema);
