// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BooksContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

const ProfileScreen = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const { purchasedBooks, downloadedBooks } = useBooks();
  const navigation = useNavigation();
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate statistics from real data
  const stats = {
    purchased: purchasedBooks?.length || 0,
    downloaded: downloadedBooks?.length || 0,
    reading: purchasedBooks?.filter(book => book.readingProgress > 0 && book.readingProgress < 100).length || 0,
    completed: purchasedBooks?.filter(book => book.readingProgress === 100).length || 0,
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.prompt(
      'Edit Name',
      'Enter your new name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (name) => {
            if (name && name.trim()) {
              setIsUpdating(true);
              const result = await updateProfile({ name: name.trim() });
              setIsUpdating(false);
              
              if (!result.success) {
                Alert.alert('Error', result.error || 'Failed to update profile');
              }
            }
          },
        },
      ],
      'plain-text',
      profile?.name || ''
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, isDestructive = false, showLoader = false }) => (
    <TouchableOpacity 
      style={[styles.menuItem, isDestructive && styles.destructiveItem]}
      onPress={onPress}
      disabled={showLoader}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={isDestructive ? COLORS.error : COLORS.text} 
      />
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        )}
      </View>
      {showLoader ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDestructive ? COLORS.error : COLORS.textSecondary} 
        />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ value, label, color = COLORS.primary }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // Format joined date from Supabase
  const formatJoinedDate = () => {
    if (profile?.joined_date) {
      return new Date(profile.joined_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Recently joined';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleEditProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
          {isUpdating && (
            <View style={styles.editOverlay}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          )}
        </View>
        
        <TouchableOpacity onPress={handleEditProfile} style={styles.nameContainer}>
          <Text style={styles.userName}>{profile?.name || user?.email || 'User'}</Text>
          <Ionicons name="pencil-outline" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
        
        <Text style={styles.memberSince}>
          Member since {formatJoinedDate()}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Reading Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard value={stats.purchased} label="Purchased" />
          <StatCard value={stats.downloaded} label="Downloaded" />
          <StatCard value={stats.reading} label="Reading" color={COLORS.warning} />
          <StatCard value={stats.completed} label="Completed" color={COLORS.success} />
        </View>
      </View>

      {/* Membership Section */}
      <View style={styles.membershipSection}>
        <View style={styles.membershipCard}>
          <Ionicons name="diamond-outline" size={32} color={COLORS.primary} />
          <View style={styles.membershipInfo}>
            <Text style={styles.membershipTitle}>
              {user?.email ? 'Premium Member' : 'Guest User'}
            </Text>
            <Text style={styles.membershipSubtitle}>
              {user?.email ? 'Full access to all features' : 'Sign up for full access'}
            </Text>
          </View>
          <View style={[styles.membershipBadge, !user?.email && styles.guestBadge]}>
            <Text style={styles.membershipBadgeText}>
              {user?.email ? 'Active' : 'Guest'}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuSection}>
          <MenuItem
            icon="settings-outline"
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts and updates"
            onPress={() => Alert.alert('Notifications', 'Notification settings would open here')}
          />
          <MenuItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={() => Alert.alert('Payment Methods', 'Payment settings would open here')}
          />
          <MenuItem
            icon="lock-closed-outline"
            title="Privacy & Security"
            subtitle="Control your data and security"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would open here')}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuSection}>
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with common issues"
            onPress={() => Alert.alert('Help', 'Help center would open here')}
          />
          <MenuItem
            icon="chatbubble-outline"
            title="Contact Us"
            subtitle="Reach out to our team"
            onPress={() => Alert.alert('Contact', 'Contact form would open here')}
          />
          <MenuItem
            icon="star-outline"
            title="Rate the App"
            subtitle="Share your experience"
            onPress={() => Alert.alert('Rate App', 'App store rating would open here')}
          />
          <MenuItem
            icon="share-social-outline"
            title="Share EBookVerse"
            subtitle="Tell your friends about us"
            onPress={() => Alert.alert('Share', 'Share dialog would open here')}
          />
        </View>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.menuSection}>
          <MenuItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms', 'Terms of service would open here')}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would open here')}
          />
          <MenuItem
            icon="information-circle-outline"
            title="About EBookVerse"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'About screen would open here')}
          />
        </View>
      </View>

      {/* Logout Section */}
      {user && (
        <View style={styles.section}>
          <MenuItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
            isDestructive
          />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for book lovers
        </Text>
        <Text style={styles.footerSubtext}>
          EBookVerse v1.0.0 • Your digital library companion
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  membershipSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  membershipInfo: {
    flex: 1,
    marginLeft: 12,
  },
  membershipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  membershipSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  membershipBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadge: {
    backgroundColor: COLORS.warning,
  },
  membershipBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
  },
  menuSection: {
    backgroundColor: COLORS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  destructiveItem: {
    backgroundColor: COLORS.error + '10',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  destructiveText: {
    color: COLORS.error,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
});

export default ProfileScreen;