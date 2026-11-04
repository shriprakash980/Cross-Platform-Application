export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string; // ISO string or timestamp representation
  lastLoginAt: string; // ISO string or timestamp representation
}

export interface SessionInfo {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified: boolean;
  domain: string;
  loginTimestamp: number;
}

export interface DomainValidationResult {
  isValid: boolean;
  errorMessage?: string;
  extractedDomain?: string;
}

export interface AuthContextState {
  user: UserProfile | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isRestoringSession: boolean;
  error: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
