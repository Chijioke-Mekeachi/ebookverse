// src/screens/BookDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const BookDetailsScreen = () => {
  const { colors } = useTheme();
  const { purchaseBook, downloadBook, isBookPurchased, isBookDownloaded } = useBooks();
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;

  const isPurchased = isBookPurchased(book.id);
  const isDownloaded = isBookDownloaded(book.id);

  const handlePurchase = async () => {
    if (book.type === 'free') {
      const success = await downloadBook(book);
      if (success) {
        Alert.alert('Success', 'Book downloaded successfully!');
        navigation.navigate('Downloads');
      }
    } else {
      navigation.navigate('Payment', { book });
    }
  };

  const handleRead = () => {
    navigation.navigate('Reader', { book });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    coverContainer: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: colors.card,
    },
    coverImage: {
      width: 200,
      height: 300,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    infoContainer: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    author: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    rating: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    metaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    metaItem: {
      alignItems: 'center',
    },
    metaValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    metaLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 30,
    },
    actionButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    actionButtonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    actionButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    actionButtonTextSecondary: {
      color: colors.primary,
    },
    price: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
  });

  const getActionButton = () => {
    if (isPurchased && isDownloaded) {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={handleRead}>
          <Text style={styles.actionButtonText}>Read Now</Text>
        </TouchableOpacity>
      );
    } else if (isPurchased) {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={() => downloadBook(book)}>
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={handlePurchase}>
          <Text style={styles.actionButtonText}>
            {book.type === 'free' ? 'Download Free' : `Buy for $${book.price}`}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.cover }} style={styles.coverImage} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#fbbf24" />
            <Text style={styles.rating}>{book.rating} • {book.category}</Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{book.pages}</Text>
              <Text style={styles.metaLabel}>Pages</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{book.language}</Text>
              <Text style={styles.metaLabel}>Language</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{book.type}</Text>
              <Text style={styles.metaLabel}>Type</Text>
            </View>
          </View>

          <Text style={styles.description}>{book.description}</Text>

          {getActionButton()}

          {isPurchased && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('Downloads')}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                View in Library
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookDetailsScreen;