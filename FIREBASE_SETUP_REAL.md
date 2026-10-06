# Firebase Authentication Setup Guide

## 🚀 Step-by-Step Firebase Setup (10 Minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" 
3. Project name: `heritage-vault-web`
4. Disable Google Analytics (not needed for now)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Build" → "Authentication"
2. Click "Get Started"
3. Select "Email/Password" sign-in method
4. Enable it and click "Save"

### Step 3: Get Configuration
1. Go to Project Settings (gear icon ⚙️)
2. Scroll down to "Your apps"
3. Click "Web" (</> icon)
4. App nickname: `Heritage Vault Web`
5. Click "Register app"
6. **IMPORTANT**: Copy the firebaseConfig object

### Step 4: Add Configuration to .env.local

Open `backend/.env.local` and replace the Firebase configuration with your actual values:

```env
# Firebase Authentication Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Step 5: Example Firebase Config
Your firebaseConfig should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-Your-Actual-API-Key",
  authDomain: "heritage-vault-web.firebaseapp.com",
  projectId: "heritage-vault-web",
  storageBucket: "heritage-vault-web.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 6: Restart Development Server
After updating .env.local, restart the server:

```bash
cd C:\Users\champ\Downloads\heritage-vault\backend
npm run dev
```

### Step 7: Test Authentication
1. Go to http://localhost:3000/login
2. Click "Sign up" to create a new account
3. Enter email and password
4. You should be able to register and login

## 🔧 Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**
- Firebase project not created or wrong API keys
- Check all environment variables are set correctly
- Make sure you copied the exact config from Firebase Console

**"Network Error"**
- Check internet connection
- Firebase might be blocked in your network
- Try disabling VPN/firewall temporarily

**"Email not verified"**
- For testing, you can manually verify users in Firebase Console
- Go to Authentication → Users
- Click on the user and select "Verify email"

## 📝 Next Steps After Firebase Setup

1. **MongoDB Setup** - Configure database for data storage
2. **Email Service** - Setup Gmail SMTP for email verification
3. **Test Complete Flow** - Register, login, and use all features
4. **Deploy** - Ready for production deployment

## 🎯 Quick Setup Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] API keys copied to .env.local
- [ ] Development server restarted
- [ ] Registration tested
- [ ] Login tested
- [ ] Dashboard accessible after login

---

**Note:** This setup is required for real authentication. The demo mode will be removed once Firebase is properly configured.