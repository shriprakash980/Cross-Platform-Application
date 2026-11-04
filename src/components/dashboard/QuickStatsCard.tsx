import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export const QuickStatsCard: React.FC = () => {
  return (
    <GlassCard enableTilt style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="stats-chart-outline" size={24} color={THEME.colors.violet} />
        </View>
        <Text style={styles.cardTitle}>Aegis Perimeter Status</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <View style={styles.statTop}>
            <Ionicons name="shield-checkmark" size={16} color={THEME.colors.success} />
            <Text style={styles.statValue}>100%</Text>
          </View>
          <Text style={styles.statLabel}>Domain Match Rate</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statTop}>
            <Ionicons name="lock-closed" size={16} color={THEME.colors.cyan} />
            <Text style={styles.statValue}>RBAC</Text>
          </View>
          <Text style={styles.statLabel}>Role Guard Policy</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statTop}>
            <Ionicons name="flash" size={16} color={THEME.colors.violet} />
            <Text style={styles.statValue}>AES-256</Text>
          </View>
          <Text style={styles.statLabel}>Firestore At Rest</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statTop}>
            <Ionicons name="radio" size={16} color={THEME.colors.success} />
            <Text style={styles.statValue}>ACTIVE</Text>
          </View>
          <Text style={styles.statLabel}>Secure Tunnel</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: 120,
    padding: 12,
    borderRadius: THEME.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: THEME.colors.borderSubtle,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
});

export default QuickStatsCard;
