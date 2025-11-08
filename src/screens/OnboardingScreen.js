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
      backgroundColor: '#3333AA',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical:100,
    },
    title: {
      fontSize: 36,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 40,
    },
    button: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      width: '90%',
      marginBottom: 12,
      height:60,
      justifyContent:'center',
      backgroundColor: '#FFFFFF',
    },
    buttonText: {
      color: '#3388FF',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#3388FF',
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
      <View style={{flex:1, justifyContent: 'flex-end', alignItems:'center', width:'100%'}}>
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

    </View>
  );
};

export default OnboardingScreen;