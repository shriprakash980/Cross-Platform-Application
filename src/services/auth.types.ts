import { UserCredential } from 'firebase/auth';

export interface IAuthService {
  /**
   * Initiates Google authentication using the platform-appropriate method:
   * - Web: signInWithPopup with GoogleAuthProvider (with hd hint)
   * - Native: expo-auth-session Google provider to get idToken -> signInWithCredential
   */
  signInWithGoogle(): Promise<UserCredential>;

  /**
   * Signs the user out from Firebase Auth
   */
  signOut(): Promise<void>;
}
