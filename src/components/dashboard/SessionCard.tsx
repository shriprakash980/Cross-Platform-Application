import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { SessionInfo, UserProfile } from '../../types';
import { THEME } from '../../constants/theme';
import { ALLOWED_DOMAIN } from '../../constants/config';
import { Ionicons } from '@expo/vector-icons';

interface SessionCardProps {
  session: SessionInfo | null;
  user: UserProfile | null;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, user }) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <GlassCard enableTilt glowColor="cyan" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={24} color={THEME.colors.cyan} />
        </View>
        <Text style={styles.cardTitle}>Session & Security</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Auth Provider</Text>
          <View style={styles.badgeRow}>
            <Ionicons name="logo-google" size={13} color="#FFFFFF" />
            <Text style={styles.value}>Google OAuth 2.0</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Domain Verified</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={13} color={THEME.colors.success} />
            <Text style={styles.verifiedText}>@{ALLOWED_DOMAIN}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>ID Token Protection</Text>
          <Text style={styles.secureText}>Firebase Managed</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Firestore Rules</Text>
          <Text style={styles.secureText}>Enforced Server-Side</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Last Session Sync</Text>
          <Text style={styles.value}>{formatTime(user?.lastLoginAt)}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 280,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.cyanLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  content: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: THEME.colors.successBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: THEME.colors.successBorder,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  secureText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.cyan,
  },
});

export default SessionCard;
