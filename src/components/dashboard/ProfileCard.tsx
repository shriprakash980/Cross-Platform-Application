import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { UserProfile } from '../../types';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '../ui/RoleBadge';

interface ProfileCardProps {
  user: UserProfile | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <GlassCard enableTilt glowColor="violet" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-circle-outline" size={24} color={THEME.colors.violet} />
        </View>
        <Text style={styles.cardTitle}>Identity & Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{user?.name || 'HB+ Team Member'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Official Email</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Aegis Authority</Text>
          <View style={{ marginTop: 2 }}>{user?.role && <RoleBadge role={user.role} size="sm" />}</View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>{formatDate(user?.createdAt)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Security UID</Text>
          <Text style={styles.uidValue} numberOfLines={1}>
            {user?.uid || 'N/A'}
          </Text>
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
    backgroundColor: THEME.colors.violetLight,
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
  uidValue: {
    fontSize: 12,
    color: THEME.colors.cyan,
    fontFamily: 'monospace',
    maxWidth: 160,
  },
});

export default ProfileCard;
