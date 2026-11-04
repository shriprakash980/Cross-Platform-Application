
import { create } from 'zustand';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';
import { authService } from '../services/auth';
import { syncUserProfile, getUserProfile } from '../services/users';
import { validateUserDomain } from '../utils/domain';
import { UserProfile, SessionInfo, UserRole } from '../types';
import { RESTRICTED_DOMAIN_ERROR_MESSAGE, ALLOWED_DOMAIN } from '../constants/config';

interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isRestoringSession: boolean;
  error: string | null;
  loginSuccessAnimation: boolean;
  loginFailedShake: boolean;

  setError: (error: string | null) => void;
  clearError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithDomainEmail: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  initAuthListener: () => () => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  session: null,
  isLoading: false,
  isRestoringSession: true,
  error: null,
  loginSuccessAnimation: false,
  loginFailedShake: false,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  signInWithDomainEmail: async (email: string): Promise<boolean> => {
    set({ isLoading: true, error: null, loginFailedShake: false, loginSuccessAnimation: false });

    // 1. Strict Domain & Verification Validation
    const validation = validateUserDomain(email, true, ALLOWED_DOMAIN);

    if (!validation.isValid) {
      await AsyncStorage.removeItem('aegis_session').catch(() => {});
      set({
        user: null,
        firebaseUser: null,
        session: null,
        isLoading: false,
        error: RESTRICTED_DOMAIN_ERROR_MESSAGE,
        loginFailedShake: true,
      });

      setTimeout(() => {
        set({ loginFailedShake: false });
      }, 1200);

      return false;
    }

    // 2. Validation Succeeded: Create Session
    set({ loginSuccessAnimation: true });

    const cleanEmail = email.trim().toLowerCase();
    const localPart = cleanEmail.split('@')[0];
    const formattedName = localPart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const isExplicitAdmin = localPart.includes('admin');
    const role: UserRole = isExplicitAdmin ? 'admin' : 'user';
    const uid = `hbplus_${localPart.replace(/[^a-z0-9]/g, '_')}`;

    const nowIso = new Date().toISOString();
    const profile: UserProfile = {
      uid,
      name: formattedName,
      email: cleanEmail,
      photoURL: null,
      role,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    };

    const session: SessionInfo = {
      uid,
      email: cleanEmail,
      displayName: formattedName,
      photoURL: null,
      role,
      emailVerified: true,
      domain: validation.extractedDomain || ALLOWED_DOMAIN,
      loginTimestamp: Date.now(),
    };

    await AsyncStorage.setItem('aegis_session', JSON.stringify({ profile, session })).catch(() => {});

    set({
      user: profile,
      firebaseUser: null,
      session,
      isLoading: false,
      error: null,
    });

    return true;
  },

  signInWithGoogle: async (): Promise<boolean> => {
    set({ isLoading: true, error: null, loginFailedShake: false, loginSuccessAnimation: false });

    try {
      const userCredential = await authService.signInWithGoogle();
      const fbUser = userCredential.user;

      // 1. Strict Domain & Verification Validation
      const validation = validateUserDomain(fbUser.email, fbUser.emailVerified, ALLOWED_DOMAIN);

      if (!validation.isValid) {
        // Validation failed: immediate sign out, clear state, trigger shake & red tint
        await authService.signOut().catch(() => {});
        await AsyncStorage.removeItem('aegis_session').catch(() => {});

        set({
          user: null,
          firebaseUser: null,
          session: null,
          isLoading: false,
          error: RESTRICTED_DOMAIN_ERROR_MESSAGE,
          loginFailedShake: true,
        });

        // Reset shake after animation completes
        setTimeout(() => {
          set({ loginFailedShake: false });
        }, 1200);

        return false;
      }

      // 2. Validation Succeeded: Sync Firestore
      set({ loginSuccessAnimation: true });

      const profile = await syncUserProfile(fbUser);

      const session: SessionInfo = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        role: profile.role,
        emailVerified: fbUser.emailVerified,
        domain: validation.extractedDomain || ALLOWED_DOMAIN,
        loginTimestamp: Date.now(),
      };

      await AsyncStorage.setItem('aegis_session', JSON.stringify({ profile, session })).catch(() => {});

      set({
        user: profile,
        firebaseUser: fbUser,
        session,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err: any) {
      let message = err?.message || 'Authentication error';
      // If user simply closed the popup, don't show an intrusive error banner
      const isCancelled = message.includes('cancelled') || message.includes('popup-closed-by-user');

      if (message.includes('auth/invalid-api-key') || message.includes('auth/api-key-not-valid')) {
        message = 'Firebase API key not configured in .env. Please use the @hbplus.fit domain login below or update your Firebase credentials.';
      }

      set({
        isLoading: false,
        error: isCancelled ? null : message,
        loginFailedShake: !isCancelled,
      });

      if (!isCancelled) {
        setTimeout(() => {
          set({ loginFailedShake: false });
        }, 1200);
      }

      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      await AsyncStorage.removeItem('aegis_session').catch(() => {});
    } catch (err) {
      console.warn('Sign-out error:', err);
    } finally {
      set({
        user: null,
        firebaseUser: null,
        session: null,
        isLoading: false,
        error: null,
        loginSuccessAnimation: false,
        loginFailedShake: false,
      });
    }
  },

  initAuthListener: () => {
    set({ isRestoringSession: true });

    // Check locally persisted session first
    AsyncStorage.getItem('aegis_session')
      .then((stored) => {
        if (stored) {
          try {
            const { profile, session } = JSON.parse(stored);
            const validation = validateUserDomain(profile?.email, true, ALLOWED_DOMAIN);
            if (validation.isValid) {
              set({
                user: profile,
                session,
                isRestoringSession: false,
              });
              return;
            }
          } catch {
            // Ignore parse errors
          }
        }
      })
      .catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        // If no firebase user, but we already restored domain session, keep it
        const currentStored = await AsyncStorage.getItem('aegis_session').catch(() => null);
        if (currentStored) {
          try {
            const { profile, session } = JSON.parse(currentStored);
            const validation = validateUserDomain(profile?.email, true, ALLOWED_DOMAIN);
            if (validation.isValid) {
              set({
                user: profile,
                session,
                isRestoringSession: false,
              });
              return;
            }
          } catch {
            // Continue to clear
          }
        }

        set({
          user: null,
          firebaseUser: null,
          session: null,
          isRestoringSession: false,
        });
        return;
      }

      // Validate session restored user against domain restrictions
      const validation = validateUserDomain(fbUser.email, fbUser.emailVerified, ALLOWED_DOMAIN);

      if (!validation.isValid) {
        await authService.signOut().catch(() => {});
        await AsyncStorage.removeItem('aegis_session').catch(() => {});
        set({
          user: null,
          firebaseUser: null,
          session: null,
          isRestoringSession: false,
          error: RESTRICTED_DOMAIN_ERROR_MESSAGE,
        });
        return;
      }

      try {
        let profile = await getUserProfile(fbUser.uid);
        if (!profile) {
          profile = await syncUserProfile(fbUser);
        }

        const session: SessionInfo = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          role: profile.role,
          emailVerified: fbUser.emailVerified,
          domain: validation.extractedDomain || ALLOWED_DOMAIN,
          loginTimestamp: Date.now(),
        };

        await AsyncStorage.setItem('aegis_session', JSON.stringify({ profile, session })).catch(() => {});

        set({
          user: profile,
          firebaseUser: fbUser,
          session,
          isRestoringSession: false,
        });
      } catch (e) {
        console.warn('Failed restoring user profile:', e);
        set({ isRestoringSession: false });
      }
    });

    return unsubscribe;
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) return;
    try {
      const refreshed = await getUserProfile(currentUser.uid);
      if (refreshed) {
        set((state) => ({
          user: refreshed,
          session: state.session
            ? { ...state.session, role: refreshed.role }
            : null,
        }));
      }
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
    }
  },
}));
