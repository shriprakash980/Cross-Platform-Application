import React, { useState } from 'react';
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { THEME } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  enableTilt?: boolean; // Retained for backwards compatibility (no-op)
  glowColor?: 'violet' | 'cyan' | 'none';
  variant?: 'default' | 'elevated' | 'highlight';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glowColor = 'none',
  variant = 'default',
}) => {
  const scale = useSharedValue(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.value = withSpring(1.01, { damping: 15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getBorderColor = () => {
    if (glowColor === 'violet') return 'rgba(124, 92, 255, 0.4)';
    if (glowColor === 'cyan') return 'rgba(34, 211, 238, 0.4)';
    if (variant === 'elevated') return THEME.colors.borderMedium;
    return THEME.colors.borderSubtle;
  };

  const getGlowShadow = () => {
    if (Platform.OS !== 'web') return {};
    if (glowColor === 'violet') {
      return { boxShadow: '0 8px 32px rgba(124, 92, 255, 0.2), 0 0 0 1px rgba(124, 92, 255, 0.3)' };
    }
    if (glowColor === 'cyan') {
      return { boxShadow: '0 8px 32px rgba(34, 211, 238, 0.18), 0 0 0 1px rgba(34, 211, 238, 0.3)' };
    }
    return {
      boxShadow: isHovered
        ? '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)'
        : '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    };
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: getBorderColor(),
          backgroundColor:
            variant === 'elevated' ? THEME.colors.surfaceElevated : THEME.colors.surface,
        },
        getGlowShadow() as any,
        animatedStyle,
        style,
      ]}
      // @ts-ignore Web mouse events
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: THEME.borderRadius.xxl,
    borderWidth: 1,
    padding: THEME.spacing.lg,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'box-shadow 0.25s ease',
      } as any,
    }),
  },
});

export default GlassCard;
