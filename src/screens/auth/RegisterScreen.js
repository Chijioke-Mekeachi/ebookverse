import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const { colors } = useTheme();
  const { register, isLoading } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Name validation
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Please enter a valid name (at least 2 characters)');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsRegistering(true);
    
    try {
      const result = await register(email.trim(), password, name.trim());
      
      if (result.success) {
        Alert.alert(
          'Success!', 
          result.message || 'Account created successfully! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        // Show specific error message from Supabase
        let errorMessage = 'Registration failed. Please try again.';
        
        if (result.error) {
          switch (result.error) {
            case 'User already registered':
              errorMessage = 'An account with this email already exists. Please try logging in.';
              break;
            case 'Password should be at least 6 characters':
              errorMessage = 'Password must be at least 6 characters long';
              break;
            case 'Invalid email':
              errorMessage = 'Please enter a valid email address';
              break;
            case 'Email rate limit exceeded':
              errorMessage = 'Too many attempts. Please try again later.';
              break;
            default:
              errorMessage = result.error;
          }
        }
        
        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 22,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      color: colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordRequirement: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      marginLeft: 8,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    buttonDisabled: {
      backgroundColor: colors.textSecondary + '40',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    loginText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    },
    loginLink: {
      color: colors.primary,
      fontWeight: '600',
    },
    loadingText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    passwordMatch: {
      fontSize: 12,
      marginLeft: 8,
      marginBottom: 8,
    },
    passwordMatchValid: {
      color: colors.success,
    },
    passwordMatchInvalid: {
      color: colors.error,
    },
  });

  const isFormValid = name.trim() && 
                     email.trim() && 
                     password.length >= 6 && 
                     confirmPassword && 
                     password === confirmPassword && 
                     !isRegistering;

  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join EBookVerse and start your reading journey today
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
        autoComplete="name"
        editable={!isRegistering}
        returnKeyType="next"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!isRegistering}
        returnKeyType="next"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password (min. 6 characters)"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password-new"
        editable={!isRegistering}
        returnKeyType="next"
      />
      <Text style={styles.passwordRequirement}>
        • Must be at least 6 characters long
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="password-new"
        editable={!isRegistering}
        returnKeyType="done"
        onSubmitEditing={isFormValid ? handleRegister : null}
      />
      
      {confirmPassword.length > 0 && (
        <Text style={[
          styles.passwordMatch,
          doPasswordsMatch ? styles.passwordMatchValid : styles.passwordMatchInvalid
        ]}>
          {doPasswordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid}
      >
        {isRegistering ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingText}>Creating Account...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Text 
          style={styles.loginLink}
          onPress={handleLoginNavigation}
        >
          Sign In
        </Text>
      </Text>
    </ScrollView>
  );
};

export default RegisterScreen;