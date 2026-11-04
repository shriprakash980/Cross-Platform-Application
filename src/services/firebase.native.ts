import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
// @ts-ignore getReactNativePersistence exists in React Native bundle of firebase/auth
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants/config';

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

let nativeAuth: Auth;
try {
  nativeAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // If already initialized
  nativeAuth = getAuth(app);
}

export const auth: Auth = nativeAuth;
export const db: Firestore = getFirestore(app);
