import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, UserCredential } from 'firebase/auth';
import { auth } from './firebase.web';
import { IAuthService } from './auth.types';
import { ALLOWED_DOMAIN } from '../constants/config';

/**
 * Web Authentication Service
 * Uses GoogleAuthProvider with signInWithPopup.
 * Passes the `hd` (hosted domain) parameter as a UX convenience hint only.
 * IMPORTANT: hd is NEVER relied upon for security; domain enforcement is validated
 * strictly post-auth in our application logic and server-side in Firestore rules.
 */
class WebAuthService implements IAuthService {
  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();

    // UX hint only - Google pre-filters account picker to the domain if possible
    provider.setCustomParameters({
      hd: ALLOWED_DOMAIN,
      prompt: 'select_account',
    });

    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}

export const authService: IAuthService = new WebAuthService();
export default authService;
