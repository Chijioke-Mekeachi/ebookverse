// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#6366f1', // primary color
    },
    content: {
      alignItems: 'center',
    },
    icon: {
      marginBottom: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#ffffff',
      opacity: 0.8,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Ionicons name="library" size={80} color="#ffffff" style={styles.icon} />
        <Text style={styles.title}>EBook </Text>
        <Text style={styles.subtitle}>Your Digital Library</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;