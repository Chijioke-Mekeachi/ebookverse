// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme, setTheme } = useTheme();

  // State for various settings
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [readingSounds, setReadingSounds] = useState(false);
  const [pageTurnAnimation, setPageTurnAnimation] = useState(true);
  const [syncProgress, setSyncProgress] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all temporary data. Your purchased books and downloads will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleClearDownloads = () => {
    Alert.alert(
      'Clear All Downloads',
      'This will remove all downloaded books from your device. You can download them again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All downloads cleared');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your reading data and preferences have been exported successfully.');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Would you like to contact our support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Contact',
          onPress: () => {
            // In a real app, this would open email or support chat
            Alert.alert('Support', 'Opening support channel...');
          },
        },
      ]
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleThemeSelect = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        {
          text: 'Light Theme',
          onPress: () => setTheme('light'),
        },
        {
          text: 'Dark Theme',
          onPress: () => setTheme('dark'),
        },
        {
          text: 'Use System Default',
          onPress: () => {
            // Clear saved theme to use system default
            setTheme(null);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement, 
    onPress, 
    isSwitch, 
    switchValue, 
    onSwitchChange 
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary + '80' }}
          thumbColor={switchValue ? colors.primary : '#f4f3f4'}
        />
      ) : (
        rightElement || <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    placeholder: {
      width: 32,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      paddingHorizontal: 20,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionContent: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      flex: 1,
      marginLeft: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      lineHeight: 18,
    },
    valueText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 4,
    },
    footer: {
      alignItems: 'center',
      marginTop: 32,
      paddingHorizontal: 20,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    footerSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      opacity: 0.7,
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <SettingSection title="Appearance">
        <SettingItem
          icon={isDark ? "moon" : "moon-outline"}
          title="Dark Mode"
          subtitle="Switch to dark theme"
          isSwitch
          switchValue={isDark}
          onSwitchChange={handleThemeToggle}
        />
        <SettingItem
          icon="contrast-outline"
          title="Theme"
          subtitle="Choose app theme color"
          rightElement={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.valueText}>{isDark ? 'Dark' : 'Light'}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          }
          onPress={handleThemeSelect}
        />
        <SettingItem
          icon="text-outline"
          title="Font Size"
          subtitle="Adjust reading font size"
          rightElement={<Text style={styles.valueText}>Medium</Text>}
          onPress={() => Alert.alert('Font Size', 'Font size settings would open here')}
        />
      </SettingSection>

      <SettingSection title="Reading">
        <SettingItem
          icon="book-outline"
          title="Page Turn Animation"
          subtitle="Animate page transitions"
          isSwitch
          switchValue={pageTurnAnimation}
          onSwitchChange={setPageTurnAnimation}
        />
        <SettingItem
          icon="volume-high-outline"
          title="Reading Sounds"
          subtitle="Play sounds when turning pages"
          isSwitch
          switchValue={readingSounds}
          onSwitchChange={setReadingSounds}
        />
        <SettingItem
          icon="sync-outline"
          title="Sync Reading Progress"
          subtitle="Automatically sync across devices"
          isSwitch
          switchValue={syncProgress}
          onSwitchChange={setSyncProgress}
        />
        <SettingItem
          icon="time-outline"
          title="Auto-advance"
          subtitle="Automatically go to next chapter"
          isSwitch
          switchValue={false}
          onSwitchChange={() => {}}
        />
      </SettingSection>

      <SettingSection title="Notifications">
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Receive app notifications"
          isSwitch
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        <SettingItem
          icon="mail-outline"
          title="Email Updates"
          subtitle="Get news and recommendations"
          isSwitch
          switchValue={emailUpdates}
          onSwitchChange={setEmailUpdates}
        />
        <SettingItem
          icon="megaphone-outline"
          title="Promotional Offers"
          subtitle="Special deals and discounts"
          isSwitch
          switchValue={false}
          onSwitchChange={() => {}}
        />
      </SettingSection>

      <SettingSection title="Downloads">
        <SettingItem
          icon="download-outline"
          title="Auto-download Purchases"
          subtitle="Download books automatically after purchase"
          isSwitch
          switchValue={autoDownload}
          onSwitchChange={setAutoDownload}
        />
        <SettingItem
          icon="wifi-outline"
          title="Wi-Fi Only Downloads"
          subtitle="Only download over Wi-Fi"
          isSwitch
          switchValue={wifiOnly}
          onSwitchChange={setWifiOnly}
        />
        <SettingItem
          icon="trash-outline"
          title="Clear All Downloads"
          subtitle="Free up storage space"
          onPress={handleClearDownloads}
        />
        <SettingItem
          icon="server-outline"
          title="Download Quality"
          subtitle="Balance quality and file size"
          rightElement={<Text style={styles.valueText}>Standard</Text>}
          onPress={() => Alert.alert('Download Quality', 'Quality settings would open here')}
        />
      </SettingSection>

      <SettingSection title="Storage & Data">
        <SettingItem
          icon="hardware-chip-outline"
          title="Clear Cache"
          subtitle="Free up temporary storage"
          onPress={handleClearCache}
        />
        <SettingItem
          icon="cloud-download-outline"
          title="Data Usage"
          subtitle="Manage your data consumption"
          rightElement={<Text style={styles.valueText}>Normal</Text>}
          onPress={() => Alert.alert('Data Usage', 'Data settings would open here')}
        />
        <SettingItem
          icon="archive-outline"
          title="Export Reading Data"
          subtitle="Backup your reading history"
          onPress={handleExportData}
        />
        <SettingItem
          icon="refresh-outline"
          title="Sync Frequency"
          subtitle="How often to sync your library"
          rightElement={<Text style={styles.valueText}>Daily</Text>}
          onPress={() => Alert.alert('Sync Frequency', 'Sync settings would open here')}
        />
      </SettingSection>

      <SettingSection title="About & Support">
        <SettingItem
          icon="help-circle-outline"
          title="Help & FAQ"
          subtitle="Get help with common issues"
          onPress={() => Alert.alert('Help & FAQ', 'Help center would open here')}
        />
        <SettingItem
          icon="chatbubble-outline"
          title="Contact Support"
          subtitle="Get in touch with our team"
          onPress={handleContactSupport}
        />
        <SettingItem
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms of Service', 'Terms would open here')}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Privacy policy would open here')}
        />
        <SettingItem
          icon="information-circle-outline"
          title="About EBookVerse"
          subtitle={`Version 1.0.0 (Build ${Platform.OS === 'ios' ? '1001' : '2001'})`}
          onPress={() => Alert.alert(
            'About EBookVerse',
            'EBookVerse - Your digital library companion\n\nVersion 1.0.0\n© 2024 EBookVerse Inc.'
          )}
        />
      </SettingSection>

      <View style={styles.footer}>
        
        <Text style={styles.footerSubtext}>
          EBookVerse v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;