import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Slot, Redirect } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Sidebar } from '../../src/components/dashboard/Sidebar';
import { THEME } from '../../src/constants/theme';

export default function AppLayout() {
  const { user, isRestoringSession } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // Protect all child routes in (app) group
  if (!isRestoringSession && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      {isDesktop ? (
        // Desktop Layout: Left Sidebar + Right Content Area
        <View style={styles.desktopWrapper}>
          <Sidebar isMobile={false} />
          <View style={styles.desktopContent}>
            <Slot />
          </View>
        </View>
      ) : (
        // Mobile Layout: Top Bar + Content + Bottom Nav
        <View style={styles.mobileWrapper}>
          <Sidebar isMobile={true} />
          <View style={styles.mobileContent}>
            <Slot />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  desktopWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  mobileWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  mobileContent: {
    flex: 1,
    paddingBottom: 70, // Buffer for mobile bottom tab
  },
});
