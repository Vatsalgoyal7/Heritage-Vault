import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  otpHash?: string;
  otpExpiry?: Date;
  lastActive: Date;
  lastLoginIp?: string;
  registeredDevices: Array<{ deviceId: string; userAgent: string; lastSeen: Date }>;
  remindersSent: number; // 0, 1, 2, 3
  accessUnlocked: boolean;
  trustScore: number;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    otpHash: { type: String },
    otpExpiry: { type: Date },
    lastActive: { type: Date, default: Date.now },
    lastLoginIp: { type: String },
    registeredDevices: [
      {
        deviceId: { type: String },
        userAgent: { type: String },
        lastSeen: { type: Date, default: Date.now },
      },
    ],
    remindersSent: { type: Number, default: 0 },
    accessUnlocked: { type: Boolean, default: false },
    trustScore: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
