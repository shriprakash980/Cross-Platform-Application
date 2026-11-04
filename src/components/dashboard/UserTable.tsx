

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers, updateUserRole } from '../../services/users';
import { UserProfile, UserRole } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { RoleBadge } from '../ui/RoleBadge';
import { Skeleton } from '../ui/Skeleton';

interface UserTableProps {
  onUserRoleChanged?: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({ onUserRoleChanged }) => {
  const { user: currentUser, refreshProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.warn('Failed to load users:', err);
      setMessage({
        text: 'Failed to retrieve team members from Firestore.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAllUsers()
      .then((data) => {
        if (isMounted) {
          setUsers(data);
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.warn('Failed to load users:', err);
          setMessage({
            text: 'Failed to retrieve team members from Firestore.',
            type: 'error',
          });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRole = async (targetUser: UserProfile) => {
    const newRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setUpdatingUid(targetUser.uid);
    setMessage(null);

    try {
      await updateUserRole(targetUser.uid, newRole);

      // Optimistic state update
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUser.uid ? { ...u, role: newRole } : u))
      );

      setMessage({
        text: `Successfully updated ${targetUser.name || targetUser.email} to ${newRole.toUpperCase()}.`,
        type: 'success',
      });

      // If updating current user's role, refresh the current session
      if (currentUser?.uid === targetUser.uid) {
        await refreshProfile();
      }

      if (onUserRoleChanged) {
        onUserRoleChanged();
      }
    } catch (err: any) {
      console.warn('Failed to update role:', err);
      setMessage({
        text: err?.message || 'Permission denied: only admins can update roles.',
        type: 'error',
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Never';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <GlassCard enableTilt={false} variant="elevated" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCircle}>
            <Ionicons name="people-outline" size={22} color={THEME.colors.violet} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Team Access Management</Text>
            <Text style={styles.cardSubtitle}>
              RBAC authority controls for verified HB+ accounts ({users.length} registered)
            </Text>
          </View>
        </View>

        <Pressable
          onPress={fetchUsers}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={16}
            color={THEME.colors.cyan}
            style={isLoading ? styles.spinning : undefined}
          />
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {message && (
        <View
          style={[
            styles.messageBanner,
            message.type === 'success' ? styles.successBanner : styles.errorBanner,
          ]}
        >
          <Ionicons
            name={message.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
            size={16}
            color={message.type === 'success' ? THEME.colors.success : THEME.colors.danger}
          />
          <Text
            style={[
              styles.messageText,
              message.type === 'success' ? styles.successText : styles.errorText,
            ]}
          >
            {message.text}
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonRow}>
              <Skeleton width={180} height={20} />
              <Skeleton width={140} height={20} />
              <Skeleton width={80} height={24} borderRadius={12} />
              <Skeleton width={100} height={32} borderRadius={8} />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, styles.colUser]}>USER</Text>
              <Text style={[styles.colHeader, styles.colEmail]}>OFFICIAL EMAIL</Text>
              <Text style={[styles.colHeader, styles.colRole]}>ROLE</Text>
              <Text style={[styles.colHeader, styles.colLastLogin]}>LAST LOGIN</Text>
              <Text style={[styles.colHeader, styles.colAction]}>AUTHORITY ACTION</Text>
            </View>

            {/* Table Rows */}
            {users.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users registered yet in Firestore.</Text>
              </View>
            ) : (
              users.map((item) => {
                const isCurrent = item.uid === currentUser?.uid;
                const isUpdating = updatingUid === item.uid;

                return (
                  <View key={item.uid} style={styles.tableRow}>
                    <View style={styles.colUser}>
                      <Text style={styles.cellName}>
                        {item.name || 'HB+ Member'}{' '}
                        {isCurrent && <Text style={styles.youTag}>(You)</Text>}
                      </Text>
                    </View>

                    <View style={styles.colEmail}>
                      <Text style={styles.cellEmail}>{item.email}</Text>
                    </View>

                    <View style={styles.colRole}>
                      <RoleBadge role={item.role} size="sm" />
                    </View>

                    <View style={styles.colLastLogin}>
                      <Text style={styles.cellMuted}>{formatDate(item.lastLoginAt)}</Text>
                    </View>

                    <View style={styles.colAction}>
                      <Pressable
                        onPress={() => handleToggleRole(item)}
                        disabled={isUpdating}
                        style={({ pressed }) => [
                          styles.toggleButton,
                          item.role === 'admin'
                            ? styles.demoteButton
                            : styles.promoteButton,
                          pressed && styles.buttonPressed,
                          isUpdating && styles.buttonDisabled,
                        ]}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Ionicons
                              name={item.role === 'admin' ? 'arrow-down' : 'arrow-up'}
                              size={13}
                              color="#FFFFFF"
                            />
                            <Text style={styles.toggleText}>
                              {item.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            </Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: THEME.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: THEME.spacing.lg,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: THEME.colors.violetLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.25)',
  },
  refreshText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.cyan,
  },
  spinning: {
    opacity: 0.6,
  },
  messageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.md,
  },
  successBanner: {
    backgroundColor: THEME.colors.successBg,
    borderColor: THEME.colors.successBorder,
    borderWidth: 1,
  },
  errorBanner: {
    backgroundColor: THEME.colors.dangerBg,
    borderColor: THEME.colors.dangerBorder,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '600',
  },
  successText: {
    color: THEME.colors.success,
  },
  errorText: {
    color: THEME.colors.danger,
  },
  skeletonContainer: {
    gap: 16,
    paddingVertical: THEME.spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  table: {
    minWidth: 840,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderMedium,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingHorizontal: 8,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderSubtle,
  },
  colUser: {
    width: 200,
  },
  colEmail: {
    width: 230,
  },
  colRole: {
    width: 130,
  },
  colLastLogin: {
    width: 140,
  },
  colAction: {
    width: 140,
    alignItems: 'flex-start',
  },
  cellName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  youTag: {
    fontSize: 11,
    color: THEME.colors.cyan,
    fontWeight: '700',
  },
  cellEmail: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
  },
  cellMuted: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: THEME.borderRadius.md,
    minHeight: 34,
  },
  promoteButton: {
    backgroundColor: THEME.colors.violet,
  },
  demoteButton: {
    backgroundColor: '#475569',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
  },
});

export default UserTable;
