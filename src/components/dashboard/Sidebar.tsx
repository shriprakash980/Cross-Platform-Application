import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { RoleBadge } from '../ui/RoleBadge';
import { LogoutModal } from './LogoutModal';

interface SidebarProps {
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut();
    router.replace('/(auth)/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: 'grid-outline' as const,
      activeIcon: 'grid' as const,
      route: '/(app)/dashboard',
      visible: true,
    },
    {
      name: 'Admin Portal',
      icon: 'shield-checkmark-outline' as const,
      activeIcon: 'shield-checkmark' as const,
      route: '/(app)/admin',
      visible: isAdmin,
    },
  ];

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <View style={styles.mobileHeader}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>HB+ <Text style={styles.brandAegis}>Aegis</Text></Text>
          </View>

          <View style={styles.mobileRight}>
            {user?.role && <RoleBadge role={user.role} size="sm" />}
            <Pressable
              onPress={() => setShowLogoutModal(true)}
              style={styles.mobileLogoutBtn}
              accessibilityLabel="Sign out"
            >
              <Ionicons name="log-out-outline" size={20} color={THEME.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Mobile Bottom Navigation Bar */}
        <View style={styles.mobileBottomNav}>
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable
                  key={item.route}
                  onPress={() => router.push(item.route as any)}
                  style={[styles.mobileNavItem, isActive && styles.mobileNavItemActive]}
                >
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={22}
                    color={isActive ? THEME.colors.cyan : THEME.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.mobileNavText,
                      isActive && styles.mobileNavTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
        </View>

        <LogoutModal
          visible={showLogoutModal}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          isLoading={isLoading}
        />
      </>
    );
  }

  // Desktop Sidebar
  return (
    <>
      <View style={styles.desktopSidebar}>
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>
                HB+ <Text style={styles.brandAegis}>Aegis</Text>
              </Text>
              <Text style={styles.brandDomain}>hbplus.fit</Text>
            </View>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={styles.navSection}>
          <Text style={styles.sectionHeader}>PORTAL</Text>
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable
                  key={item.route}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => [
                    styles.navItem,
                    isActive && styles.navItemActive,
                    pressed && styles.navItemPressed,
                  ]}
                >
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={20}
                    color={isActive ? THEME.colors.cyan : THEME.colors.textSecondary}
                    style={styles.navIcon}
                  />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.name}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </Pressable>
              );
            })}
        </View>

        {/* User Footer Card */}
        <View style={styles.footerSection}>
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || 'HB+ Member'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email}
              </Text>
              {user?.role && (
                <View style={{ marginTop: 4 }}>
                  <RoleBadge role={user.role} size="sm" />
                </View>
              )}
            </View>
          </View>

          <Pressable
            onPress={() => setShowLogoutModal(true)}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
          >
            <Ionicons name="log-out-outline" size={18} color={THEME.colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  // Desktop
  desktopSidebar: {
    width: 260,
    height: '100%',
    backgroundColor: '#0C111F',
    borderRightWidth: 1,
    borderRightColor: THEME.colors.borderSubtle,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
  },
  brandSection: {
    paddingHorizontal: THEME.spacing.sm,
    paddingBottom: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: THEME.colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  brandAegis: {
    color: THEME.colors.cyan,
  },
  brandDomain: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  navSection: {
    flex: 1,
    paddingTop: THEME.spacing.lg,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.md,
    marginBottom: 6,
    position: 'relative',
    ...Platform.select({
      web: {
        transition: 'all 0.15s ease',
        cursor: 'pointer',
      } as any,
    }),
  },
  navItemActive: {
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
  },
  navItemPressed: {
    opacity: 0.8,
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: THEME.colors.cyan,
    borderRadius: 2,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    paddingTop: THEME.spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: THEME.spacing.sm,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.colors.borderMedium,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: THEME.colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  userEmail: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.dangerBg,
    borderWidth: 1,
    borderColor: THEME.colors.dangerBorder,
    minHeight: 44,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.danger,
  },

  // Mobile Styles
  mobileHeader: {
    height: 60,
    backgroundColor: '#0C111F',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    zIndex: 10,
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileLogoutBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  mobileBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#0C111F',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
    zIndex: 10,
  },
  mobileNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  mobileNavItemActive: {},
  mobileNavText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  mobileNavTextActive: {
    color: THEME.colors.cyan,
  },
});

export default Sidebar;
