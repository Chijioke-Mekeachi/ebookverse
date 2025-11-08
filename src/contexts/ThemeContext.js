// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightColors = {
  // Modern, professional color palette
  primary: '#2563eb',      // Vibrant blue
  primaryDark: '#1d4ed8',  // Darker blue for pressed states
  primaryLight: '#3b82f6', // Lighter blue for highlights
  
  secondary: '#7c3aed',    // Elegant purple
  secondaryDark: '#6d28d9',
  secondaryLight: '#8b5cf6',
  
  // Neutral backgrounds and surfaces
  background: '#f8fafc',   // Very light gray-blue
  surface: '#ffffff',      // Pure white for cards
  surfaceVariant: '#f1f5f9', // Slightly darker for contrast
  
  // Text colors
  text: '#0f172a',         // Almost black for high contrast
  textSecondary: '#475569', // Medium gray for less important text
  textTertiary: '#94a3b8', // Light gray for disabled/placeholder
  
  // UI elements
  border: '#e2e8f0',       // Subtle border
  borderLight: '#f1f5f9',  // Very light border
  divider: '#f1f5f9',      // For separating sections
  
  // Status colors
  success: '#10b981',      // Green
  successLight: '#34d399',
  error: '#dc2626',        // Red
  errorLight: '#ef4444',
  warning: '#f59e0b',      // Amber
  warningLight: '#fbbf24',
  info: '#06b6d4',         // Cyan
  
  // Additional UI colors
  card: '#ffffff',
  notification: '#dc2626',
  overlay: 'rgba(15, 23, 42, 0.4)', // For modals and overlays
};

export const darkColors = {
  // Deep, rich dark theme
  primary: '#3b82f6',      // Bright blue that pops on dark
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  
  secondary: '#8b5cf6',    // Vibrant purple
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',
  
  // Dark backgrounds with depth
  background: '#0f172a',   // Deep blue-black
  surface: '#1e293b',      // Card background
  surfaceVariant: '#334155', // Slightly lighter for contrast
  
  // Text colors optimized for dark mode
  text: '#f8fafc',         // Off-white for readability
  textSecondary: '#cbd5e1', // Light gray
  textTertiary: '#94a3b8', // Medium gray
  
  // UI elements for dark mode
  border: '#334155',       // Visible but not harsh
  borderLight: '#1e293b',  // Subtle borders
  divider: '#1e293b',      // Section dividers
  
  // Status colors adjusted for dark background
  success: '#10b981',
  successLight: '#34d399',
  error: '#ef4444',
  errorLight: '#f87171',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  info: '#06b6d4',
  
  // Additional UI colors
  card: '#1e293b',
  notification: '#f87171',
  overlay: 'rgba(0, 0, 0, 0.6)', // Darker overlay for modals
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

  const setTheme = async (theme) => {
    const newIsDark = theme === 'dark';
    console.log('Setting theme to:', theme);
    setIsDark(newIsDark);
    
    try {
      await AsyncStorage.setItem('theme', theme);
      console.log('Theme saved to storage:', theme);
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
    setTheme,
    themeName: isDark ? 'dark' : 'light',
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