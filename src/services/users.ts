import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import { UserProfile, UserRole } from '../types';

const USERS_COLLECTION = 'users';

/**
 * Synchronizes the Firebase Auth user into the Firestore users collection.
 * On first valid login: creates doc with role "user", createdAt, and lastLoginAt.
 * On subsequent logins: preserves the existing role & createdAt, while updating lastLoginAt.
 */
export async function syncUserProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const nowIso = new Date().toISOString();

  if (!userSnap.exists()) {
    // First-time login: default role is "user"
    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || 'HB+ Team Member',
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      role: 'user',
      createdAt: nowIso,
      lastLoginAt: nowIso,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    // Existing user: update last login and sync name/photo
    const existingData = userSnap.data() as UserProfile;

    const updatedProfile: UserProfile = {
      ...existingData,
      name: firebaseUser.displayName || existingData.name,
      photoURL: firebaseUser.photoURL || existingData.photoURL,
      lastLoginAt: nowIso,
    };

    await updateDoc(userRef, {
      name: updatedProfile.name,
      photoURL: updatedProfile.photoURL,
      lastLoginAt: nowIso,
    });

    return updatedProfile;
  }
}

/**
 * Fetches the user profile for a given uid.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as UserProfile;
}

/**
 * Fetches all users from Firestore. (Admin-only operation)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, orderBy('lastLoginAt', 'desc'));
  const querySnapshot = await getDocs(q);

  const users: UserProfile[] = [];
  querySnapshot.forEach((document) => {
    users.push(document.data() as UserProfile);
  });

  return users;
}

/**
 * Updates a user's role ("admin" | "user"). (Admin-only operation)
 */
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, targetUid);
  await updateDoc(userRef, {
    role: newRole,
  });
}
