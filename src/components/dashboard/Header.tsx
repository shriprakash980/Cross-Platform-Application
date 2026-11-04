import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { THEME } from '../../constants/theme';
import { RoleBadge } from '../ui/RoleBadge';
import { UserProfile } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  user: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <View style={styles.header}>
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {(user?.name || user?.email || 'H')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.statusDot} />
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.greeting}>
              {getGreeting()},{' '}
              <Text style={styles.nameHighlight}>
                {user?.name?.split(' ')[0] || 'Team Member'}
              </Text>
            </Text>
            {user?.role && <RoleBadge role={user.role} />}
          </View>
          <Text style={styles.emailText}>
            <Ionicons name="mail-outline" size={13} color={THEME.colors.textMuted} />{' '}
            {user?.email}
          </Text>
        </View>
      </View>

      <View style={styles.metaBadge}>
        <Ionicons name="shield-checkmark" size={14} color={THEME.colors.cyan} />
        <Text style={styles.metaBadgeText}>DOMAIN VERIFIED</Text>
        <Text style={styles.metaDate}>• {formattedDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: THEME.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
    marginBottom: THEME.spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: THEME.colors.borderMedium,
  },
  avatarFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 2,
    borderColor: THEME.colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: THEME.colors.success,
    borderWidth: 2.5,
    borderColor: THEME.colors.background,
  },
  details: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  nameHighlight: {
    color: '#FFFFFF',
  },
  emailText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.pill,
    backgroundColor: 'rgba(34, 211, 238, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.cyan,
    letterSpacing: 0.8,
  },
  metaDate: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
});

export default Header;
