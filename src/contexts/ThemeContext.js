// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightColors = {
  primary: '#2c38e4ff',
  secondary: '#f6e75cff',
  background: '#dcf083ff',
  card: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  notification: '#ef4444',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const darkColors = {
  primary: '#f0f881ff',
  secondary: '#3a00e9ff',
  background: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#0d2e5cff',
  notification: '#f87171',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      console.log('Loaded theme from storage:', savedTheme, 'Type:', typeof savedTheme);
      
      if (savedTheme !== null) {
        // Handle the theme value safely - it should always be a string
        if (savedTheme === 'dark') {
          setIsDark(true);
        } else if (savedTheme === 'light') {
          setIsDark(false);
        } else {
          // If it's some other value, use system preference
          console.warn('Unexpected theme value, using system preference:', savedTheme);
          setIsDark(systemColorScheme === 'dark');
        }
      } else {
        // No saved theme, use system preference
        console.log('No saved theme, using system preference:', systemColorScheme);
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to system preference on error
      setIsDark(systemColorScheme === 'dark');
    } finally {
      setIsThemeLoaded(true);
    }
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    console.log('Toggling theme to:', newIsDark ? 'dark' : 'light');
    setIsDark(newIsDark);
    
    try {
      // Always store as string to avoid type casting issues
      await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      console.log('Theme saved to storage:', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  // Show nothing until theme is loaded to prevent flash
  if (!isThemeLoaded) {
    return null;
  }

  const value = {
    colors,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};