import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { THEME } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const isRestoringSession = useAuthStore((state) => state.isRestoringSession);
  const user = useAuthStore((state) => state.user);
  const initAuthListener = useAuthStore((state) => state.initAuthListener);
  const segments = useSegments();
  const router = useRouter();

  // Initialize Firebase Auth state change subscription
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  // Route protection & automatic redirection
  useEffect(() => {
    if (isRestoringSession) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!user && inAppGroup) {
      // Direct access protection: redirect unauthenticated user to login immediately
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Authenticated users are routed straight to dashboard
      router.replace('/(app)/dashboard');
    }
  }, [user, isRestoringSession, segments, router]);

  // Splash / Loading screen during initial session restore (prevents flash of content)
  if (isRestoringSession) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" />
        <View style={styles.splashLogo}>
          <Ionicons name="shield-checkmark" size={48} color={THEME.colors.violet} />
        </View>
        <Text style={styles.splashTitle}>
          HB+ <Text style={styles.splashHighlight}>Aegis</Text>
        </Text>
        <Text style={styles.splashSubtitle}>Verifying secure session...</Text>
        <ActivityIndicator
          size="small"
          color={THEME.colors.cyan}
          style={styles.splashSpinner}
        />
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar style="light" />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: THEME.colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: THEME.colors.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  splashHighlight: {
    color: THEME.colors.cyan,
  },
  splashSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  splashSpinner: {
    transform: [{ scale: 1.1 }],
  },
});
