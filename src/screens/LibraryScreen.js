// src/screens/LibraryScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useBooks } from '../contexts/BooksContext';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Static colors
const colors = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
};

const LibraryScreen = () => {
  const { getPurchasedBooksWithDetails } = useBooks();
  const navigation = useNavigation();

  const purchasedBooks = getPurchasedBooksWithDetails();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
      lineHeight: 24,
    },
    bookCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    coverImage: {
      width: 60,
      height: 90,
      borderRadius: 8,
    },
    bookInfo: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    bookTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    bookAuthor: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginRight: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
      minWidth: 40,
    },
    lastRead: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
    },
    continueButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 8,
    },
    continueButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
  });

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('Reader', { book: item })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <View>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          
          {item.readingProgress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${item.readingProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(item.readingProgress)}%</Text>
            </View>
          )}
          
          {item.lastRead && (
            <Text style={styles.lastRead}>
              Last read: {new Date(item.lastRead).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('Reader', { book: item })}
        >
          <Text style={styles.continueButtonText}>
            {item.readingProgress > 0 ? 'Continue' : 'Start Reading'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (purchasedBooks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Library</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="library-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No books purchased yet.{'\n'}Browse the store to build your library!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Library</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
        {purchasedBooks.length} book{purchasedBooks.length !== 1 ? 's' : ''} in your collection
      </Text>
      
      <FlatList
        data={purchasedBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.bookId}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LibraryScreen;