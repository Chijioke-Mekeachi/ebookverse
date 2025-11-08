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
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BooksContext';
import { useTheme, ThemeConstants } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const { purchasedBooks, downloadedBooks } = useBooks();
  const { colors, isDark, themeName, setTheme } = useTheme();
  const navigation = useNavigation();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(null);

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
      user?.name || ''
    );
  };

  const handleChangeAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to change your avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsUploading(true);
        // Simulate upload process
        setTimeout(() => {
          setLocalAvatar(result.assets[0].uri);
          setIsUploading(false);
          Alert.alert('Success', 'Profile picture updated successfully!');
        }, 1500);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture');
      setIsUploading(false);
    }
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Change Theme',
      'Select your preferred theme:',
      [
        { text: 'Light', onPress: () => setTheme('light') },
        { text: 'Dark', onPress: () => setTheme('dark') },
        { text: 'Auto', onPress: () => setTheme('auto') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarSource = () => {
    if (localAvatar) return { uri: localAvatar };
    if (user?.avatar) return { uri: user.avatar };
    return null;
  };

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    isDestructive = false, 
    showLoader = false,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    badge,
    rightText 
  }) => (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        isDestructive && { backgroundColor: colors.error + '10' }
      ]}
      onPress={onPress}
      disabled={showLoader || showSwitch}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={isDestructive ? colors.error : colors.text} 
      />
      <View style={styles.menuTextContainer}>
        <Text style={[
          styles.menuText, 
          isDestructive && { color: colors.error }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        )}
      </View>
      
      {badge && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      
      {rightText && (
        <Text style={styles.rightText}>{rightText}</Text>
      )}
      
      {showLoader ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : showSwitch ? (
        <TouchableOpacity 
          style={[
            styles.switch,
            switchValue && [styles.switchOn, { backgroundColor: colors.primary }]
          ]}
          onPress={onSwitchChange}
        >
          <View style={[
            styles.switchThumb,
            switchValue && styles.switchThumbOn
          ]} />
        </TouchableOpacity>
      ) : (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDestructive ? colors.error : colors.textSecondary} 
        />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ value, label, color = colors.primary }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const formatJoinedDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Recently joined';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: ThemeConstants.spacing.xl,
    },
    header: {
      alignItems: 'center',
      padding: ThemeConstants.spacing.lg,
      paddingTop: ThemeConstants.spacing.xl,
      backgroundColor: colors.surface,
      borderBottomLeftRadius: ThemeConstants.borderRadius.xl,
      borderBottomRightRadius: ThemeConstants.borderRadius.xl,
      ...ThemeConstants.elevation.md,
    },
    avatarSection: {
      position: 'relative',
      marginBottom: ThemeConstants.spacing.md,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: colors.surface,
      ...ThemeConstants.elevation.lg,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.onPrimary,
    },
    editAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
      ...ThemeConstants.elevation.sm,
    },
    editOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ThemeConstants.spacing.sm,
    },
    userName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: ThemeConstants.spacing.xs,
    },
    userEmail: {
      fontSize: ThemeConstants.typography.sizes.md,
      color: colors.textSecondary,
      marginBottom: ThemeConstants.spacing.sm,
    },
    memberSince: {
      fontSize: ThemeConstants.typography.sizes.sm,
      color: colors.textTertiary,
    },
    statsSection: {
      padding: ThemeConstants.spacing.lg,
    },
    sectionTitle: {
      fontSize: ThemeConstants.typography.sizes.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: ThemeConstants.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: ThemeConstants.spacing.sm,
    },
    statCard: {
      alignItems: 'center',
      padding: ThemeConstants.spacing.md,
      borderRadius: ThemeConstants.borderRadius.lg,
      flex: 1,
      ...ThemeConstants.elevation.sm,
    },
    statValue: {
      fontSize: ThemeConstants.typography.sizes.xl,
      fontWeight: '700',
      marginBottom: ThemeConstants.spacing.xs,
    },
    statLabel: {
      fontSize: ThemeConstants.typography.sizes.xs,
      color: colors.textSecondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    membershipSection: {
      paddingHorizontal: ThemeConstants.spacing.lg,
      marginBottom: ThemeConstants.spacing.sm,
    },
    membershipCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '10',
      padding: ThemeConstants.spacing.lg,
      borderRadius: ThemeConstants.borderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    membershipInfo: {
      flex: 1,
      marginLeft: ThemeConstants.spacing.md,
    },
    membershipTitle: {
      fontSize: ThemeConstants.typography.sizes.md,
      fontWeight: '600',
      color: colors.text,
      marginBottom: ThemeConstants.spacing.xs,
    },
    membershipSubtitle: {
      fontSize: ThemeConstants.typography.sizes.sm,
      color: colors.textSecondary,
    },
    membershipBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: ThemeConstants.spacing.sm,
      paddingVertical: ThemeConstants.spacing.xs,
      borderRadius: ThemeConstants.borderRadius.sm,
    },
    guestBadge: {
      backgroundColor: colors.warning,
    },
    membershipBadgeText: {
      fontSize: ThemeConstants.typography.sizes.xs,
      color: colors.onSuccess,
      fontWeight: '600',
    },
    section: {
      marginTop: ThemeConstants.spacing.lg,
    },
    menuSection: {
      backgroundColor: colors.surface,
      marginHorizontal: ThemeConstants.spacing.lg,
      borderRadius: ThemeConstants.borderRadius.lg,
      overflow: 'hidden',
      ...ThemeConstants.elevation.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: ThemeConstants.spacing.md,
      paddingHorizontal: ThemeConstants.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuTextContainer: {
      flex: 1,
      marginLeft: ThemeConstants.spacing.md,
    },
    menuText: {
      fontSize: ThemeConstants.typography.sizes.md,
      fontWeight: '500',
      color: colors.text,
      marginBottom: ThemeConstants.spacing.xs,
    },
    menuSubtitle: {
      fontSize: ThemeConstants.typography.sizes.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    badge: {
      paddingHorizontal: ThemeConstants.spacing.sm,
      paddingVertical: 4,
      borderRadius: ThemeConstants.borderRadius.sm,
      marginRight: ThemeConstants.spacing.sm,
    },
    badgeText: {
      fontSize: ThemeConstants.typography.sizes.xs,
      color: colors.onPrimary,
      fontWeight: '600',
    },
    rightText: {
      fontSize: ThemeConstants.typography.sizes.sm,
      color: colors.textSecondary,
      marginRight: ThemeConstants.spacing.sm,
    },
    switch: {
      width: 44,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.border,
      padding: 2,
      justifyContent: 'center',
    },
    switchOn: {
      backgroundColor: colors.primary,
    },
    switchThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surface,
    },
    switchThumbOn: {
      transform: [{ translateX: 20 }],
    },
    footer: {
      alignItems: 'center',
      marginTop: ThemeConstants.spacing.xl,
      paddingHorizontal: ThemeConstants.spacing.lg,
    },
    footerText: {
      fontSize: ThemeConstants.typography.sizes.sm,
      color: colors.textSecondary,
      marginBottom: ThemeConstants.spacing.xs,
    },
    footerSubtext: {
      fontSize: ThemeConstants.typography.sizes.xs,
      color: colors.textTertiary,
    },
    themeIndicator: {
      position: 'absolute',
      top: ThemeConstants.spacing.lg,
      right: ThemeConstants.spacing.lg,
      backgroundColor: colors.primary + '20',
      paddingHorizontal: ThemeConstants.spacing.sm,
      paddingVertical: ThemeConstants.spacing.xs,
      borderRadius: ThemeConstants.borderRadius.sm,
      zIndex: 10,
    },
    themeIndicatorText: {
      fontSize: ThemeConstants.typography.sizes.xs,
      fontWeight: '600',
      color: colors.primary,
    },
  });

  const avatarSource = getAvatarSource();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.surface} 
      />
      
      {/* Theme Indicator */}
      <View style={styles.themeIndicator}>
        <Text style={styles.themeIndicatorText}>
          {themeName.toUpperCase()}
        </Text>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handleChangeAvatar} disabled={isUploading}>
                <View style={styles.avatar}>
                  {avatarSource ? (
                    <Image source={avatarSource} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {getInitials(user?.name || user?.email)}
                    </Text>
                  )}
                  {isUploading && (
                    <View style={styles.editOverlay}>
                      <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handleChangeAvatar}
                disabled={isUploading}
              >
                <Ionicons name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleEditProfile} style={styles.nameContainer}>
            <Text style={styles.userName}>{user?.name || user?.email || 'User'}</Text>
            <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
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
            <StatCard value={stats.reading} label="Reading" color={colors.warning} />
            <StatCard value={stats.completed} label="Completed" color={colors.success} />
          </View>
        </View>

        {/* Membership Section */}
        <View style={styles.membershipSection}>
          <View style={styles.membershipCard}>
            <Ionicons name="diamond-outline" size={32} color={colors.primary} />
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

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon="color-palette-outline"
              title="Theme"
              subtitle={`Current: ${themeName}`}
              onPress={handleThemeChange}
              rightText={themeName}
            />
            <MenuItem
              icon="text-outline"
              title="Font Size"
              subtitle="Adjust reading font size"
              onPress={() => Alert.alert('Font Size', 'Font size settings would open here')}
            />
            <MenuItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Always use dark theme"
              showSwitch
              switchValue={themeName === 'dark'}
              onSwitchChange={() => setTheme(themeName === 'dark' ? 'light' : 'dark')}
            />
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
              badge="3"
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
            <View style={styles.menuSection}>
              <MenuItem
                icon="log-out-outline"
                title="Logout"
                onPress={handleLogout}
                isDestructive
              />
            </View>
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
    </SafeAreaView>
  );
};

export default ProfileScreen;