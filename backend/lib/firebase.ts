import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
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

// Lazy & safe initialization of Firebase
let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;

function getFirebaseAuthInstance(): Auth | null {
  if (firebaseAuthInstance) return firebaseAuthInstance;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || apiKey === 'your_firebase_api_key' || apiKey === 'undefined') {
    return null;
  }

  try {
    if (!getApps().length) {
      firebaseAppInstance = initializeApp(firebaseConfig);
    } else {
      firebaseAppInstance = getApp();
    }
    firebaseAuthInstance = getAuth(firebaseAppInstance);
    return firebaseAuthInstance;
  } catch (error) {
    console.warn('Firebase initialization skipped or failed:', error);
    return null;
  }
}

export const firebaseAuth = {
  // Google Sign-In
  signInWithGoogle: async () => {
    const auth = getFirebaseAuthInstance();
    if (!auth) {
      return { user: null, error: 'Firebase Auth is not configured' };
    }
    try {
      const googleProvider = new GoogleAuthProvider();
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
    const auth = getFirebaseAuthInstance();
    if (!auth) {
      return { user: null, error: 'Firebase Auth is not configured' };
    }
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
    const auth = getFirebaseAuthInstance();
    if (!auth) {
      return { user: null, error: 'Firebase Auth is not configured' };
    }
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
    const auth = getFirebaseAuthInstance();
    if (!auth) {
      return { error: null };
    }
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
    const auth = getFirebaseAuthInstance();
    return auth ? auth.currentUser : null;
  },

  // Auth State Change Listener
  onAuthStateChange: (callback: (user: FirebaseUser | null) => void) => {
    const auth = getFirebaseAuthInstance();
    if (!auth) {
      callback(null);
      return () => {};
    }
    return firebaseAuthStateChanged(auth, callback);
  },

  // Get Auth Instance
  getAuth: (): Auth | null => {
    return getFirebaseAuthInstance();
  },
};

export default getFirebaseAuthInstance();