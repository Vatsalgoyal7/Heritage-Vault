# Heritage Vault - Environment Setup Guide

This guide will help you configure all the required services and API keys for Heritage Vault.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Gmail account (for email sending)
- Google Gemini API key (for AI will generation)

## 🔧 Step-by-Step Setup

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier: M0)
4. Create a database user:
   - Username: `heritage_admin` (or your choice)
   - Password: Generate a strong password
5. Whitelist IP: `0.0.0.0/0` (allows all IPs for development)
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/heritage-vault?retryWrites=true&w=majority`

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard → Settings → API Keys
4. Note down:
   - Cloud Name
   - API Key
   - API Secret

### 3. Gmail SMTP Setup (for Email Sending)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Security → App Passwords
   - Select "Mail" and your device
   - Generate password (16-character code)
4. Note down the app password

### 4. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 5. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Database
MONGODB_URI=mongodb+srv://heritage_admin:YOUR_PASSWORD@cluster0.mongodb.net/heritage-vault?retryWrites=true&w=majority

# JWT Auth
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d

# Encryption Secret Key (32-bytes hex string for AES-256-GCM)
MASTER_ENCRYPTION_KEY=e839415bc293f0194a8581e812d4a1b8c6e7f8d9a0b1c2d3e4f5a6b7c8d9e0f1

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
EMAIL_FROM="Heritage Vault <noreply@heritagevault.app>"

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## 🔒 Security Notes

- **NEVER** commit `.env.local` to git
- **ALWAYS** use strong, unique passwords
- **CHANGE** JWT_SECRET and MASTER_ENCRYPTION_KEY in production
- **USE** environment-specific configs for production

## 🧪 Testing Setup

To test if everything is configured correctly:

1. **MongoDB Connection**: The app will log "MongoDB connected successfully" on startup
2. **Email Sending**: Try registering a user - OTP will be logged in console (dev mode)
3. **Cloudinary**: Try uploading a file to the vault
4. **Gemini AI**: Try generating a digital will

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check if IP is whitelisted in Atlas
- Verify username/password in connection string
- Ensure cluster is created (not just organization)

### Email Not Sending
- Verify app password is correct (16 characters)
- Check if 2FA is enabled on Google account
- Try less secure apps option if needed (not recommended)

### Cloudinary Upload Errors
- Verify API key and secret
- Check if cloud name is correct
- Ensure account is active

### Gemini API Errors
- Verify API key is valid
- Check if API credits are available
- Ensure correct API endpoint

## 📝 Additional Configuration

For production deployment, you'll need:

1. **Domain Name**: Update `NEXT_PUBLIC_APP_URL`
2. **SSL Certificates**: Configure HTTPS
3. **Rate Limiting**: Add Redis for rate limiting
4. **Monitoring**: Add error tracking (Sentry)
5. **Backup**: Configure MongoDB backups

## 🆘 Support

If you face any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure all services are active (MongoDB, Cloudinary, etc.)
4. Check firewall/network settings

---

**Next Steps**: After setup, proceed to test the authentication flow and vault functionality.
