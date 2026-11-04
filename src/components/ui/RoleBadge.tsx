import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '../../types';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const isAdmin = role === 'admin';

  return (
    <View
      style={[
        styles.badge,
        isAdmin ? styles.adminBadge : styles.userBadge,
        size === 'sm' && styles.smallBadge,
      ]}
    >
      <Ionicons
        name={isAdmin ? 'shield-checkmark' : 'person'}
        size={size === 'sm' ? 11 : 13}
        color={isAdmin ? THEME.colors.violet : THEME.colors.cyan}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          isAdmin ? styles.adminText : styles.userText,
          size === 'sm' && styles.smallText,
        ]}
      >
        {isAdmin ? 'Aegis Admin' : 'Team Member'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  adminBadge: {
    backgroundColor: THEME.colors.adminBadgeBg,
    borderColor: THEME.colors.adminBadgeBorder,
  },
  userBadge: {
    backgroundColor: THEME.colors.userBadgeBg,
    borderColor: THEME.colors.userBadgeBorder,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  smallText: {
    fontSize: 10,
  },
  adminText: {
    color: '#C4B5FD',
  },
  userText: {
    color: '#67E8F9',
  },
});

export default RoleBadge;
