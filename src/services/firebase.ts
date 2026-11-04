import { Platform } from 'react-native';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

// Conditionally require platform implementation for universal environments
let appInstance: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const web = require('./firebase.web');
  appInstance = web.app;
  authInstance = web.auth;
  dbInstance = web.db;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const native = require('./firebase.native');
  appInstance = native.app;
  authInstance = native.auth;
  dbInstance = native.db;
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
