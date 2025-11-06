// src/screens/DownloadsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
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
  error: '#ef4444',
  success: '#10b981',
};

const DownloadsScreen = () => {
  const { getDownloadedBooksWithDetails, removeDownload } = useBooks();
  const navigation = useNavigation();

  const downloadedBooks = getDownloadedBooksWithDetails();

  const handleRemoveDownload = (bookId, bookTitle) => {
    Alert.alert(
      'Remove Download',
      `Are you sure you want to remove "${bookTitle}" from downloads?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeDownload(bookId)
        },
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
    fileInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fileDetails: {
      flex: 1,
    },
    fileSize: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    downloadDate: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
    },
    removeButton: {
      backgroundColor: colors.error + '20',
    },
  });

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <View>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
        </View>
        <View style={styles.fileInfo}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileSize}>{formatFileSize(item.fileSize)}</Text>
            <Text style={styles.downloadDate}>
              Downloaded: {new Date(item.downloadDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Reader', { book: item })}
            >
              <Ionicons name="play" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemoveDownload(item.bookId, item.title)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (downloadedBooks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Downloads</Text>
        <View style={styles.emptyContainer}>
          <Ionicons name="download-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No downloads yet.{'\n'}Download books to read offline!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Downloads</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
        {downloadedBooks.length} book{downloadedBooks.length !== 1 ? 's' : ''} downloaded
      </Text>
      
      <FlatList
        data={downloadedBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.bookId}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DownloadsScreen;