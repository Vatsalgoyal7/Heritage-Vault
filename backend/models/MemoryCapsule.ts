import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMemoryCapsule extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'letter' | 'audio' | 'video';
  ciphertext: string; // Base64
  iv: string;
  authTag: string;
  mediaUrl?: string;
  deliverOn: 'on_inactivity_protocol' | 'custom_date' | 'child_18th_birthday' | 'wedding_day';
  customDeliveryDate?: Date;
  recipients: Array<{ name: string; email: string; relation: string }>;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const MemoryCapsuleSchema: Schema<IMemoryCapsule> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['letter', 'audio', 'video'], required: true },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    mediaUrl: { type: String },
    deliverOn: {
      type: String,
      enum: ['on_inactivity_protocol', 'custom_date', 'child_18th_birthday', 'wedding_day'],
      default: 'on_inactivity_protocol',
    },
    customDeliveryDate: { type: Date },
    recipients: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        relation: { type: String, required: true },
      },
    ],
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const MemoryCapsule: Model<IMemoryCapsule> =
  mongoose.models.MemoryCapsule ||
  mongoose.model<IMemoryCapsule>('MemoryCapsule', MemoryCapsuleSchema);
