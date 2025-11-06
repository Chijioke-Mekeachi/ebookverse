// src/screens/ReaderScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ReaderScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;
  const [fontSize, setFontSize] = useState(16);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const toggleControls = () => {
    setIsControlsVisible(!isControlsVisible);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      flex: 1,
      textAlign: 'center',
    },
    chapterTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 20,
      textAlign: 'center',
    },
    contentText: {
      fontSize: fontSize,
      lineHeight: fontSize * 1.6,
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'justify',
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#e0e0e0',
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    fontControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fontButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    fontSizeText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '600',
    },
    progressBar: {
      height: 4,
      backgroundColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 2,
      marginBottom: 10,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
      width: '30%', // This would come from actual reading progress
    },
    progressText: {
      fontSize: 12,
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
    },
  });

  // Mock chapter content
  const chapterContent = `This is a sample chapter from "${book.title}" by ${book.author}.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor={isDark ? '#000000' : '#ffffff'} 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
      />
      
      {isControlsVisible && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <TouchableOpacity onPress={toggleControls}>
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.content} 
        activeOpacity={1}
        onPress={toggleControls}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.chapterTitle}>Chapter 1</Text>
          <Text style={styles.contentText}>{chapterContent}</Text>
        </ScrollView>
      </TouchableOpacity>

      {isControlsVisible && (
        <View style={styles.controls}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>30% completed</Text>
          
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={decreaseFontSize}>
              <Ionicons 
                name="remove" 
                size={24} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
            
            <View style={styles.fontControls}>
              <TouchableOpacity 
                style={styles.fontButton}
                onPress={decreaseFontSize}
              >
                <Ionicons name="remove" size={20} color="#ffffff" />
              </TouchableOpacity>
              
              <Text style={styles.fontSizeText}>{fontSize}px</Text>
              
              <TouchableOpacity 
                style={styles.fontButton}
                onPress={increaseFontSize}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={increaseFontSize}>
              <Ionicons 
                name="add" 
                size={24} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReaderScreen;