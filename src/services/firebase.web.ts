import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants/config';

// Initialize or reuse Firebase App instance
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

// On web, Firebase Auth utilizes indexedDB / localStorage persistence automatically
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore
export const db: Firestore = getFirestore(app);
