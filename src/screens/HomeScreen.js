// src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useBooks } from '../contexts/BooksContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme, ThemeConstants } from '../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const { books, isLoading } = useBooks();
  const navigation = useNavigation();
  const { 
    colors, 
    isDark, 
    toggleTheme, 
    animationEnabled,
    getColorWithOpacity 
  } = useTheme();
  
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Fiction', 'Technology', 'Self-Help', 'Philosophy'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Responsive sizing based on screen dimensions
  const responsiveSize = {
    padding: {
      sm: Math.max(8, windowWidth * 0.02),
      md: Math.max(16, windowWidth * 0.04),
      lg: Math.max(20, windowWidth * 0.05),
      xl: Math.max(24, windowWidth * 0.06),
    },
    font: {
      xs: Math.max(12, windowWidth * 0.03),
      sm: Math.max(14, windowWidth * 0.035),
      md: Math.max(16, windowWidth * 0.04),
      lg: Math.max(18, windowWidth * 0.045),
      xl: Math.max(20, windowWidth * 0.05),
      xxl: Math.max(24, windowWidth * 0.06),
      xxxl: Math.max(32, windowWidth * 0.08),
    },
    image: {
      width: Math.max(80, windowWidth * 0.2),
      height: Math.max(120, windowWidth * 0.3),
    },
    card: {
      margin: Math.max(8, windowWidth * 0.02),
      padding: Math.max(16, windowWidth * 0.04),
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      maxWidth: 500, // Maintain formal size on tablets
      alignSelf: 'center', // Center on wider screens
      width: '100%', // Full width on mobile
    },
    header: {
      padding: responsiveSize.padding.lg,
      paddingBottom: 0,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: responsiveSize.padding.sm,
    },
    titleContainer: {
      flex: 1,
      marginRight: responsiveSize.padding.md,
    },
    title: {
      fontSize: responsiveSize.font.xxxl,
      fontWeight: ThemeConstants.typography.weights.bold,
      color: colors.text,
      marginBottom: responsiveSize.padding.xs,
    },
    subtitle: {
      fontSize: responsiveSize.font.md,
      color: colors.textSecondary,
      marginBottom: responsiveSize.padding.lg,
      lineHeight: 20,
    },
    themeToggle: {
      padding: responsiveSize.padding.sm,
      borderRadius: ThemeConstants.borderRadius.round,
      backgroundColor: getColorWithOpacity('primary', 0.1),
      marginTop: responsiveSize.padding.xs,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: ThemeConstants.borderRadius.lg,
      paddingHorizontal: responsiveSize.padding.md,
      marginBottom: responsiveSize.padding.lg,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 52,
      ...ThemeConstants.elevation.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: responsiveSize.padding.md,
      paddingHorizontal: responsiveSize.padding.sm,
      color: colors.text,
      fontSize: responsiveSize.font.md,
      includeFontPadding: false,
    },
    categoriesContainer: {
      paddingHorizontal: responsiveSize.padding.lg,
      marginBottom: responsiveSize.padding.lg,
    },
    categoriesScroll: {
      flexDirection: 'row',
    },
    categoryChip: {
      paddingHorizontal: responsiveSize.padding.md,
      paddingVertical: responsiveSize.padding.sm,
      borderRadius: ThemeConstants.borderRadius.round,
      marginRight: responsiveSize.padding.sm,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 36,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: responsiveSize.font.sm,
      fontWeight: ThemeConstants.typography.weights.medium,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    categoryTextSelected: {
      color: colors.onPrimary,
    },
    sectionTitle: {
      fontSize: responsiveSize.font.xxl,
      fontWeight: ThemeConstants.typography.weights.bold,
      color: colors.text,
      marginHorizontal: responsiveSize.padding.lg,
      marginBottom: responsiveSize.padding.md,
    },
    booksList: {
      paddingHorizontal: responsiveSize.padding.lg,
      flex: 1,
    },
    bookCard: {
      backgroundColor: colors.surface,
      borderRadius: ThemeConstants.borderRadius.lg,
      padding: responsiveSize.card.padding,
      marginBottom: responsiveSize.card.margin,
      borderWidth: 1,
      borderColor: colors.borderLight,
      minHeight: 152,
      ...ThemeConstants.elevation.sm,
    },
    bookCardContent: {
      flexDirection: 'row',
      flex: 1,
    },
    coverImage: {
      width: responsiveSize.image.width,
      height: responsiveSize.image.height,
      borderRadius: ThemeConstants.borderRadius.md,
      backgroundColor: colors.surfaceVariant,
    },
    bookInfo: {
      flex: 1,
      marginLeft: responsiveSize.padding.md,
      justifyContent: 'space-between',
    },
    bookTitle: {
      fontSize: responsiveSize.font.lg,
      fontWeight: ThemeConstants.typography.weights.semibold,
      color: colors.text,
      marginBottom: responsiveSize.padding.xs,
      lineHeight: 22,
    },
    bookAuthor: {
      fontSize: responsiveSize.font.sm,
      color: colors.textSecondary,
      marginBottom: responsiveSize.padding.sm,
      lineHeight: 18,
    },
    bookDescription: {
      fontSize: responsiveSize.font.xs,
      color: colors.textTertiary,
      marginBottom: responsiveSize.padding.sm,
      lineHeight: 16,
      flex: 1,
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: responsiveSize.padding.sm,
    },
    price: {
      fontSize: responsiveSize.font.md,
      fontWeight: ThemeConstants.typography.weights.bold,
      color: colors.primary,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      maxWidth: 500,
      alignSelf: 'center',
      width: '100%',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveSize.padding.xl,
      minHeight: 300,
    },
    emptyStateText: {
      fontSize: responsiveSize.font.lg,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: responsiveSize.padding.md,
      lineHeight: 24,
    },
    emptyStateSubtext: {
      fontSize: responsiveSize.font.md,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: responsiveSize.padding.sm,
      lineHeight: 20,
    },
    contentContainer: {
      flexGrow: 1,
    },
  });

  const renderBookItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
      activeOpacity={0.7}
    >
      <View style={styles.bookCardContent}>
        <Image 
          source={{ uri: item.cover }} 
          style={styles.coverImage}
          defaultSource={require('../../assets/logo.png')}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1} ellipsizeMode="tail">
              {item.author}
            </Text>
            <Text style={styles.bookDescription} numberOfLines={3} ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {item.type === 'free' ? 'Free' : `$${item.price}`}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={[styles.bookAuthor, { marginLeft: 4 }]}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="book-outline" 
        size={64} 
        color={colors.textTertiary} 
      />
      <Text style={styles.emptyStateText}>
        No books found
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery ? 'Try adjusting your search terms' : 'No books available in this category'}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyStateText, { marginTop: responsiveSize.padding.md }]}>
          Loading books...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>EBookVerse</Text>
            <Text style={styles.subtitle}>Discover your next favorite book</Text>
          </View>
          <TouchableOpacity 
            style={styles.themeToggle}
            onPress={toggleTheme}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.textSecondary} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books or authors..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            returnKeyType="search"
            enablesReturnKeyAutomatically={true}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={colors.textTertiary} 
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingRight: responsiveSize.padding.lg }}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>
        {selectedCategory === 'All' ? 'Featured Books' : selectedCategory}
        {filteredBooks.length > 0 && ` (${filteredBooks.length})`}
      </Text>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredBooks.length === 0 ? styles.contentContainer : styles.contentContainer
        }
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default HomeScreen;