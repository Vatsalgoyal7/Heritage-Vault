import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();

export const firebaseAuth = {
  // Google Sign-In
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return { 
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        error: null 
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return { 
        user: null, 
        error: error.message || 'Google sign-in failed' 
      };
    }
  },

  // Email/Password Registration
  register: async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name if provided
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
      
      return { 
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        error: null 
      };
    } catch (error: any) {
      console.error('Registration Error:', error);
      return { 
        user: null, 
        error: error.message || 'Registration failed' 
      };
    }
  },

  // Email/Password Login
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return { 
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        error: null 
      };
    } catch (error: any) {
      console.error('Login Error:', error);
      return { 
        user: null, 
        error: error.message || 'Login failed' 
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error('Logout Error:', error);
      return { error: error.message || 'Logout failed' };
    }
  },

  // Get Current User
  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },

  // Auth State Change Listener
  onAuthStateChange: (callback: (user: FirebaseUser | null) => void) => {
    return firebaseAuthStateChanged(auth, callback);
  },

  // Get Auth Instance
  getAuth: (): Auth => {
    return auth;
  },
};

export default auth;