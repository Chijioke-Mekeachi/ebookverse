import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { colors } = useTheme();
  const { login, isLoading } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // Success - navigation will be handled by AuthContext or useEffect
        console.log('Login successful');
      } else {
        // Show specific error message from Supabase
        let errorMessage = 'Login failed. Please try again.';
        
        if (result.error) {
          switch (result.error) {
            case 'Invalid login credentials':
              errorMessage = 'Invalid email or password';
              break;
            case 'Email not confirmed':
              errorMessage = 'Please verify your email before logging in';
              break;
            case 'Too many requests':
              errorMessage = 'Too many login attempts. Please try again later.';
              break;
            default:
              errorMessage = result.error;
          }
        }
        
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 30,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
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
    registerText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    },
    registerLink: {
      color: colors.primary,
      fontWeight: '600',
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginBottom: 10,
      textAlign: 'center',
    },
    loadingText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  const isFormValid = email.trim() && password && !isLoggingIn;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue your reading journey</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!isLoggingIn}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        editable={!isLoggingIn}
      />
      
      <TouchableOpacity 
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        {isLoggingIn ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingText}>Signing In...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text 
          style={styles.registerLink}
          onPress={handleRegisterNavigation}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;