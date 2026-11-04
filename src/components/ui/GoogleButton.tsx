import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { THEME } from '../../constants/theme';

interface GoogleButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
}

/**
 * Official Google G Logo SVG rendered via standard web SVG or vector data
 */
const GoogleLogo = () => {
  if (Platform.OS === 'web') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block' }}>
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.25 21.36 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.26C.46 8.18 0 10.02 0 12s.46 3.82 1.26 5.41l4.02-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
        />
      </svg>
    );
  }

  // Native fallback icon representation
  return (
    <View style={styles.nativeGoogleBadge}>
      <Text style={styles.nativeGoogleText}>G</Text>
    </View>
  );
};

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
  text = 'Continue with Google',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ pressed }) => [
        styles.button,
        isHovered && styles.buttonHovered,
        isFocused && styles.buttonFocused,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#1F2937" style={styles.spinner} />
        ) : (
          <View style={styles.logoContainer}>
            <GoogleLogo />
          </View>
        )}
        <Text style={[styles.text, isDisabled && styles.textDisabled]}>
          {isLoading ? 'Verifying domain...' : text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 52, // >= 44px touch target requirement
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...Platform.select({
      web: {
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        outlineWidth: 0,
        outlineStyle: 'none',
      } as any,
    }),
  },
  buttonHovered: {
    backgroundColor: '#F8FAFC',
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  buttonFocused: {
    borderColor: THEME.colors.violet,
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 3px rgba(124, 92, 255, 0.4)',
      } as any,
    }),
  },
  buttonPressed: {
    backgroundColor: '#F1F5F9',
    transform: [{ translateY: 1 }],
  },
  buttonDisabled: {
    opacity: 0.75,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      } as any,
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  spinner: {
    marginRight: 12,
  },
  text: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textDisabled: {
    color: '#64748B',
  },
  nativeGoogleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeGoogleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default GoogleButton;
