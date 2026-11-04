import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { THEME } from '../../src/constants/theme';
import { ALLOWED_DOMAIN } from '../../src/constants/config';
import { GoogleButton } from '../../src/components/ui/GoogleButton';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [emailInput, setEmailInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const {
    signInWithGoogle,
    signInWithDomainEmail,
    isLoading,
    error,
    clearError,
    loginFailedShake,
  } = useAuth();

  const shakeTranslateX = useSharedValue(0);

  // Trigger card shake animation upon unauthorized domain denial
  useEffect(() => {
    if (loginFailedShake) {
      shakeTranslateX.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [loginFailedShake, shakeTranslateX]);

  const shakeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslateX.value }],
  }));

  const handleDomainEmailSignIn = async (customEmail?: string) => {
    const targetEmail = (customEmail !== undefined ? customEmail : emailInput).trim();
    clearError();
    const success = await signInWithDomainEmail(targetEmail);
    if (success) {
      router.replace('/(app)/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    const success = await signInWithGoogle();
    if (success) {
      router.replace('/(app)/dashboard');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View style={[styles.cardWrapper, shakeAnimatedStyle]}>
        <GlassCard glowColor={error ? 'none' : 'violet'} style={styles.card}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>
              HB+ <Text style={styles.titleHighlight}>Aegis</Text>
            </Text>
            <Text style={styles.subtitle}>
              Internal portal for <Text style={styles.domainText}>@{ALLOWED_DOMAIN}</Text>
            </Text>
          </View>

          {/* Inline Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={THEME.colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Primary Action: Google Login */}
          <View style={styles.section}>
            <GoogleButton
              onPress={handleGoogleSignIn}
              isLoading={isLoading}
              text="Login with Google"
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN IN WITH DOMAIN EMAIL</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input Form */}
          <View style={styles.form}>
            <View style={[styles.inputWrapper, isInputFocused && styles.inputWrapperFocused]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={isInputFocused ? THEME.colors.cyan : THEME.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={emailInput}
                onChangeText={(text) => {
                  setEmailInput(text);
                  if (error) clearError();
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={`yourname@${ALLOWED_DOMAIN}`}
                placeholderTextColor={THEME.colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="go"
                onSubmitEditing={() => handleDomainEmailSignIn()}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={() => handleDomainEmailSignIn()}
              disabled={isLoading || !emailInput.trim()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Sign In with Domain Email</Text>
              )}
            </Pressable>
          </View>

          {/* Quick Test Chips */}
          <View style={styles.quickTestSection}>
            <Text style={styles.quickTestTitle}>Quick test:</Text>
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.chip, styles.chipValid]}
                onPress={() => {
                  setEmailInput('alex@hbplus.fit');
                  handleDomainEmailSignIn('alex@hbplus.fit');
                }}
              >
                <Ionicons name="checkmark-circle" size={12} color={THEME.colors.success} />
                <Text style={styles.chipTextValid}>alex@hbplus.fit (User)</Text>
              </Pressable>

              <Pressable
                style={[styles.chip, styles.chipAdmin]}
                onPress={() => {
                  setEmailInput('security.admin@hbplus.fit');
                  handleDomainEmailSignIn('security.admin@hbplus.fit');
                }}
              >
                <Ionicons name="shield-checkmark" size={12} color={THEME.colors.cyan} />
                <Text style={styles.chipTextAdmin}>admin@hbplus.fit (Admin)</Text>
              </Pressable>

              <Pressable
                style={[styles.chip, styles.chipInvalid]}
                onPress={() => {
                  setEmailInput('user@gmail.com');
                  handleDomainEmailSignIn('user@gmail.com');
                }}
              >
                <Ionicons name="close-circle" size={12} color={THEME.colors.danger} />
                <Text style={styles.chipTextInvalid}>gmail.com (Denied)</Text>
              </Pressable>
            </View>
          </View>

          {/* Security Footnote */}
          <View style={styles.footer}>
            <Ionicons name="lock-closed-outline" size={12} color={THEME.colors.textMuted} />
            <Text style={styles.footerText}>
              Enforced by Cloud Firestore Rules & Google Identity
            </Text>
          </View>
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
  },
  card: {
    padding: 32,
    borderRadius: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: THEME.colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: THEME.colors.violet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: THEME.colors.cyan,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  domainText: {
    color: THEME.colors.cyan,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.colors.dangerBg,
    borderColor: THEME.colors.dangerBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.borderSubtle,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  form: {
    gap: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: THEME.colors.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    ...Platform.select({
      web: {
        transition: 'border-color 0.2s ease',
      } as any,
    }),
  },
  inputWrapperFocused: {
    borderColor: THEME.colors.cyan,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  submitButton: {
    backgroundColor: THEME.colors.violet,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      } as any,
    }),
  },
  submitButtonPressed: {
    backgroundColor: '#6A4DDE',
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  quickTestSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    marginBottom: 16,
  },
  quickTestTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  chipValid: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  chipTextValid: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34D399',
  },
  chipAdmin: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderColor: 'rgba(34, 211, 238, 0.25)',
  },
  chipTextAdmin: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.cyan,
  },
  chipInvalid: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  chipTextInvalid: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F87171',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
});
