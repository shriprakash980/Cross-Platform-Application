import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RoleGuard } from '../../src/components/ui/RoleGuard';
import { UserTable } from '../../src/components/dashboard/UserTable';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { THEME } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen() {

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark" size={14} color={THEME.colors.violet} />
          <Text style={styles.headerBadgeText}>RESTRICTED ACCESS</Text>
        </View>
        <Text style={styles.title}>Aegis Security Administration</Text>
        <Text style={styles.subtitle}>
          Manage organizational roles, user clearance, and access control policies for HB+
        </Text>
      </View>

      <RoleGuard role="admin">
        {/* Security Policy Information */}
        <View style={styles.policyRow}>
          <GlassCard enableTilt style={styles.policyCard}>
            <Ionicons name="key" size={24} color={THEME.colors.cyan} style={styles.policyIcon} />
            <Text style={styles.policyTitle}>Principle of Least Privilege</Text>
            <Text style={styles.policyText}>
              All new logins default to &quot;user&quot;. Only existing Administrators can grant or revoke Admin clearance.
            </Text>
          </GlassCard>

          <GlassCard enableTilt style={styles.policyCard}>
            <Ionicons name="cloud-done" size={24} color={THEME.colors.violet} style={styles.policyIcon} />
            <Text style={styles.policyTitle}>Server-Side Security Rules</Text>
            <Text style={styles.policyText}>
              Role mutations and listing operations are cryptographically enforced in Cloud Firestore Rules.
            </Text>
          </GlassCard>
        </View>

        {/* User Management Table */}
        <UserTable />
      </RoleGuard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  contentContainer: {
    padding: THEME.spacing.xl,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: THEME.spacing.xl,
    paddingBottom: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.pill,
    backgroundColor: THEME.colors.violetLight,
    borderWidth: 1,
    borderColor: THEME.colors.borderFocus,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.violet,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    maxWidth: 680,
  },
  policyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: THEME.spacing.lg,
  },
  policyCard: {
    flex: 1,
    minWidth: 280,
  },
  policyIcon: {
    marginBottom: 10,
  },
  policyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 6,
  },
  policyText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
});
