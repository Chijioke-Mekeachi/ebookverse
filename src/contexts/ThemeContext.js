// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Extended color palettes with semantic naming
export const lightColors = {
  // Primary brand colors
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  primaryContainer: '#dbeafe',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#001a41',
  
  // Secondary brand colors
  secondary: '#7c3aed',
  secondaryDark: '#6d28d9',
  secondaryLight: '#8b5cf6',
  secondaryContainer: '#f3e8ff',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#24005e',
  
  // Tertiary colors
  tertiary: '#ec4899',
  tertiaryDark: '#db2777',
  tertiaryLight: '#f472b6',
  tertiaryContainer: '#ffe4ec',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#3f0024',
  
  // Neutral backgrounds and surfaces
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  surfaceBright: '#ffffff',
  surfaceDim: '#f1f5f9',
  
  // Text colors with semantic naming
  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textDisabled: '#cbd5e1',
  onBackground: '#0f172a',
  onSurface: '#0f172a',
  onSurfaceVariant: '#475569',
  
  // UI elements
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  divider: '#f1f5f9',
  outline: '#cbd5e1',
  outlineVariant: '#e2e8f0',
  
  // Status colors with containers
  success: '#10b981',
  successContainer: '#d1fae5',
  onSuccess: '#ffffff',
  onSuccessContainer: '#002116',
  
  error: '#dc2626',
  errorContainer: '#fee2e2',
  onError: '#ffffff',
  onErrorContainer: '#410002',
  
  warning: '#f59e0b',
  warningContainer: '#fef3c7',
  onWarning: '#000000',
  onWarningContainer: '#341800',
  
  info: '#06b6d4',
  infoContainer: '#cffafe',
  onInfo: '#000000',
  onInfoContainer: '#001f24',
  
  // Additional UI colors
  card: '#ffffff',
  notification: '#dc2626',
  overlay: 'rgba(15, 23, 42, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  scrim: 'rgba(0, 0, 0, 0.3)',
  
  // Semantic colors for specific components
  inputBackground: '#ffffff',
  inputBorder: '#e2e8f0',
  inputText: '#0f172a',
  placeholder: '#94a3b8',
  
  // Interactive states
  hover: 'rgba(37, 99, 235, 0.08)',
  focus: 'rgba(37, 99, 235, 0.12)',
  pressed: 'rgba(37, 99, 235, 0.16)',
  dragged: 'rgba(37, 99, 235, 0.08)',
  
  // Gradients
  gradientPrimary: ['#2563eb', '#3b82f6'],
  gradientSecondary: ['#7c3aed', '#8b5cf6'],
  gradientSurface: ['#ffffff', '#f8fafc'],
};

export const darkColors = {
  // Primary brand colors
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  primaryContainer: '#1e3a8a',
  onPrimary: '#003063',
  onPrimaryContainer: '#dbeafe',
  
  // Secondary brand colors
  secondary: '#8b5cf6',
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',
  secondaryContainer: '#4c1d95',
  onSecondary: '#3c096c',
  onSecondaryContainer: '#f3e8ff',
  
  // Tertiary colors
  tertiary: '#f472b6',
  tertiaryDark: '#ec4899',
  tertiaryLight: '#f9a8d4',
  tertiaryContainer: '#831843',
  onTertiary: '#500724',
  onTertiaryContainer: '#ffe4ec',
  
  // Neutral backgrounds and surfaces
  background: '#0f172a',
  surface: '#1e293b',
  surfaceVariant: '#334155',
  surfaceBright: '#374151',
  surfaceDim: '#0f172a',
  
  // Text colors with semantic naming
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  textDisabled: '#64748b',
  onBackground: '#f8fafc',
  onSurface: '#f8fafc',
  onSurfaceVariant: '#cbd5e1',
  
  // UI elements
  border: '#334155',
  borderLight: '#1e293b',
  borderDark: '#475569',
  divider: '#1e293b',
  outline: '#475569',
  outlineVariant: '#334155',
  
  // Status colors with containers
  success: '#10b981',
  successContainer: '#064e3b',
  onSuccess: '#002116',
  onSuccessContainer: '#d1fae5',
  
  error: '#ef4444',
  errorContainer: '#7f1d1d',
  onError: '#410002',
  onErrorContainer: '#fee2e2',
  
  warning: '#f59e0b',
  warningContainer: '#78350f',
  onWarning: '#341800',
  onWarningContainer: '#fef3c7',
  
  info: '#06b6d4',
  infoContainer: '#164e63',
  onInfo: '#001f24',
  onInfoContainer: '#cffafe',
  
  // Additional UI colors
  card: '#1e293b',
  notification: '#f87171',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  scrim: 'rgba(0, 0, 0, 0.5)',
  
  // Semantic colors for specific components
  inputBackground: '#1e293b',
  inputBorder: '#334155',
  inputText: '#f8fafc',
  placeholder: '#64748b',
  
  // Interactive states
  hover: 'rgba(59, 130, 246, 0.08)',
  focus: 'rgba(59, 130, 246, 0.12)',
  pressed: 'rgba(59, 130, 246, 0.16)',
  dragged: 'rgba(59, 130, 246, 0.08)',
  
  // Gradients
  gradientPrimary: ['#1e40af', '#3b82f6'],
  gradientSecondary: ['#6d28d9', '#8b5cf6'],
  gradientSurface: ['#1e293b', '#0f172a'],
};

// Additional theme variants
export const highContrastLightColors = {
  ...lightColors,
  primary: '#004492',
  text: '#000000',
  textSecondary: '#1a1a1a',
  border: '#000000',
  success: '#006600',
  error: '#990000',
  warning: '#664400',
};

export const highContrastDarkColors = {
  ...darkColors,
  primary: '#60a5fa',
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  border: '#ffffff',
  success: '#00ff00',
  error: '#ff4444',
  warning: '#ffff00',
};

export const sepiaColors = {
  ...lightColors,
  background: '#f8f0d8',
  surface: '#f4e8c4',
  surfaceVariant: '#e8dcb5',
  text: '#5c4b37',
  textSecondary: '#8b7355',
  textTertiary: '#a69070',
  border: '#e8dcb5',
  card: '#f4e8c4',
};

export const midnightColors = {
  ...darkColors,
  background: '#0a0a0a',
  surface: '#1a1a1a',
  surfaceVariant: '#2a2a2a',
  primary: '#6366f1',
  secondary: '#8b5cf6',
};

const ThemeContext = createContext();

// Theme configuration with metadata
const themeConfig = {
  light: {
    name: 'Light',
    colors: lightColors,
    type: 'light',
    icon: '☀️',
  },
  dark: {
    name: 'Dark',
    colors: darkColors,
    type: 'dark',
    icon: '🌙',
  },
  highContrastLight: {
    name: 'High Contrast Light',
    colors: highContrastLightColors,
    type: 'light',
    icon: '⚫',
    accessibility: true,
  },
  highContrastDark: {
    name: 'High Contrast Dark',
    colors: highContrastDarkColors,
    type: 'dark',
    icon: '⚪',
    accessibility: true,
  },
  sepia: {
    name: 'Sepia',
    colors: sepiaColors,
    type: 'light',
    icon: '📜',
    reading: true,
  },
  midnight: {
    name: 'Midnight',
    colors: midnightColors,
    type: 'dark',
    icon: '🌌',
  },
  auto: {
    name: 'Auto',
    colors: null, // Will be resolved based on system
    type: 'auto',
    icon: '🔄',
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState('auto');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [themeHistory, setThemeHistory] = useState([]);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Available themes for selection
  const availableThemes = Object.keys(themeConfig);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedAnimation = await AsyncStorage.getItem('theme-animations');
      
      console.log('Loaded theme from storage:', savedTheme);
      
      if (savedTheme && themeConfig[savedTheme]) {
        setCurrentTheme(savedTheme);
        addToThemeHistory(savedTheme);
      } else {
        // No saved theme or invalid theme, use auto
        setCurrentTheme('auto');
        addToThemeHistory('auto');
      }

      // Load animation preference
      if (savedAnimation !== null) {
        setAnimationEnabled(savedAnimation === 'true');
      }
      
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      setCurrentTheme('auto');
    } finally {
      setIsThemeLoaded(true);
    }
  };

  const addToThemeHistory = (theme) => {
    setThemeHistory(prev => {
      const newHistory = [theme, ...prev.filter(t => t !== theme)].slice(0, 5);
      return newHistory;
    });
  };

  const getResolvedTheme = () => {
    if (currentTheme === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return currentTheme;
  };

  const getResolvedColors = () => {
    const resolvedTheme = getResolvedTheme();
    return themeConfig[resolvedTheme]?.colors || lightColors;
  };

  const setTheme = async (theme) => {
    if (!themeConfig[theme]) {
      console.error('Invalid theme:', theme);
      return;
    }

    console.log('Setting theme to:', theme);
    setCurrentTheme(theme);
    addToThemeHistory(theme);

    try {
      await AsyncStorage.setItem('theme', theme);
      console.log('Theme saved to storage:', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = async () => {
    const current = getResolvedTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const cycleTheme = async () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    await setTheme(availableThemes[nextIndex]);
  };

  const toggleAnimations = async (enabled) => {
    const newValue = enabled ?? !animationEnabled;
    setAnimationEnabled(newValue);
    
    try {
      await AsyncStorage.setItem('theme-animations', newValue.toString());
    } catch (error) {
      console.error('Error saving animation preference:', error);
    }
  };

  const getThemeInfo = (theme = currentTheme) => {
    return themeConfig[theme] || themeConfig.light;
  };

  const getAccessibilityThemes = () => {
    return availableThemes.filter(theme => themeConfig[theme]?.accessibility);
  };

  const getReadingThemes = () => {
    return availableThemes.filter(theme => themeConfig[theme]?.reading);
  };

  const isHighContrast = () => {
    return currentTheme.includes('highContrast');
  };

  const getColorWithOpacity = (colorKey, opacity = 1) => {
    const colors = getResolvedColors();
    const color = colors[colorKey];
    
    if (!color) return `rgba(0, 0, 0, ${opacity})`;
    
    // Handle hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Handle rgba colors
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, `${opacity})`);
    }
    
    return color;
  };

  const getTextColorForBackground = (backgroundColor) => {
    // Simple luminance calculation to determine text color
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const colors = getResolvedColors();
  const resolvedTheme = getResolvedTheme();
  const themeInfo = getThemeInfo();

  const value = {
    // Core theme state
    colors,
    isDark: resolvedTheme === 'dark',
    themeName: resolvedTheme,
    currentTheme,
    
    // Theme management
    toggleTheme,
    setTheme,
    cycleTheme,
    
    // Theme information
    themeInfo,
    availableThemes,
    getThemeInfo,
    getAccessibilityThemes,
    getReadingThemes,
    isHighContrast,
    
    // Color utilities
    getColorWithOpacity,
    getTextColorForBackground,
    
    // Animation control
    animationEnabled,
    toggleAnimations,
    
    // History and metrics
    themeHistory,
    systemColorScheme,
    
    // Additional context
    isThemeLoaded,
  };

  // Show nothing until theme is loaded to prevent flash
  if (!isThemeLoaded) {
    return null;
  }

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

// Higher-order component for themed components
export const withTheme = (Component) => {
  return (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

// Custom hook for animated theme transitions
export const useThemeAnimation = () => {
  const { animationEnabled, colors } = useTheme();
  
  const createAnimatedStyle = (styleConfig) => {
    if (!animationEnabled) {
      return styleConfig;
    }
    
    return {
      ...styleConfig,
      transition: 'all 0.3s ease-in-out',
    };
  };

  return {
    createAnimatedStyle,
    animationEnabled,
  };
};

// Theme constants for consistent usage
export const ThemeConstants = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  elevation: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    toast: 1200,
    tooltip: 1300,
  },
};

// Utility functions for theme manipulation
export const ThemeUtils = {
  // Generate color variants
  lighten: (color, percent) => {
    // Implementation for lightening colors
    return color; // Simplified - implement color manipulation logic
  },
  
  darken: (color, percent) => {
    // Implementation for darkening colors
    return color; // Simplified - implement color manipulation logic
  },
  
  // Check contrast ratio for accessibility
  getContrastRatio: (color1, color2) => {
    // Implementation for contrast ratio calculation
    return 4.5; // Simplified
  },
  
  // Generate color palette from base color
  generatePalette: (baseColor) => {
    // Implementation for palette generation
    return {
      50: baseColor,
      100: baseColor,
      200: baseColor,
      300: baseColor,
      400: baseColor,
      500: baseColor,
      600: baseColor,
      700: baseColor,
      800: baseColor,
      900: baseColor,
    };
  },
};