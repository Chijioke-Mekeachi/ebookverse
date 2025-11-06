import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  // const { colors } = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,

      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 36,
      fontWeight: '700',

      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      // color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    button: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      width: '100%',
      marginBottom: 12,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      // borderColor: colors.primary,
    },
    secondaryButtonText: {
      // color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EBookVerse</Text>
      <Text style={styles.subtitle}>
        Your digital library in your pocket{'\n'}
        Read anytime, anywhere
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          I have an account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;