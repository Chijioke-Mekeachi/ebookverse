// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book, Eye, EyeOff } from 'lucide-react-native';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const { currentTheme } = useTheme();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: currentTheme === 'dark' ? '#111827' : '#f9fafb' }}
    >
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="items-center mb-12">
          <View className="bg-blue-500 p-4 rounded-2xl mb-4">
            <Book size={40} color="white" />
          </View>
          <Text 
            className="text-3xl font-bold mb-2"
            style={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
          >
            EBookVerse
          </Text>
          <Text 
            className="text-base text-center"
            style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {!isLogin && (
            <View>
              <Text 
                className="text-sm font-medium mb-2"
                style={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
              >
                Full Name
              </Text>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor={currentTheme === 'dark' ? '#6b7280' : '#9ca3af'}
                className="rounded-2xl px-4 py-3 text-base border"
                style={{ 
                  borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
                  backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                  color: currentTheme === 'dark' ? '#f9fafb' : '#111827'
                }}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View>
            <Text 
              className="text-sm font-medium mb-2"
              style={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
            >
              Email
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor={currentTheme === 'dark' ? '#6b7280' : '#9ca3af'}
              className="rounded-2xl px-4 py-3 text-base border"
              style={{ 
                borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
                backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                color: currentTheme === 'dark' ? '#f9fafb' : '#111827'
              }}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text 
              className="text-sm font-medium mb-2"
              style={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
            >
              Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={currentTheme === 'dark' ? '#6b7280' : '#9ca3af'}
                className="rounded-2xl px-4 py-3 text-base border pr-12"
                style={{ 
                  borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb',
                  backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                  color: currentTheme === 'dark' ? '#f9fafb' : '#111827'
                }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={currentTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                ) : (
                  <Eye size={20} color={currentTheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-2xl mt-6"
            onPress={handleAuth}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            className="mt-4"
          >
            <Text className="text-center text-blue-500">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};