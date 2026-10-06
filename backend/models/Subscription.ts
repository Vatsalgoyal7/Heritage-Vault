import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  storageLimit: number; // in MB
  features: string[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  autoRenew: boolean;
  createdAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { 
      type: String, 
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days default
    storageLimit: { type: Number, default: 500 }, // 500MB for free
    features: [{ type: String }],
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

// Plan configurations
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    storageLimit: 500, // 500MB
    maxNominees: 3,
    features: [
      'Basic vault storage',
      '3 nominees',
      'Inactivity Safety Protocol',
      'Emergency access',
      'Email support',
    ],
  },
  basic: {
    name: 'Basic',
    price: 299, // ₹299/month
    storageLimit: 5000, // 5GB
    maxNominees: 10,
    features: [
      'All Free features',
      '5GB storage',
      '10 nominees',
      'AI Will Generator',
      'Memory Capsule',
      'Priority email support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 699, // ₹699/month
    storageLimit: 20000, // 20GB
    maxNominees: 25,
    features: [
      'All Basic features',
      '20GB storage',
      '25 nominees',
      'Digital Executor',
      'Family Dashboard',
      'Phone support',
      'Priority processing',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 1999, // ₹1999/month
    storageLimit: 100000, // 100GB
    maxNominees: 100,
    features: [
      'All Premium features',
      '100GB storage',
      'Unlimited nominees',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'White-label solution',
    ],
  },
};