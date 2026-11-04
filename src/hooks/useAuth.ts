import { useAuthStore } from '../store/authStore';

/**
 * Custom hook exposing authentication state and helper actions.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isRestoringSession = useAuthStore((state) => state.isRestoringSession);
  const error = useAuthStore((state) => state.error);
  const loginSuccessAnimation = useAuthStore((state) => state.loginSuccessAnimation);
  const loginFailedShake = useAuthStore((state) => state.loginFailedShake);

  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const signInWithDomainEmail = useAuthStore((state) => state.signInWithDomainEmail);
  const signOut = useAuthStore((state) => state.signOut);
  const clearError = useAuthStore((state) => state.clearError);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    session,
    isAuthenticated,
    isAdmin,
    isLoading,
    isRestoringSession,
    error,
    loginSuccessAnimation,
    loginFailedShake,
    signInWithGoogle,
    signInWithDomainEmail,
    signOut,
    clearError,
    refreshProfile,
  };
}

export default useAuth;
