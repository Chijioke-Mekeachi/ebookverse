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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooks } from '../contexts/BooksContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS = {
  primary: '#6366f1',
  background: '#ffffff',
  card: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
};

const BookDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params || {};
  const { purchaseBook, downloadBook, isBookPurchased, isBookDownloaded } = useBooks();

  const isPurchased = isBookPurchased(book?.id);
  const isDownloaded = isBookDownloaded(book?.id);

  const handlePurchase = async () => {
    if (!book) return;
    
    if (book.type === 'free') {
      const success = await downloadBook(book);
      if (success) {
        Alert.alert('Success', 'Book downloaded successfully!');
      }
    } else {
      navigation.navigate('Payment', { book });
    }
  };

  const handleRead = () => {
    if (!book) return;
    navigation.navigate('Reader', { book });
  };

  const handleDownload = async () => {
    if (!book) return;
    const success = await downloadBook(book);
    if (success) {
      Alert.alert('Success', 'Book downloaded successfully!');
    }
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Book not found</Text>
      </View>
    );
  }

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

          {isPurchased && isDownloaded ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleRead}>
              <Text style={styles.primaryButtonText}>Read Now</Text>
            </TouchableOpacity>
          ) : isPurchased ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleDownload}>
              <Text style={styles.primaryButtonText}>Download</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handlePurchase}>
              <Text style={styles.primaryButtonText}>
                {book.type === 'free' ? 'Download Free' : `Buy for $${book.price}`}
              </Text>
            </TouchableOpacity>
          )}

          {isPurchased && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Library')}
            >
              <Text style={styles.secondaryButtonText}>
                View in Library
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  coverContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.card,
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
    color: COLORS.text,
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.card,
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
    color: COLORS.text,
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BookDetailsScreen;