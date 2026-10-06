import mongoose from 'mongoose';
import { connectToDatabase } from './db';

// On Vercel / serverless: filesystem is read-only — only use JSON fallback in local dev
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Lazy-load fs only in local dev to avoid crashes on read-only filesystems
let fs: typeof import('fs') | null = null;
let DATA_DIR = '';
let DB_FILE = '';

if (!IS_SERVERLESS) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    DATA_DIR = path.join(process.cwd(), 'data');
    DB_FILE = path.join(DATA_DIR, 'db.json');
  } catch (e) {
    // ignore
  }
}

// Helper to ensure data directory and file exist
function ensureJsonDb() {
  if (!fs) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: 'user_demo_1',
          name: 'Demo Vault Owner',
          displayName: 'Demo Vault Owner',
          email: 'demo@example.com',
          passwordHash: '$2a$12$.3itTubO1MAmoEz1joTmSOlS4k7eZucFGFYxq6nDVMqnRdAxbJ00O', // password: demo123
          isEmailVerified: true,
          trustScore: 85,
          createdAt: new Date().toISOString(),
        },
      ],
      vaultItems: [
        {
          id: 'vault_demo_1',
          userId: 'user_demo_1',
          title: 'Ancestral Property Deed',
          category: 'documents',
          subCategory: 'Real Estate',
          ciphertext: 'Y1V2eFpIQmhjM1Z5YkhScGIyNHZQR2h2ZFdOb1lXZHBjbVJwYm1jPQ==',
          iv: '0123456789abcdef0123456789abcdef',
          authTag: 'abcdef0123456789abcdef0123456789',
          originalFileName: 'Property_Deed_2025.pdf',
          notes: 'Keep confidential - Mumbai Property',
          tags: ['property', 'legal'],
          assignedNominees: ['nominee_demo_1'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'vault_demo_2',
          userId: 'user_demo_1',
          title: 'HDFC NetBanking Credentials',
          category: 'credentials',
          subCategory: 'Banking',
          ciphertext: 'VlZOclUxcEZaM1psYVhSbFkzUnZjazF3WjNocGJtcHpiMjA9',
          iv: 'fedcba9876543210fedcba9876543210',
          authTag: '9876543210fedcba9876543210fedcba',
          originalFileName: 'bank_pass.txt',
          notes: 'Primary savings bank account access',
          tags: ['banking', 'passwords'],
          assignedNominees: ['nominee_demo_1'],
          createdAt: new Date().toISOString(),
        },
      ],
      nominees: [
        {
          id: 'nominee_demo_1',
          ownerId: 'user_demo_1',
          name: 'Rakesh Kumar',
          email: 'father@gmail.com',
          relation: 'Father',
          phone: '+91 9876543210',
          isVerified: true,
          assignedCategories: ['documents', 'credentials'],
          accessLevel: 'download',
          hasEmergencyAccess: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'nominee_demo_2',
          ownerId: 'user_demo_1',
          name: 'Sunita Kumar',
          email: 'mother@gmail.com',
          relation: 'Mother',
          phone: '+91 9876543211',
          isVerified: true,
          assignedCategories: ['evidence'],
          accessLevel: 'view',
          hasEmergencyAccess: false,
          createdAt: new Date().toISOString(),
        },
      ],
      memoryCapsules: [
        {
          id: 'capsule_demo_1',
          userId: 'user_demo_1',
          title: 'Personal Message for Family',
          type: 'letter',
          ciphertext: 'V0dWc2FXNW5JRzV2ZEdVdFpXNXZkR1ZzSUdaMWJHVjBaVzVqWlM0PQ==',
          iv: '00112233445566778899aabbccddeeff',
          authTag: 'ffeeddccbbaa99887766554433221100',
          deliverOn: 'on_inactivity_protocol',
          recipients: [{ name: 'Rakesh Kumar', email: 'father@gmail.com', relation: 'Father' }],
          isDelivered: false,
          createdAt: new Date().toISOString(),
        },
      ],
      auditLogs: [
        {
          id: 'audit_demo_1',
          ownerId: 'user_demo_1',
          action: 'USER_REGISTERED',
          performedBy: 'user',
          performedById: 'user_demo_1',
          details: 'Account created with AES-256 vault protection.',
          ip: '127.0.0.1',
          status: 'Secured',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'audit_demo_2',
          ownerId: 'user_demo_1',
          action: 'NOMINEE_VERIFIED',
          performedBy: 'Rakesh Kumar (Father)',
          performedById: 'nominee_demo_1',
          details: 'Nominee confirmed email address via OTP.',
          ip: '127.0.0.1',
          status: 'Verified',
          timestamp: new Date().toISOString(),
        },
      ],
      accessRequests: [
        {
          id: 'request_demo_1',
          nomineeId: 'nominee_demo_1',
          ownerId: 'user_demo_1',
          nomineeName: 'Rakesh Kumar',
          email: 'father@gmail.com',
          relation: 'Father',
          reason: 'Sudden hospital admission. Requires access to health insurance and property deeds.',
          status: 'pending',
          requestedAt: new Date().toISOString(),
          expiresAt: '24 Hours after approval',
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readJsonDb() {
  if (!fs || !DB_FILE) return { users: [], vaultItems: [], nominees: [], memoryCapsules: [], auditLogs: [], accessRequests: [] };
  ensureJsonDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON DB, reinitializing:', error);
    ensureJsonDb();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  }
}

function writeJsonDb(data: any) {
  if (!fs || !DB_FILE) return;
  ensureJsonDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export const dbManager = {
  // Users
  getUsers: async () => {
    const conn = await connectToDatabase();
    if (conn) {
      const { User } = await import('@/models/User');
      return await User.find({});
    }
    const db = readJsonDb();
    return db.users || [];
  },

  getUserByEmail: async (email: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { User } = await import('@/models/User');
      return await User.findOne({ email: email.toLowerCase() });
    }
    const db = readJsonDb();
    return (db.users || []).find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById: async (id: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { User } = await import('@/models/User');
      if (mongoose.Types.ObjectId.isValid(id)) {
        return await User.findById(id);
      }
    }
    const db = readJsonDb();
    return (db.users || []).find((u: any) => u.id === id || u._id === id) || null;
  },

  saveUser: async (user: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { User } = await import('@/models/User');
      if (user._id || user.id) {
        return await User.findByIdAndUpdate(user._id || user.id, user, { new: true, upsert: true });
      }
      return await User.create(user);
    }
    const db = readJsonDb();
    if (!db.users) db.users = [];
    const index = db.users.findIndex((u: any) => u.id === user.id || u.email === user.email);
    if (index >= 0) {
      db.users[index] = { ...db.users[index], ...user };
    } else {
      if (!user.id) user.id = 'user_' + Date.now();
      db.users.push(user);
    }
    writeJsonDb(db);
    return user;
  },

  // Vault Items
  getVaultItems: async (userId: string, category?: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { VaultItem } = await import('@/models/VaultItem');
      const query: any = { userId };
      if (category && category !== 'all') query.category = category;
      return await VaultItem.find(query).sort({ createdAt: -1 });
    }
    const db = readJsonDb();
    let items = (db.vaultItems || []).filter((item: any) => item.userId === userId || !userId);
    if (category && category !== 'all') {
      items = items.filter((item: any) => item.category === category);
    }
    return items;
  },

  getVaultItemById: async (id: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { VaultItem } = await import('@/models/VaultItem');
      if (mongoose.Types.ObjectId.isValid(id)) {
        return await VaultItem.findById(id);
      }
    }
    const db = readJsonDb();
    return (db.vaultItems || []).find((item: any) => item.id === id || item._id === id) || null;
  },

  saveVaultItem: async (item: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { VaultItem } = await import('@/models/VaultItem');
      return await VaultItem.create(item);
    }
    const db = readJsonDb();
    if (!db.vaultItems) db.vaultItems = [];
    if (!item.id) item.id = 'vault_' + Date.now();
    if (!item.createdAt) item.createdAt = new Date().toISOString();
    db.vaultItems.unshift(item);
    writeJsonDb(db);
    return item;
  },

  deleteVaultItem: async (id: string, userId: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { VaultItem } = await import('@/models/VaultItem');
      return await VaultItem.deleteOne({ _id: id, userId });
    }
    const db = readJsonDb();
    if (db.vaultItems) {
      db.vaultItems = db.vaultItems.filter((i: any) => !( (i.id === id || i._id === id) && (i.userId === userId || !userId) ));
      writeJsonDb(db);
    }
    return true;
  },

  // Nominees
  getNominees: async (ownerId: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { Nominee } = await import('@/models/Nominee');
      return await Nominee.find({ ownerId }).sort({ createdAt: -1 });
    }
    const db = readJsonDb();
    return (db.nominees || []).filter((n: any) => n.ownerId === ownerId || !ownerId);
  },

  getNomineeByEmail: async (email: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { Nominee } = await import('@/models/Nominee');
      return await Nominee.findOne({ email: email.toLowerCase() });
    }
    const db = readJsonDb();
    return (db.nominees || []).find((n: any) => n.email.toLowerCase() === email.toLowerCase()) || null;
  },

  saveNominee: async (nominee: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { Nominee } = await import('@/models/Nominee');
      return await Nominee.create(nominee);
    }
    const db = readJsonDb();
    if (!db.nominees) db.nominees = [];
    if (!nominee.id) nominee.id = 'nominee_' + Date.now();
    if (!nominee.createdAt) nominee.createdAt = new Date().toISOString();
    const index = db.nominees.findIndex((n: any) => n.id === nominee.id || n.email === nominee.email);
    if (index >= 0) {
      db.nominees[index] = { ...db.nominees[index], ...nominee };
    } else {
      db.nominees.unshift(nominee);
    }
    writeJsonDb(db);
    return nominee;
  },

  deleteNominee: async (id: string, ownerId: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { Nominee } = await import('@/models/Nominee');
      return await Nominee.deleteOne({ _id: id, ownerId });
    }
    const db = readJsonDb();
    if (db.nominees) {
      db.nominees = db.nominees.filter((n: any) => !( (n.id === id || n._id === id) && (n.ownerId === ownerId || !ownerId) ));
      writeJsonDb(db);
    }
    return true;
  },

  // Memory Capsules
  getMemoryCapsules: async (userId: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { MemoryCapsule } = await import('@/models/MemoryCapsule');
      return await MemoryCapsule.find({ userId }).sort({ createdAt: -1 });
    }
    const db = readJsonDb();
    return (db.memoryCapsules || []).filter((c: any) => c.userId === userId || !userId);
  },

  saveMemoryCapsule: async (capsule: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { MemoryCapsule } = await import('@/models/MemoryCapsule');
      return await MemoryCapsule.create(capsule);
    }
    const db = readJsonDb();
    if (!db.memoryCapsules) db.memoryCapsules = [];
    if (!capsule.id) capsule.id = 'capsule_' + Date.now();
    if (!capsule.createdAt) capsule.createdAt = new Date().toISOString();
    db.memoryCapsules.unshift(capsule);
    writeJsonDb(db);
    return capsule;
  },

  // Audit Logs
  getAuditLogs: async (ownerId: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { AuditLog } = await import('@/models/AuditLog');
      return await AuditLog.find({ ownerId }).sort({ createdAt: -1 });
    }
    const db = readJsonDb();
    return (db.auditLogs || []).filter((l: any) => l.ownerId === ownerId || !ownerId);
  },

  saveAuditLog: async (log: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { AuditLog } = await import('@/models/AuditLog');
      return await AuditLog.create(log);
    }
    const db = readJsonDb();
    if (!db.auditLogs) db.auditLogs = [];
    if (!log.id) log.id = 'audit_' + Date.now();
    if (!log.timestamp) log.timestamp = new Date().toISOString();
    db.auditLogs.unshift(log);
    writeJsonDb(db);
    return log;
  },

  // Emergency Access Requests
  getEmergencyRequests: async (ownerId?: string) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { AccessRequest } = await import('@/models/AccessRequest');
      const query = ownerId ? { ownerId } : {};
      return await AccessRequest.find(query).sort({ requestedAt: -1 });
    }
    const db = readJsonDb();
    if (ownerId) {
      return (db.accessRequests || []).filter((r: any) => r.ownerId === ownerId);
    }
    return db.accessRequests || [];
  },

  saveEmergencyRequest: async (req: any) => {
    const conn = await connectToDatabase();
    if (conn) {
      const { AccessRequest } = await import('@/models/AccessRequest');
      return await AccessRequest.create(req);
    }
    const db = readJsonDb();
    if (!db.accessRequests) db.accessRequests = [];
    if (!req.id) req.id = 'request_' + Date.now();
    if (!req.requestedAt) req.requestedAt = new Date().toISOString();
    const index = db.accessRequests.findIndex((r: any) => r.id === req.id);
    if (index >= 0) {
      db.accessRequests[index] = { ...db.accessRequests[index], ...req };
    } else {
      db.accessRequests.unshift(req);
    }
    writeJsonDb(db);
    return req;
  },
};
