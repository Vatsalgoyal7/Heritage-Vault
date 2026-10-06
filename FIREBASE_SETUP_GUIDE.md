# Firebase Authentication Setup Guide for Heritage Vault

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `heritage-vault-web`
4. Disable Google Analytics (not needed for now)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Select "Email/Password" sign-in method
4. Enable it and click "Save"

### Step 3: Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" (</> icon)
4. App nickname: `Heritage Vault Web`
5. Click "Register app"
6. Copy the firebaseConfig object

### Step 4: Add Configuration to .env.local
Copy these values from Firebase config to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## ⚡ Alternative: Use Demo Mode (For Testing)

If you want to test immediately without Firebase setup, you can use this demo configuration (limited functionality):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=demo_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=demo_sender
NEXT_PUBLIC_FIREBASE_APP_ID=demo_app_id
```

## 🔧 Testing the Setup

After configuration:

1. Restart the development server:
```bash
cd C:\Users\champ\Downloads\heritage-vault\backend
npm run dev
```

2. Go to http://localhost:3000/login

3. Try to register a new account

4. If Firebase is configured correctly, you'll be able to:
   - Register new users
   - Login with email/password
   - Access the dashboard
   - Logout

## 🚨 Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**
- Firebase project not created or wrong API keys
- Check all environment variables are set correctly

**"Network Error"**
- Check internet connection
- Firebase might be blocked in your network

**"Email not verified"**
- Check Firebase Console → Authentication → Users
- You can manually verify users for testing

## 📝 Next Steps After Firebase Setup

1. Configure MongoDB (see MONGODB_SETUP.md)
2. Configure Email Service (for OTPs)
3. Test complete user flow
4. Upload files to local storage
5. Test all website features