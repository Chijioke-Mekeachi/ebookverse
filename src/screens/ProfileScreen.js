// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

// Static colors
const colors = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  error: '#ef4444',
  success: '#10b981',
};

const ProfileScreen = () => {
  const { user, logout, dummyUsers, switchUser } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 20,
    },
    userCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    avatar: {
      fontSize: 48,
      marginBottom: 12,
    },
    userName: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    userSince: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    button: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    logoutButton: {
      backgroundColor: colors.error + '20',
    },
    logoutText: {
      color: colors.error,
      fontWeight: '600',
    },
    userSwitchButton: {
      backgroundColor: colors.primary + '20',
    },
    userSwitchText: {
      color: colors.primary,
      fontWeight: '600',
    },
    demoNote: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      fontStyle: 'italic',
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.userCard}>
        <Text style={styles.avatar}>📚</Text>
        <Text style={styles.userName}>{user?.name || 'Demo User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'demo@ebookverse.com'}</Text>
        <Text style={styles.userSince}>
          Member since {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '2024'}
        </Text>
      </View>

      {/* Demo User Switching (if available) */}
      {dummyUsers && switchUser && (
        <>
          <Text style={styles.sectionTitle}>Demo Users</Text>
          {dummyUsers.map(dummyUser => (
            <TouchableOpacity
              key={dummyUser.id}
              style={[styles.button, styles.userSwitchButton]}
              onPress={() => switchUser(dummyUser.id)}
            >
              <Ionicons name="person-outline" size={20} color={colors.primary} />
              <Text style={[styles.buttonText, styles.userSwitchText]}>
                Switch to {dummyUser.name}
              </Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.demoNote}>Try different demo users to test the app</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>Account</Text>
      
      <TouchableOpacity style={styles.button}>
        <Ionicons name="settings-outline" size={20} color={colors.text} />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="help-circle-outline" size={20} color={colors.text} />
        <Text style={styles.buttonText}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="document-text-outline" size={20} color={colors.text} />
        <Text style={styles.buttonText}>Terms & Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.demoNote}>
        This is a demo app. All user data is temporary and will reset on app reload.
      </Text>
    </ScrollView>
  );
};

export default ProfileScreen;