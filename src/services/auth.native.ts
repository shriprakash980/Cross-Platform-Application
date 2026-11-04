import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, UserCredential } from 'firebase/auth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth } from './firebase.native';
import { IAuthService } from './auth.types';
import { ALLOWED_DOMAIN, GOOGLE_OAUTH_CONFIG } from '../constants/config';

WebBrowser.maybeCompleteAuthSession();

/**
 * Native Authentication Service (iOS / Android)
 * Uses expo-auth-session to initiate Google OAuth, obtain the idToken,
 * and authenticate against Firebase using signInWithCredential.
 */
class NativeAuthService implements IAuthService {
  async signInWithGoogle(): Promise<UserCredential> {
    const clientId = Platform.select({
      ios: GOOGLE_OAUTH_CONFIG.iosClientId || GOOGLE_OAUTH_CONFIG.webClientId,
      android: GOOGLE_OAUTH_CONFIG.androidClientId || GOOGLE_OAUTH_CONFIG.webClientId,
      default: GOOGLE_OAUTH_CONFIG.webClientId,
    });

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'hbplusaegis',
      path: 'auth',
    });

    // Google OAuth 2.0 Auth Request
    const request = new AuthSession.AuthRequest({
      clientId: clientId || 'placeholder-client-id',
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri,
      extraParams: {
        hd: ALLOWED_DOMAIN, // UX hint only
        nonce: Math.random().toString(36).substring(2, 15),
      },
    });

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params && result.params.id_token) {
      const idToken = result.params.id_token;
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential;
    } else if (result.type === 'cancel' || result.type === 'dismiss') {
      throw new Error('Sign-in cancelled by user');
    } else {
      throw new Error('Failed to retrieve authentication token from Google provider');
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}

export const authService: IAuthService = new NativeAuthService();
export default authService;
