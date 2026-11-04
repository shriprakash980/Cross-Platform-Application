import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../src/hooks/useAuth';
import { Header } from '../../src/components/dashboard/Header';
import { ProfileCard } from '../../src/components/dashboard/ProfileCard';
import { SessionCard } from '../../src/components/dashboard/SessionCard';
import { QuickStatsCard } from '../../src/components/dashboard/QuickStatsCard';
import { UserTable } from '../../src/components/dashboard/UserTable';
import { RoleGuard } from '../../src/components/ui/RoleGuard';
import { THEME } from '../../src/constants/theme';

export default function DashboardScreen() {
  const { user, session } = useAuth();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <Header user={user} />

      {/* Primary Metrics Cards Grid */}
      <View style={styles.cardGrid}>
        <ProfileCard user={user} />
        <SessionCard session={session} user={user} />
        <QuickStatsCard />
      </View>

      {/* Admin Panel User Management Table (Rendered for Admins) */}
      <RoleGuard role="admin">
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
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: THEME.spacing.lg,
  },
});
