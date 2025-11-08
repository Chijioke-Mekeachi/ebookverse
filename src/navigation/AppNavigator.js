// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, ThemeConstants } from '../contexts/ThemeContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReaderScreen from '../screens/ReaderScreen';
import SettingsScreen from '../screens/SettingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { colors, isDark } = useTheme();

  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    
    // Hide tab bar on specific screens
    const hideTabBarRoutes = ['Reader', 'Payment'];
    if (hideTabBarRoutes.includes(routeName)) {
      return { display: 'none' };
    }

    return {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: 60 + ThemeConstants.spacing.sm,
      paddingBottom: ThemeConstants.spacing.sm,
      paddingTop: ThemeConstants.spacing.sm,
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    };
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Downloads') {
            iconName = focused ? 'download' : 'download-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: getTabBarStyle(route),
        tabBarLabelStyle: {
          fontSize: ThemeConstants.typography.sizes.xs,
          fontWeight: '600',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: ThemeConstants.typography.sizes.lg,
        },
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Discover',
          headerTitle: 'EBookVerse',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: ThemeConstants.typography.sizes.xl,
            color: colors.text,
          },
        }} 
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ 
          title: 'Library',
          headerTitle: 'My Library',
        }} 
      />
      <Tab.Screen 
        name="Downloads" 
        component={DownloadsScreen} 
        options={{ 
          title: 'Downloads',
          headerTitle: 'My Downloads',
          tabBarBadge: () => {
            // You can add dynamic badge count here
            return null;
          },
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          headerTitle: 'My Profile',
        }} 
      />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen} 
        options={{ 
          headerShown: false,
          cardStyle: { backgroundColor: colors.background }
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          headerShown: true,
          title: 'Sign In',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: { backgroundColor: colors.background }
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          headerShown: true,
          title: 'Create Account',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          cardStyle: { backgroundColor: colors.background }
        }}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const { colors, isDark } = useTheme();

  const getHeaderStyle = (route) => {
    // Custom header styles for specific screens
    const transparentHeaderRoutes = ['Reader'];
    if (transparentHeaderRoutes.includes(route.name)) {
      return {
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        elevation: 0,
      };
    }

    return {
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    };
  };

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: getHeaderStyle(route),
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: ThemeConstants.typography.sizes.lg,
        },
        headerBackTitle: 'Back',
        cardStyle: {
          backgroundColor: colors.background,
        },
        animationEnabled: true,
        gestureEnabled: true,
      })}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="BookDetails" 
        component={BookDetailsScreen}
        options={({ route }) => ({ 
          headerShown: true,
          headerBackTitle: 'Back',
          title: route.params?.book?.title?.length > 24 
            ? route.params.book.title.substring(0, 24) + '...' 
            : route.params?.book?.title || 'Book Details',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: ThemeConstants.typography.sizes.md,
          },
        })}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ 
          headerShown: true,
          headerBackTitle: 'Cancel',
          title: 'Complete Purchase',
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            elevation: 8,
          },
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          headerShown: true,
          headerBackTitle: 'Back',
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  if (isLoading) {
    return <SplashScreen />;
  }

  const globalScreenOptions = {
    headerStyle: {
      backgroundColor: colors.surface,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '600',
    },
    cardStyle: {
      backgroundColor: colors.background,
    },
    animation: 'slide_from_right',
  };

  return (
    <Stack.Navigator 
      screenOptions={globalScreenOptions}
    >
      {!user ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthStack} 
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen 
          name="App" 
          component={AppStack} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;