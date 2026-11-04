import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface RoleGuardProps {
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard protects UI elements or sections based on the authenticated user's role.
 * Example: <RoleGuard role="admin"><AdminPanel /></RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ role, children, fallback }) => {
  const { user, isRestoringSession } = useAuth();

  if (isRestoringSession) {
    return null;
  }

  const hasAccess = user && (user.role === role || (role === 'user' && user.role === 'admin'));

  if (!hasAccess) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-outline" size={28} color={THEME.colors.violet} />
        </View>
        <Text style={styles.restrictedTitle}>Elevated Permissions Required</Text>
        <Text style={styles.restrictedText}>
          This section is restricted to HB+ team members with the &quot;{role}&quot; role.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  restrictedContainer: {
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.xxl,
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.borderSubtle,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: THEME.spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.violetLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  restrictedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  restrictedText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 380,
  },
});

export default RoleGuard;
